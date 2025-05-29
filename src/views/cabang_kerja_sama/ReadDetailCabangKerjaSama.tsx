import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CabangKerjaSamaResponse } from "../../interface/CabangKerjaSama.ts"
import { getInformasiCKS, deleteCabangKerjaSamaService } from "../../services/cabang-kerja-sama.ts"
import ErrorModal from "../../components/Error.tsx";

const ReadDetailCabangKerjaSama = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [cks, setCKS] = useState<CabangKerjaSamaResponse | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [errorModal, setErrorModal] = useState<{
        status: number;
        errorMessage: string;
        timestamp: string;
    } | null>(null);

    useEffect(() => {
        const fetchCKSDetail = async () => {
            try {
                console.log("Mencoba mengambil data CKS untuk Nomor Cabang: ", id)
                if (!id) {
                    setError("Nomor Cabang Kerja Sama tidak ditemukan")
                    setLoading(false)
                    return
                }
                setLoading(true)
                
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    console.error("Access token not found");
                    navigate("/unauthorized");
                    return;
                }

                const response = await getInformasiCKS(accessToken, id)
                if (response.status !== 200) {
                    setErrorModal({
                        status: response.status,
                        errorMessage: response.message,
                        timestamp: new Date().toString(),
                    });
                    navigate("/");
                    return;
                }

                if (response.data) {
                    setCKS(response.data as CabangKerjaSamaResponse);
                } else {
                    setError("Data Cabang Kerja Sama tidak ditemukan");
                    setErrorModal({
                      status: response.status,
                      errorMessage: response.message,
                      timestamp: new Date().toString(),
                    });
                    navigate("/");
                    return;
                }
            } catch (err) {
                console.error("Error fetching cabang kerja sama data: ", err)
                setError("Gagal memuat data cabang kerja sama")
                setErrorModal({
                    status: 500,
                    errorMessage: "Failed to fetch cabang kerja sama",
                    timestamp: new Date().toString(),
                });
            } finally {
                setLoading(false)
            }
        }

        fetchCKSDetail()
    }, [id])

    // Format time from "HH:MM:SS" to "HH:MM"
    const formatTime = (timeString: string) => {
        if (!timeString) return ""
        return timeString.substring(0, 5)
    }

    // Format date to DD/MM/YY HH:MM
    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = String(date.getFullYear()).slice(-2)

        return `${day}/${month}/${year}`
    }

        // Format date to DD/MM/YY HH:MM
    const formatDateTime = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = String(date.getFullYear()).slice(-2)
        const hours = date.getHours().toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")

        return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    const handleDelete = async () => {
        if (!cks) return
        try {
            console.log("Mencoba mengambil data CKS untuk Nomor Cabang: ", id)
            if (!id) {
                setError("Nomor Cabang Kerja Sama tidak ditemukan")
                setLoading(false)
                return
            }

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                console.error("Access token not found");
                navigate("/unauthorized");
                return;
            }

            const response = await deleteCabangKerjaSamaService(accessToken, id)
            if (response.status !== 200) {
                setErrorModal({
                    status: response.status,
                    errorMessage: response.message,
                    timestamp: new Date().toString(),
                });
                navigate("/");
                return;
            }

            navigate("/cabang-kerja-sama")
        } catch (err) {
            console.error("Error deleting cabang kerja sama:", err)
            alert("Gagal menghapus cabang kerja sama")
            setErrorModal({
                status: 500,
                errorMessage: "Failed to delete cabang kerja sama",
                timestamp: new Date().toString(),
            });
        } finally {
            setShowDeleteModal(false)
        }
    }

    const DeleteConfirmationModal = () => {
        if (!showDeleteModal) return null

        return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
                {errorModal && (
                    <ErrorModal
                    status={errorModal.status}
                    errorMessage={errorModal.errorMessage}
                    timestamp={errorModal.timestamp}
                    onClose={() => setErrorModal(null)}
                    />
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                Apakah Anda ingin menghapus informasi cabang kerja sama ini?
                </h3>
            </div>
            <div className="flex justify-end gap-2">
                <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                >
                Batalkan
                </button>
                <button
                onClick={handleDelete}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                Hapus
                </button>
            </div>
            </div>
        </div>
        )
    }
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            )
        }
        
    if (error || !cks) {
        return (
        <div className="p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error || "Data cabang kerja sama tidak ditemukan"}
            </div>
            <button className="mt-4 text-blue-600 hover:underline" onClick={() => navigate("/cabang-kerja-sama")}>
                Kembali ke daftar cabang kerja sama
            </button>
        </div>
        )
    }

    return (
        <div className="p-6 bg-white">
        <DeleteConfirmationModal />

        <div className="flex justify-between items-center mb-6">
            {errorModal && (
                <ErrorModal
                status={errorModal.status}
                errorMessage={errorModal.errorMessage}
                timestamp={errorModal.timestamp}
                onClose={() => setErrorModal(null)}
                />
            )}
            <h1 className="text-xl font-medium text-gray-800">{cks.namaMitra}</h1>
            
            <div className="flex gap-2">
                <button
                className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600"
                onClick={() => setShowDeleteModal(true)}
                >
                Hapus
                </button>
            </div>
            
        </div>

        <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Details</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Nomor Cabang</div>
                    <div className="text-sm">{cks.nomorCabang}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Nama Mitra</div>
                    <div className="text-sm">{cks.namaMitra}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Alamat</div>
                    <div className="text-sm">{cks.alamat}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Kontak</div>
                    <div className="text-sm">{cks.kontak}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Jumlah Karyawan</div>
                    <div className="text-sm">{cks.jumlahKaryawan}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Jam Operasional</div>
                    <div className="text-sm">{formatTime(cks.jamOperasional)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Masa Berlaku Kontrak</div>
                    <div className="text-sm">{formatDate(cks.masaBerlakuKontrak)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">ID Kepala Operasional</div>
                    <div className="text-sm">{cks.idKaryawanKepalaOperasional}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Username Kepala Operasional</div>
                    <div className="text-sm">{cks.usernameKepalaOperasionalCabang}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Created At</div>
                    <div className="text-sm">{cks.createdAt}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-500">Updated At</div>
                    <div className="text-sm">{cks.updatedAt}</div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
            <button
                onClick={() => navigate(`/cabang-kerja-sama/${id}/update`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"   
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>Edit
            </button>
            <button
                className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
                onClick={() => navigate("/cabang-kerja-sama")}
            >
                Kembali ke daftar cabang kerja sama
            </button>
        </div>
        
        </div>
    );
}

export default ReadDetailCabangKerjaSama;