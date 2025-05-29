import React, { useState } from "react";
import LogoLIA from "../../assets/logo_lia.png";
import authenticationService from "../../services/authentication";
import ErrorModal from "../../components/Error";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    status: number;
    errorMessage: string;
    timestamp: string;
  } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setTimeout(async () => {
        const response = await authenticationService.loginService(
          username,
          password
        );

        if (response.status !== 200) {
          setErrorModal({
            status: response.status,
            errorMessage: response.message,
            timestamp: new Date().toString(),
          });
          return;
        }

        const data = response.data as { accessToken: string };
        localStorage.setItem("accessToken", data.accessToken);

        // Get user profile to determine role and branch number
        try {
          const profileResponse = await authenticationService.getProfileService(
            data.accessToken
          );

          if (profileResponse && typeof profileResponse !== "string") {
            const userRole = profileResponse.role;
            const nomorCabang = profileResponse.nomorCabang;

            // Role-based navigation
            if (userRole === "Kepala Operasional Cabang") {
              if (nomorCabang) {
                navigate(`/dashboard-cabang/${nomorCabang}`);
              } else {
                // Fallback if no branch number is available
                navigate("/dashboard-cabang");
              }
            } else {
              // All other roles go to dashboard-pusat
              navigate("/dashboard-pusat");
            }
          } else {
            // If profile fetch fails, fallback to dashboard-pusat
            console.error("Failed to fetch user profile");
            navigate("/dashboard-pusat");
          }
        } catch (profileError) {
          console.error("Profile fetch error:", profileError);
          // Fallback navigation
          navigate("/dashboard-pusat");
        }

        alert("Login successful!");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      setErrorModal({
        status: 500,
        errorMessage: "Internal Server Error",
        timestamp: new Date().toString(),
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {errorModal && (
        <ErrorModal
          status={errorModal.status}
          errorMessage={errorModal.errorMessage}
          timestamp={errorModal.timestamp}
          onClose={() => setErrorModal(null)} // Close the modal when clicking "Close"
        />
      )}
      <div className="flex w-full max-w-4xl rounded-lg bg-white shadow-lg">
        <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center rounded-r-lg">
          <div>
            <div className="mb-10 py-5 text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Log in to your account!
              </h1>
              <p className="mt-3 text-gray-600">
                Welcome back! Please enter your details.
              </p>
            </div>
            <img
              src={LogoLIA}
              alt="Logo LIA"
              className="h-50 w-50 object-contain pb-3"
            />
          </div>
        </div>

        <div className="w-full p-8 lg:w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="/reset-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Ganti Password
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/")}
                type="button"
                className="mt-5 group relative flex w-full justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-black border border-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{ border: "1px solid black" }}
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;