interface DecodedToken {
  roles?: string | string[];  // Make roles optional and accept string or array
  role?: string | string[];   // Add role (singular) as an alternative
  authorities?: string | string[]; // Add authorities as another alternative
  id: string;
  email: string;
  sub: string; // username
  iat: number;
  exp: number;
  nomorCabang?: string | number; // Add nomorCabang property
  cabang?: string | number; // Add cabang property
}

// Use a consistent token key
const TOKEN_KEY = 'accessToken'; // Match what's used in NotificationPage

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const parseJwt = (token: string): DecodedToken | null => {
  try {
    // Get the payload part of the token (second part between the dots)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

export const getCabangNumberFromToken = (): number => {
  try {
    const token = getToken();
    if (!token) {
      console.error('No token found in localStorage');
      return 1; // Default to cabang 1
    }
    
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
      console.error('Failed to decode token');
      return 1; // Default to cabang 1
    }
    
    // Extract nomorCabang from token and ensure it's an integer
    let cabangNumber = 1; // Default value
    
    if (decodedToken.nomorCabang !== undefined) {
      cabangNumber = typeof decodedToken.nomorCabang === 'string' 
        ? parseInt(decodedToken.nomorCabang, 10) 
        : decodedToken.nomorCabang;
    } else if (decodedToken.cabang !== undefined) {
      cabangNumber = typeof decodedToken.cabang === 'string' 
        ? parseInt(decodedToken.cabang, 10) 
        : decodedToken.cabang;
    }
    
    return cabangNumber;
  } catch (error) {
    console.error('Error getting cabang number from token:', error);
    return 1; // Default to cabang 1
  }
};

export const getRoleFromToken = (): string => {
  try {
    const token = getToken();
    if (!token) {
      console.error('No token found in localStorage');
      return '';
    }
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
      console.error('Failed to decode token');
      return '';
    }
    // Log the entire token to see its structure
    console.log('Decoded token:', decodedToken);
    // Check for different possible formats of roles in the token
    if (typeof decodedToken.roles === 'string') {
      return decodedToken.roles;
    } else if (Array.isArray(decodedToken.roles) && decodedToken.roles.length > 0) {
      return decodedToken.roles[0];
    } else if (typeof decodedToken.role === 'string') {
      return decodedToken.role;
    } else if (Array.isArray(decodedToken.role) && decodedToken.role.length > 0) {
      return decodedToken.role[0];
    } else if (typeof decodedToken.authorities === 'string') {
      return decodedToken.authorities;
    } else if (Array.isArray(decodedToken.authorities) && decodedToken.authorities.length > 0) {
      return decodedToken.authorities[0];
    }
    // Alternative: Directly call the backend endpoint to get the role
    // This would be implemented in a separate function - see getBackendRole below
    console.warn('No role information found in token');
    return '';
  } catch (error) {
    console.error('Error getting role from token:', error);
    return '';
  }
};

export const getBackendRole = async (): Promise<string> => {
  try {
    const token = getToken();
    if (!token) return '';
    
    const response = await fetch('http://localhost:8080/api/auth/role', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to get role from backend');
    
    const data = await response.json();
    if (data.status === 200 && data.data) {
      return data.data;
    }
    
    return '';
  } catch (error) {
    console.error('Error getting role from backend:', error);
    return '';
  }
};

export const isTokenValid = (): boolean => {
  try {
    const token = getToken();
    if (!token) return false;
    const decodedToken = parseJwt(token);
    if (!decodedToken) return false;
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};