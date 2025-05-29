import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import box from "../assets/box.svg";
import commerce from "../assets/commerce.svg";
import graph from "../assets/graph.svg";
import logoutIcon from "../assets/logout.svg"; // Renamed import
import home from "../assets/home.svg";
import authentication from "../services/authentication";
import { PenggunaResponse } from "../interface/Pengguna";

// --- Define Menu Item Structure ---
interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [userCabang, setUserCabang] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true); // Loading state for profile fetch
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // State to hold the final menu items

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userIsLoggedIn = !!accessToken;
    console.log(roleUser, userCabang);
    setIsLoggedIn(userIsLoggedIn);

    if (!userIsLoggedIn) {
      console.log("Sidebar: User is not logged in.");
      setIsLoadingProfile(false); // Not logged in, so not loading profile
      setMenuItems([]); // Ensure menu is empty if logged out
      return; // Stop execution if not logged in
    }

    // If logged in, proceed to fetch profile
    console.log("Sidebar: User is logged in. Fetching profile...");
    setIsLoadingProfile(true); // Start loading profile

    authentication
      .getProfileService(accessToken) // Assume accessToken is not null here due to above check
      .then((response) => {
        // Type guard to check if the response is an error string
        if (typeof response === "string") {
          console.error("Error fetching profile:", response);
          // Handle error appropriately - maybe log out, show message, etc.
          localStorage.clear(); // Example: Clear storage on profile error
          setIsLoggedIn(false);
          setRoleUser(null);
          setUserCabang(null);
          setMenuItems([]);
          navigate("/login"); // Redirect to login on profile fetch failure
          return;
        }

        const userData: PenggunaResponse = response;
        console.log("Profile fetched:", userData);
        setRoleUser(userData.role);
        setUserCabang(userData.nomorCabang); // Set userCabang state here
        

        if (userData.role === "Kepala Operasional Cabang") {
           setMenuItems(generatePengadaanCabangSidebar(userData.nomorCabang, userData.cabangAsli)); // Pass cabang and isCabangAsli
        } else if (userData.role === "Staf Gudang Pelaksana Umum") {
            setMenuItems(generatePengadaanStafGudangSidebar(userData.nomorCabang)); // Pass cabang for consistency if needed
        } else if (userData.role === "Kepala Departemen SDM dan Umum" || userData.role === "Staf keuangan") {
            setMenuItems(generatePengadaanKepalaDepartemenSDMSidebar(userData.nomorCabang)); // Pass cabang for consistency if needed
        } else if (userData.role === "Direktur") {
            setMenuItems(generateDirekturSidebar(userData.nomorCabang)); // Pass cabang for consistency if needed
        } else if (userData.role === "Admin") {
            setMenuItems(generateAdminSidebar(userData.nomorCabang)); // Pass cabang for consistency if needed
        }
        else if (userData.role === "Staf Inventarisasi" || userData.role === "Staf Pengadaan dan Pembelian") {
            setMenuItems(generateStafInventarisSidebar(userData.nomorCabang)); // Pass cabang for consistency if needed
        } else {
           setMenuItems(generatePengadaanPusatSidebar(userData.nomorCabang)); // Pass cabang for consistency if needed
        }
        // ----------------------------------------------------

      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        // Handle error appropriately
        localStorage.clear();
        setIsLoggedIn(false);
        setRoleUser(null);
        setUserCabang(null);
        setMenuItems([]);
        navigate("/login");
      })
      .finally(() => {
        setIsLoadingProfile(false); // Finish loading profile (success or fail)
      });

    // --- DO NOT check roleUser or call menu functions here ---
    // It's too early; the state hasn't updated yet from the async call.
      
  }, [navigate]); // Add navigate to dependencies as it's used in effect


  // --- Menu Generation Functions ---
  // These functions now take userCabang as an argument
  // Or they could directly access the state if defined inside the component body,
  // but passing it makes them more reusable/testable if needed.

  const generatePengadaanPusatSidebar = (cabang: string | null): MenuItem[] => {
    const pusatCabangPlaceholder = cabang || "PUSAT"; // Use 'PUSAT' or similar if needed, or handle null appropriately
    return [
      { icon: graph, label: "Dashboard", path: "/dashboard-pusat" },
      { icon: home, label: "Login", path: "/login" },
      { icon: commerce, label: "Barang", path: "/barang"},
      { icon: home, label: "Cabang Asli", path: "/cabang-asli" },
      { icon: home, label: "Cabang Kerja Sama", path: "/cabang-kerja-sama" },
      { icon: commerce, label: "List Pengadaan Pusat", path: "/pengadaan-pusat" },
      { icon: box, label: "Create Pengadaan Pusat", path: "/pengadaan-pusat/input" },
      { icon: commerce, label: "List Pengadaan Cabang", path: `/pengadaan-cabang-asli/cabang/${pusatCabangPlaceholder}` }, // Maybe show all? Or specific view?
      { icon: commerce, label: "Return Barang", path: "/return" },
      { icon: graph, label: "Tren Permintaan Buku", path:"/tren-permintaan-buku" },
      { icon: graph, label: "Informasi Stok Menipis", path:"/stok-menipis" }, 
      { icon: box, label: "Pengurangan Stok", path: `/pengurangan-stok/${pusatCabangPlaceholder}` }, 
    ];
  }

  const generatePengadaanStafGudangSidebar = (cabang: string | null): MenuItem[] => {
    const pusatCabangPlaceholder = cabang || "PUSAT"; // Use 'PUSAT' or similar if needed, or handle null appropriately
    return [
      { icon: graph, label: "Dashboard", path: "/dashboard-pusat" },
      { icon: commerce, label: "Barang", path: "/barang"},
      { icon: home, label: "Cabang Asli", path: "/cabang-asli" },
      { icon: home, label: "Cabang Kerja Sama", path: "/cabang-kerja-sama" },
      { icon: commerce, label: "List Pengadaan Pusat", path: "/pengadaan-pusat" },
      { icon: box, label: "Create Pengadaan Pusat", path: "/pengadaan-pusat/input" },
      { icon: commerce, label: "List Pengadaan Cabang", path: `/pengadaan-cabang-asli/cabang/${pusatCabangPlaceholder}` }, // Maybe show all? Or specific view?
      { icon: commerce, label: "Return Barang", path: "/return" },
      { icon: box, label: "Pengurangan Stok", path: `/pengurangan-stok/${pusatCabangPlaceholder}` }
    ]
  }

  const generatePengadaanKepalaDepartemenSDMSidebar = (cabang: string | null): MenuItem[] => {
    const pusatCabangPlaceholder = cabang || "PUSAT"; // Use 'PUSAT' or similar if needed, or handle null appropriately
    return [
      { icon: graph, label: "Dashboard", path: "/dashboard-pusat" },
      { icon: commerce, label: "Barang", path: "/barang"},
      { icon: home, label: "Cabang Asli", path: "/cabang-asli" },
      { icon: home, label: "Cabang Kerja Sama", path: "/cabang-kerja-sama" },
      { icon: commerce, label: "List Pengadaan Pusat", path: "/pengadaan-pusat" },
      { icon: commerce, label: "List Pengadaan Cabang", path: `/pengadaan-cabang-asli/cabang/${pusatCabangPlaceholder}` }, // Maybe show all? Or specific view?
      { icon: commerce, label: "Return Barang", path: "/return" },
      { icon: box, label: "Inisiasi Pengecekan", path: "/inisiasi-pengecekan" },
      { icon: graph, label: "Tren Permintaan Buku", path:"/tren-permintaan-buku" },
      { icon: graph, label: "Informasi Stok Menipis", path:"/stok-menipis" }, 
  
    ]
  }

  const generateDirekturSidebar = (cabang: string | null): MenuItem[] => {
    const pusatCabangPlaceholder = cabang || "PUSAT"; // Use 'PUSAT' or similar if needed, or handle null appropriately
    return [
      { icon: graph, label: "Dashboard", path: "/dashboard-pusat" },
      { icon: home, label: "Cabang Asli", path: "/cabang-asli" },
      { icon: home, label: "Cabang Kerja Sama", path: "/cabang-kerja-sama" },
      { icon: commerce, label: "List Pengadaan Pusat", path: "/pengadaan-pusat" },
      { icon: commerce, label: "List Pengadaan Cabang", path: `/pengadaan-cabang-asli/cabang/${pusatCabangPlaceholder}` }, // Maybe show all? Or specific view?
      { icon: commerce, label: "Return Barang", path: "/return" },
      { icon: box, label: "Inisiasi Pengecekan", path: "/inisiasi-pengecekan" },
      { icon: graph, label: "Tren Permintaan Buku", path:"/tren-permintaan-buku" },
      { icon: graph, label: "Informasi Stok Menipis", path:"/stok-menipis" }, 
    ]
  }

  const generateAdminSidebar = (cabang: string | null): MenuItem[] => {
    const pusatCabangPlaceholder = cabang || "PUSAT"; // Use 'PUSAT' or similar if needed, or handle null appropriately
    return [
      { icon: graph, label: "Dashboard", path: "/dashboard-pusat" },
      { icon: home, label: "Registrasi Pengguna", path: "/register" },
      { icon: home, label: "Edit Profile", path: "/edit-profile" },
      { icon: commerce, label: "Barang", path: "/barang"},
      { icon: home, label: "Cabang Asli", path: "/cabang-asli" },
      { icon: home, label: "Cabang Kerja Sama", path: "/cabang-kerja-sama" },
      { icon: commerce, label: "List Pengadaan Pusat", path: "/pengadaan-pusat" },
      { icon: commerce, label: "List Pengadaan Cabang", path: `/pengadaan-cabang-asli/cabang/${pusatCabangPlaceholder}` }, // Maybe show all? Or specific view?
      { icon: commerce, label: "Return Barang", path: "/return" },
      { icon: box, label: "Pengurangan Stok", path: `/pengurangan-stok/${pusatCabangPlaceholder}` },
      { icon: box, label: "Inisiasi Pengecekan", path: "/inisiasi-pengecekan" },
    ]
  }

   const generateStafInventarisSidebar = (cabang: string | null): MenuItem[] => {
    const pusatCabangPlaceholder = cabang || "PUSAT"; // Use 'PUSAT' or similar if needed, or handle null appropriately
    return [
      { icon: graph, label: "Dashboard", path: "/dashboard-pusat" },
      { icon: home, label: "Cabang Asli", path: "/cabang-asli" },
      { icon: home, label: "Cabang Kerja Sama", path: "/cabang-kerja-sama" },
      { icon: commerce, label: "List Pengadaan Pusat", path: "/pengadaan-pusat" },
      { icon: commerce, label: "List Pengadaan Cabang", path: `/pengadaan-cabang-asli/cabang/${pusatCabangPlaceholder}` }, 
      { icon: graph, label: "Tren Permintaan Buku", path:"/tren-permintaan-buku" },
    ]
  }
  // Assuming MenuItem and icon types are defined elsewhere
