
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStokCabangForEdit, updateStokCabang, StokCabangItem } from '../../services/apiServiceEditBarangPusat';
import { getToken, isTokenValid, getRoleFromToken } from "../authentication/authUtils";

function EditStokPusat() {
    const { kodeBarang } = useParams<{ kodeBarang: string }>();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<StokCabangItem>({
        kodeBarang: 0,
        namaBarang: '',
        kategoriBarang: '',
        hargaBarang: 0,
        bentuk: '',
        stokBarang: 0,
    });
    
    const [originalData, setOriginalData] = useState<StokCabangItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    useEffect(() => {
        // Check if user is authenticated and authorized
        const token = getToken();
        if (!token || !isTokenValid()) {
            navigate('/login');
            return;
        }
        
        const role = getRoleFromToken();
        if (role !== 'Direktur Utama' && role !== 'Admin' && role !== 'Staf Inventarisasi') {
            navigate('/dashboard');
            return;
        }
        
        // Fetch the stock item data
        const fetchStokCabang = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!kodeBarang) {
                    throw new Error('ID barang tidak valid');
                }
                
                const kodeBrg = parseInt(kodeBarang, 10);
                const response = await getStokCabangForEdit(kodeBrg);
                
                if (!response) {
                    throw new Error('Data barang tidak ditemukan');
                }
                
                const itemData = {
                    kodeBarang: response.kodeBarang,
                    namaBarang: response.namaBarang,
                    kategoriBarang: response.kategoriBarang,
                    hargaBarang: response.hargaBarang,
                    bentuk: response.bentuk,
                    stokBarang: response.stokBarang,
                };
                
                setFormData(itemData);
                setOriginalData(itemData);
            } catch (err) {
                console.error("Error fetching stok cabang:", err);
                setError("Gagal mengambil data barang. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchStokCabang();
    }, [kodeBarang, navigate]);
    
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
            
            // Only update the stock, keep all other fields as they were
            const dataToUpdate: StokCabangItem = {
                ...originalData,
                stokBarang: formData.stokBarang
            };
            
            await updateStokCabang(dataToUpdate);
            setSuccess('Stok barang pusat berhasil diperbarui');
            
            // Redirect back to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard-pusat');
            }, 2000);
        } catch (err) {
            console.error("Error updating stok cabang:", err);
            setError("Gagal memperbarui stok barang pusat. Silakan coba lagi nanti.");
        } finally {
            setSubmitting(false);
        }
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
                    <h1 className="text-2xl font-bold text-gray-800">Edit Stok Barang Pusat</h1>
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
                                onClick={() => navigate('/dashboard-pusat')}
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

export default EditStokPusat;