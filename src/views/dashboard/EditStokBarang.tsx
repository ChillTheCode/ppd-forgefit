import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStokBarangForEdit, updateStokBarang } from '../../services/apiServiceEditBarang';
import { getToken, isTokenValid, getRoleFromToken } from "../authentication/authUtils";
import authenticationService from "../../services/authentication";
import { PenggunaResponse } from "../../interface/Pengguna";

// Interface for the StokBarangItem response from API
interface ApiStokBarangItem {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: string;
    stokBarang: number;
    nomorCabang: string;
}

// Local interface for our component state
interface EditStokBarangItem {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: string;
    stokBarang: number;
    nomorCabang: string;
}

function EditStok() {
    const { kodeBarang, nomorCabang } = useParams<{ kodeBarang: string, nomorCabang: string }>();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<EditStokBarangItem>({
        kodeBarang: 0,
        namaBarang: '',
        kategoriBarang: '',
        hargaBarang: 0,
        bentuk: '',
        stokBarang: 0,
        nomorCabang: '',
    });
    
    const [originalData, setOriginalData] = useState<EditStokBarangItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userCabang, setUserCabang] = useState<string | null>(null);
    
    // Helper function to get the appropriate dashboard route based on user role
    const getDashboardRoute = () => {
        if (userRole === 'Kepala Operasional Cabang' || userRole === 'Direktur Utama' || userRole === 'Admin' || userRole === 'Staf Inventarisasi'  && userCabang) {
            return `/dashboard-cabang/${userCabang}`;
        } else {
            return '/dashboard-cabang';
        }
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    console.log("No access token found");
                    navigate('/login');
                    return;
                }

                const result = await authenticationService.getProfileService(accessToken);
                
                if (result === null) {
                    setError("Gagal memuat data pengguna");
                    navigate('/login');
                    return;
                }
                
                if (typeof result === "string") {
                    console.error("Error:", result);
                    setError("Gagal memuat data pengguna");
                    navigate('/login');
                    return;
                } 
                
                const userData: PenggunaResponse = result;
                setUserRole(userData.role);
                
                // Get user's branch if available (assuming it's in the userData)
                // You might need to adjust this based on your PenggunaResponse interface
                if (userData.nomorCabang) {
                    setUserCabang(userData.nomorCabang);
                }
                
                // Check authorization
                if (userData.role !== 'Direktur Utama' && userData.role !== 'Admin' && userData.role !== 'Kepala Operasional Cabang' && userData.role !== 'Staf Inventarisasi') {
                    navigate('/');
                    return;
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Terjadi kesalahan saat mengambil data pengguna");
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);
    
    useEffect(() => {
        // Only fetch stock data if user data has been loaded and user is authorized
        if (!userRole) return;
        
        const fetchStokBarang = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!kodeBarang || !nomorCabang) {
                    throw new Error('ID barang atau nomor cabang tidak valid');
                }
                
                const kodeBrg = parseInt(kodeBarang, 10);
                const response = await getStokBarangForEdit(kodeBrg, nomorCabang);
                
                if (!response) {
                    throw new Error('Data barang tidak ditemukan');
                }
                
                // Convert the API response to our local interface format
                const itemData = {
                    kodeBarang: response.kodeBarang,
                    namaBarang: response.namaBarang,
                    kategoriBarang: response.kategoriBarang,
                    hargaBarang: response.hargaBarang,
                    bentuk: response.bentuk,
                    stokBarang: response.stokBarang,
                    nomorCabang: response.nomorCabang.toString()
                };
                
                setFormData(itemData);
                setOriginalData(itemData);
            } catch (err) {
                console.error("Error fetching stok barang:", err);
                setError("Gagal mengambil data barang. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchStokBarang();
    }, [kodeBarang, nomorCabang, navigate, userRole]);
    
    const handleStokChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
        setFormData(prev => ({
            ...prev,
            stokBarang: value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        
        try {
            if (!originalData) {
                throw new Error('Data original tidak tersedia');
            }
            
            // Only update the stock, keep all other fields as they were in originalData
            const apiData: ApiStokBarangItem = {
                ...originalData,
                stokBarang: formData.stokBarang
            };
            
            await updateStokBarang(apiData);
            setSuccess('Stok barang berhasil diperbarui');
            
            // Redirect back to appropriate dashboard after a short delay
            setTimeout(() => {
                navigate(getDashboardRoute());
            }, 2000);
        } catch (err) {
            console.error("Error updating stok barang:", err);
            setError("Gagal memperbarui stok barang. Silakan coba lagi nanti.");
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleBackButton = () => {
        navigate(getDashboardRoute());
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Memuat data...</span>
                    </div>
                    <p className="mt-2">Memuat data...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Stok Barang Cabang</h1>
                    <p className="text-sm text-gray-600 mt-1">Hanya stok barang yang dapat diubah, data lainnya hanya untuk informasi</p>
                </div>
                
                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{success}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kodeBarang">
                                    Kode Barang
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    id="kodeBarang"
                                    type="number"
                                    value={formData.kodeBarang}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Kode barang tidak dapat diubah</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nomorCabang">
                                    Nomor Cabang
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    id="nomorCabang"
                                    type="text"
                                    value={formData.nomorCabang}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Nomor cabang tidak dapat diubah</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="namaBarang">
                                    Nama Barang
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    id="namaBarang"
                                    type="text"
                                    value={formData.namaBarang}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Nama barang tidak dapat diubah</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kategoriBarang">
                                    Kategori Barang
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    id="kategoriBarang"
                                    type="text"
                                    value={formData.kategoriBarang}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Kategori barang tidak dapat diubah</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bentuk">
                                    Bentuk Barang
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    id="bentuk"
                                    type="text"
                                    value={formData.bentuk}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Bentuk barang tidak dapat diubah</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hargaBarang">
                                    Harga Barang (Rp)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    id="hargaBarang"
                                    type="number"
                                    value={formData.hargaBarang}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Harga barang tidak dapat diubah</p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stokBarang">
                                    Stok Barang
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                                    id="stokBarang"
                                    type="number"
                                    name="stokBarang"
                                    value={formData.stokBarang}
                                    onChange={handleStokChange}
                                    required
                                    min="0"
                                />
                                <p className="text-xs text-blue-500 mt-1 font-medium">Stok barang dapat diubah</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleBackButton}
                            >
                                Kembali
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan Perubahan Stok'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditStok;