import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authenticationService from '../../services/authentication';
import { createCabangKerjaSamaService } from "../../services/cabang-kerja-sama.ts"
import { PenggunaResponse } from "../../interface/Pengguna.ts"
import ErrorModal from "../../components/Error.tsx";

const CreateCabangKerjaSama = () => {
    const navigate = useNavigate();
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [listPengguna, setListPengguna] = useState<PenggunaResponse[] | null>(null);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nomorCabang: "",
        namaMitra: "",
        alamat: "",
        kontak: "",
        jumlahKaryawan: 0,
        jamOperasional: "08:00",
        masaBerlakuKontrak: "",
        idKaryawanKepalaOperasional: "",
    })
    const [errorModal, setErrorModal] = useState<{
        status: number;
        errorMessage: string;
        timestamp: string;
    } | null>(null);
    

    useEffect(() => {
        const fetchPenggunaList = async () => {
            try {
                const response = await authenticationService.getAllPengguna(localStorage.getItem("accessToken") as string);
                if (response.status !== 200) {
                setErrorModal({
                    status: response.status,
                    errorMessage: response.message,
                    timestamp: new Date().toString(),
                });
                navigate("/");
                return;
                }
        
                if(response.data === null) {
                setErrorModal({
                    status: response.status,
                    errorMessage: response.message,
                    timestamp: new Date().toString(),
                });
                navigate("/");
                return;
                }
        
                if (Array.isArray(response.data)) {
                setListPengguna(response.data);
                } else {
                setErrorModal({
                    status: response.status,
                    errorMessage: "Invalid data format received",
                    timestamp: new Date().toString(),
                });
                }
            } catch (error) {
                console.error("Fetch pengguna list error:", error);
                setErrorModal({
                status: 500,
                errorMessage: "Failed to fetch user list",
                timestamp: new Date().toString(),
                });
            }
        };
    
        fetchPenggunaList();
    }, []);   

    const handleUserSelect = (username: string) => {
        setSelectedUserId(username);
        
        if (listPengguna && username) {
            const selectedUser = listPengguna.find(user => user.username === username);
            if (selectedUser) {
                setFormData((prev) => ({
                    ...prev,
                    idKaryawanKepalaOperasional: selectedUser.idKaryawan,
                }));
            }
        }
    };    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "jumlahKaryawan" ? (isNaN(Number(value)) ? 0 : Number(value)) : value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedUserId) {
            setErrorModal({
              status: 400,
              errorMessage: "Please select a user to be kepala operasional",
              timestamp: new Date().toString(),
            });
            return;
        }
        
        if (!formData.idKaryawanKepalaOperasional) {
            setErrorModal({
                status: 400,
                errorMessage: "Harap pilih kepala operasional",
                timestamp: new Date().toString(),
            });
            return;
        }

        try {
            setLoading(true)

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                console.error("Access token not found");
                navigate("/unauthorized");
                return;
            }

            const formattedData = {
                ...formData,
                jamOperasional: formData.jamOperasional + ":00",
                masaBerlakuKontrak: formData.masaBerlakuKontrak,
                idKaryawanKepalaOperasional: formData.idKaryawanKepalaOperasional,
            }

            const response = await createCabangKerjaSamaService(accessToken, formattedData)

            if (response.status !== 201) {
                setErrorModal({
                  status: response.status,
                  errorMessage: response.message,
                  timestamp: new Date().toLocaleString(),
                });
                return;
            }

            alert("Create Cabang Kerja Sama success")
            navigate("/cabang-kerja-sama")
        } catch (error) {
            console.error("Error creating cabang kerja sama: ", error)
            alert("Gagal menambah cabang kerja sama")
            setErrorModal({
                status: 500,
                errorMessage: "Internal Server Error",
                timestamp: new Date().toLocaleString(),
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]">
            {errorModal && (
                <ErrorModal
                status={errorModal.status}
                errorMessage={errorModal.errorMessage}
                timestamp={errorModal.timestamp}
                onClose={() => setErrorModal(null)}
                />
            )}
                <h2 className="text-xl font-medium text-gray-800 mb-6">Tambah Cabang Kerja Sama</h2>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Cabang</label>
                            <input
                                type="text"
                                name="nomorCabang"
                                value={formData.nomorCabang}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Masukkan nomor cabang"
                                required
                            /> 
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mitra</label>
                            <input
                                type="text"
                                name="namaMitra"
                                value={formData.namaMitra}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Masukkan nama mitra"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <input
                                type="text"
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Masukkan alamat cabang kerja sama"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
                            <input
                                type="text"
                                name="kontak"
                                value={formData.kontak}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Masukkan kontak cabang kerja sama"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Karyawan</label>
                            <input
                                type="number"
                                name="jumlahKaryawan"
                                value={formData.jumlahKaryawan}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Masukkan jumlah karyawan"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
                            <input
                                type="time"
                                name="jamOperasional"
                                value={formData.jamOperasional}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku Kontrak</label>
                            <input
                                type="date"
                                name="masaBerlakuKontrak"
                                value={formData.masaBerlakuKontrak}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="userSelect"
                                className="block text-sm font-medium text-gray-700"
                                >
                                Pilih Kepala Operasional Cabang
                            </label>
                            <select
                                id="userSelect"
                                name="userSelect"
                                value={selectedUserId}
                                onChange={(e) => handleUserSelect(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                >
                                <option value="">Select a user</option>
                                {listPengguna && listPengguna.map((user) => (
                                    <option key={user.idKaryawan} value={user.username}>
                                    {user.username} - {user.role}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/cabang-kerja-sama")}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                            disabled={loading}
                            >
                            Batalkan
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                            disabled={loading}
                            >
                            {loading ? "Menyimpan..." : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateCabangKerjaSama;