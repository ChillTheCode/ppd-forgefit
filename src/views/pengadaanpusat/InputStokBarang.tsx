import { useState, useEffect } from "react";
import authenticationService from "../../services/authentication";
import { useNavigate } from "react-router-dom";
import pengadaanpusat from "../../services/pengadaanpusat";
import { stokBarang } from "../../interface/PengadaanPusat";

const InputStokBarang: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<stokBarang | null>(null);
  const [stok, setStok] = useState<string>("-");
  const [inputStok, setInputStok] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [rows, setRows] = useState<{ kodeBarang: string; namaBarang: string; stokBarang: number; inputStok: number }[]>([]);
  const [barang, setBarang] = useState<stokBarang[]>([]);
  const navigate = useNavigate();

useEffect(() => {
    const fetchRole = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          navigate("/unauthorized");
          return;
        }

        const response = await authenticationService.getRoleService(
          accessToken
        );
        if (response === "Failed") {
          console.error("Error fetching data");
          return;
        }

        const data = response as string;
        setRoleUser(data);

      
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRole();

    const fetchBarang = async () => {
      try {
        const response = await pengadaanpusat.getBarang();
        if (response.status !== 200) {
          console.error("Error fetching data");
          return;
        }

        const data = response.data as stokBarang[];
        
        setBarang(data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    fetchBarang();
  }, []);

  useEffect(() => {
    if (roleUser && roleUser !== "Staf Gudang Pelaksana Umum") {
      navigate("/");
    }
  }, [roleUser, navigate]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    const item = barang.find(
      (item) => item.kodeBarang.toString() === selectedValue
    );
  
    setSelectedItem(item || null);
    console.log("Selected item:", item);
    setStok(item ? item.stokBarang.toString() : "-");
  };

  const handleAddRow = () => {
    if (!selectedItem || !inputStok.trim()) return;

    setRows([...rows, { ...selectedItem, inputStok: parseInt(inputStok) }]);
    setInputStok("");
  };

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        alert("Access token not found. Please log in.");
        return;
      }
  
      const stockData = {
        listInputBarang: rows.map(({ kodeBarang, inputStok }) => ({
          kodeBarang,
          stokInput: inputStok
        }))
      };
  
      const response = await pengadaanpusat.AddStockService(accessToken, stockData);
  
      // Ensure response structure is handled correctly
      if (response && response.status >= 200 && response.status < 300) {
        alert("Pengajuan berhasil dikirim");
        navigate("/pengadaan-pusat");
        setRows([]); // Clear rows after successful submission
      } else {
        console.error("Failed to update stock", response);
        alert(`Failed to update stock: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting stock data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`An error occurred: ${errorMessage}`);
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className=" p-6 rounded-lg shadow-md">
      {barang.length === 0 ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md   space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Form Input Stok Barang</h2>

          <p className="text-sm text-gray-500">
            Silakan pilih barang dan masukkan jumlah stok yang ingin ditambahkan.
          </p>

          <div className="text-sm text-gray-600 font-medium">
            Role User: <span className="text-blue-600">{roleUser}</span>
          </div>

          {/* Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Pilih Barang</label>
            <select
              title="select"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSelectChange}
            >
              <option value="">Pilih Barang</option>
              {barang.map((item) => (
                <option key={item.kodeBarang} value={item.kodeBarang}>
                  {item.kodeBarang} - {item.namaBarang}
                </option>
              ))}
            </select>
          </div>

          {/* Stok Display */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Stok Barang Saat Ini</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-800">{stok}</p>
          </div>

          {/* Input Tambah Stok */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Jumlah Stok yang Ditambahkan</label>
            <input
              type="number"
              value={inputStok}
              onChange={(e) => setInputStok(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Contoh: 10"
            />
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              onClick={handleAddRow}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Tambah ke Tabel
            </button>
          </div>
        </div>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 border">Barang</th>
                <th className="p-3 border">Stok</th>
                <th className="p-3 border">Tambah Stok</th>
                <th className="p-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border">
                  <td className="p-3 border">{row.namaBarang}</td>
                  <td className="p-3 border text-center">{row.stokBarang}</td>
                  <td className="p-3 border text-center">{row.inputStok}</td>
                  <td className="p-3 border text-center">
                    <button onClick={() => handleDeleteRow(index)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="mt-4 text-center">
            <button onClick={handleSubmit} className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Input Barang
            </button>
          </div>
        </>
      )}
    </div>
  </div>
  );
};

export default InputStokBarang;