// interface MenuItem { icon: any; label: string; path: string; }
// const graph = "graph_icon"; const home = "home_icon"; const commerce = "commerce_icon"; const box = "box_icon";

const generatePengadaanCabangSidebar = (
  cabang: string | null,
  isUserFromCabangAsli: boolean // <--- New parameter
): MenuItem[] => {
  const currentCabang = cabang || "N/A"; // Fallback if cabang is unexpectedly null

  const menuItems: MenuItem[] = [
    { icon: graph, label: "Dashboard", path: `/dashboard-cabang/${currentCabang}` },
     { icon: commerce, label: "Barang", path: "/barang"},
    { icon: commerce, label: "Status Pengadaan Cabang", path: `/pengadaan-cabang-asli/cabang/${currentCabang}` },
  ];

  // Conditionally add the correct "Input Pengadaan" item
  if (isUserFromCabangAsli) {
    menuItems.push({
      icon: box,
      label: "Pengadaan Cabang Asli",
      path: `/pengadaan-cabang-asli/input/${currentCabang}`,
    });
    menuItems.push({
      icon: commerce,
      label: "Cabang Asli",
      path: `/cabang-asli/${currentCabang}`,
    });
  
  } else {
    menuItems.push({
      icon: box,
      label: "Pengadaan Cabang Kerjasama",
      path: `/pengadaan-cabang-kerja-sama/input/${currentCabang}`, // Path from your original code
    });
     menuItems.push({
      icon: commerce,
      label: "Cabang Kerja Sama",
      path: `/cabang-kerja-sama/${currentCabang}`,
    });
  }

  // Add remaining common items for Cabang sidebar
  menuItems.push(
    { icon: commerce, label: "Return Barang", path: "/return" }, // Might need cabang context?
    { icon: box, label: "Pengurangan Stok", path: `/pengurangan-stok/${currentCabang}` },
    { icon: box, label: "Inisiasi Pengecekan", path: "/inisiasi-pengecekan" },
  );

  return menuItems;
};


  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // Update state
    setRoleUser(null);
    setUserCabang(null);
    setMenuItems([]); // Clear menu on logout
    alert("Telah Logout, Terima kasih");
    navigate("/login"); // Use navigate
  };


  // Check if a menu item's path is the start of the current location path
  const isActive = (path: string) => {
     if (!path) return false; // Handle potential undefined paths
     if (path === '/') {
         return location.pathname === path;
     }
     // Ensure a trailing slash doesn't break matching
     return location.pathname === path || location.pathname.startsWith(path + '/');
   };

  // --- Conditional Rendering ---

  // 1. If not logged in, render nothing
  if (!isLoggedIn) {
    return null;
  }

  // 2. If logged in but profile is loading, show loading indicator
  if (isLoadingProfile) {
    return (
      <div className="w-1/5 min-h-screen mt-2 p-4 border-r-2 border-gray-200 bg-white z-10 shadow-lg flex flex-col text-[#04548B] items-center justify-center">
        <p>Loading User Data...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  // 3. If logged in and profile loaded, render the sidebar with correct menu
  return (
    <div className="w-1/5 min-h-screen mt-2 p-4 border-r-2 border-gray-200 bg-white z-10 shadow-lg flex flex-col text-[#04548B]">
      {/* Map over the menuItems state */}
      <ul className="flex-grow space-y-2">
        {menuItems.map((item, index) => (
          <li key={`${item.path}-${index}`}> 
            <Link
              to={item.path}
              className={`flex items-center p-2 rounded-md transition-colors duration-150 ease-in-out ${
                isActive(item.path)
                  ? "font-semibold bg-[#E6F4FF] text-[#04548B]" // Active styles
                  : "hover:bg-gray-100" // Hover styles
              }`}
            >
              <div className="flex-shrink-0 w-10 flex justify-center">
                <img
                  src={item.icon || "/placeholder.svg"}
                  alt={item.label}
                  className="h-5 w-5"
                />
              </div>
              <span className="ml-2">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <ul>
          <li className="cursor-pointer" onClick={handleLogout}>
            <div className="flex items-center p-2 rounded-md hover:bg-red-100 text-red-600 transition-colors duration-150 ease-in-out">
              <div className="flex-shrink-0 w-10 flex justify-center">
                <img src={logoutIcon || "/placeholder.svg"} alt="Logout" className="h-5 w-5" />
              </div>
              <span className="ml-2">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;