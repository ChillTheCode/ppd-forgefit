import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStokCabang } from '../../services/apiServicePusat';
import { getToken, isTokenValid, getRoleFromToken } from "../authentication/authUtils";

interface StokCabangItem {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: string;
    stokBarang: number;
    cabang?: string;
}

const DashboardPusat = () => {
    const [stokBarang, setStokBarang] = useState<StokCabangItem[]>([]);
    const [filteredStokBarang, setFilteredStokBarang] = useState<StokCabangItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [noDataAvailable, setNoDataAvailable] = useState(false);
    const [selectedCabang, setSelectedCabang] = useState<string>("");
    const [availableCabangList, setAvailableCabangList] = useState<string[]>([]);
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
        // Check if user is authenticated and authorized
        const token = getToken();
        if (!token || !isTokenValid()) {
            // Redirect to login if needed
            // navigate('/login');
            return;
        }
        
        const role = getRoleFromToken();
        setUserRole(role || "");
        
        const fetchStokBarang = async () => {
            try {
                setLoading(true);
                setError(null);
                setNoDataAvailable(false);
                
                const data = await getStokCabang();
                
                // Check if data is empty or null
                if (!data || data.length === 0) {
                    setNoDataAvailable(true);
                    setStokBarang([]);
                    setFilteredStokBarang([]);
                    setAvailableCabangList([]);
                    return;
                }
                
                // Extract unique branch names for the filter dropdown
                // Filter out undefined values and cast to string array
                const uniqueCabangList = [...new Set(data
                    .map(item => item.cabang)
                    .filter((cabang): cabang is string => cabang !== undefined))];
                
                setAvailableCabangList(uniqueCabangList.sort());
                
                // Set default selected cabang to first in list if available
                if (uniqueCabangList.length > 0) {
                    setSelectedCabang(uniqueCabangList[0]);
                    setFilteredStokBarang(data.filter(item => item.cabang === uniqueCabangList[0]));
                } else {
                    setFilteredStokBarang(data);
                }
                
                setStokBarang(data);
            } catch (err: any) {
                console.error("Error fetching stok cabang:", err);
                
                // Handle different types of errors
                if (err.message && err.message.includes('404')) {
                    // 404 typically means no data found, not a server error
                    setNoDataAvailable(true);
                    setStokBarang([]);
                    setFilteredStokBarang([]);
                    setAvailableCabangList([]);
                    setError(null);
                } else if (err.message && err.message.includes('401')) {
                    // Unauthorized - redirect to login
                    setError("Sesi Anda telah berakhir. Silakan login kembali.");
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else if (err.message && err.message.includes('403')) {
                    // Forbidden
                    setError("Anda tidak memiliki akses untuk melihat data ini.");
                } else if (err.message && (err.message.includes('500') || err.message.includes('502') || err.message.includes('503'))) {
                    // Server errors
                    setError("Terjadi kesalahan server. Silakan coba lagi nanti.");
                } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
                    // Network error
                    setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
                } else {
                    // Generic error
                    setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchStokBarang();
    }, []);
    
    // Handler untuk perubahan filter cabang
    const handleCabangFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCabang(e.target.value);
        
        // Update filtered data
        if (e.target.value === "") {
            setFilteredStokBarang(stokBarang);
        } else {
            setFilteredStokBarang(stokBarang.filter(item => item.cabang === e.target.value));
        }
    };
    
    // Check if user has edit permissions
    const hasEditPermissions = () => {
        return userRole === 'Direktur Utama' || userRole === 'Admin' || userRole === 'Staf Inventarisasi';
    };
    
    // Retry function for when there's an error
    const handleRetry = () => {
        window.location.reload();
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
    
    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Terjadi Kesalahan
                            </h3>
                        </div>
                    </div>
                    <div className="text-sm text-red-700 mb-4">
                        {error}
                    </div>
                    <button
                        onClick={handleRetry}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard Pusat 
                    </h1>
                </div>
                
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">
                            Menampilkan data dari Pusat
                        </p>
                    </div>
                    
                    {/* Filter cabang if multiple branches are available */}
                    {availableCabangList.length > 0 && !noDataAvailable && (
                        <div className="mb-6">
                            <div className="flex items-center space-x-4">
                                <label htmlFor="cabangFilter" className="font-medium text-gray-700">
                                    Filter Cabang:
                                </label>
                                <select
                                    id="cabangFilter"
                                    className="form-select rounded-md border-gray-300"
                                    value={selectedCabang}
                                    onChange={handleCabangFilterChange}
                                >
                                    <option value="">Semua Cabang</option>
                                    {availableCabangList.map((cabang) => (
                                        <option key={cabang} value={cabang}>
                                            Cabang {cabang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    
                    {noDataAvailable ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H10a1 1 0 01-.707-.293L6.879 13.293A1 1 0 006.172 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Tidak Ada Barang untuk Ditampilkan
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Belum ada data stok barang yang tersedia di sistem.
                            </p>
                            <button
                                onClick={handleRetry}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Refresh Data
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold text-blue-800 mb-2">
                                        Total Barang
                                    </h2>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {filteredStokBarang.length}
                                    </p>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold text-green-800 mb-2">
                                        Total Stok
                                    </h2>
                                    <p className="text-3xl font-bold text-green-600">
                                        {filteredStokBarang.reduce((total, item) => total + item.stokBarang, 0)}
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold text-purple-800 mb-2">
                                        Total Nilai Barang
                                    </h2>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {new Intl.NumberFormat('id-ID', { 
                                            style: 'currency', 
                                            currency: 'IDR',
                                            maximumFractionDigits: 0 
                                        }).format(
                                            filteredStokBarang.reduce((total, item) => total + (item.hargaBarang * item.stokBarang), 0)
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Data Stok Barang
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                {filteredStokBarang.length > 0 ? (
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Total</th>
                                                {/* Add action column if user has permissions */}
                                                {hasEditPermissions() && (
                                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredStokBarang.map((item) => (
                                                <tr key={`${item.kodeBarang}-${item.cabang || 'pusat'}`} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.kodeBarang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.namaBarang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.kategoriBarang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.stokBarang} {item.bentuk}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Intl.NumberFormat('id-ID', { 
                                                            style: 'currency', 
                                                            currency: 'IDR',
                                                            maximumFractionDigits: 0 
                                                        }).format(item.hargaBarang)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Intl.NumberFormat('id-ID', { 
                                                            style: 'currency', 
                                                            currency: 'IDR',
                                                            maximumFractionDigits: 0 
                                                        }).format(item.hargaBarang * item.stokBarang)}
                                                    </td>
                                                    {/* Action buttons - only shown for users with permissions */}
                                                    {hasEditPermissions() && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link 
                                                                    to={`/edit-stok/${item.kodeBarang}`}
                                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                                        <p className="text-gray-600 text-lg">
                                            {selectedCabang === "" 
                                                ? "Tidak ada data stok barang yang sesuai dengan filter yang dipilih."
                                                : `Tidak ada data stok barang untuk cabang ${selectedCabang}.`
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPusat;