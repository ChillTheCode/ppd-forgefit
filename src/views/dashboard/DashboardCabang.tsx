import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllStokBarang, getStokBarangByNomorCabang } from '../../services/apiServiceCabang';
import { getToken, parseJwt, isTokenValid, getRoleFromToken, getCabangNumberFromToken } from "../authentication/authUtils";

interface StokBarangItem {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: string;
    stokBarang: number;
    nomorCabang: string; // Always use string for nomorCabang
}

interface User {
    id: string;
    username: string;
    role: string;
    nomorCabang: string; // Always use string for nomorCabang
}

function DashboardCabang() {
    const [stokBarang, setStokBarang] = useState<StokBarangItem[]>([]);
    const [filteredStokBarang, setFilteredStokBarang] = useState<StokBarangItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [noDataAvailable, setNoDataAvailable] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [selectedCabang, setSelectedCabang] = useState<string>("all");
    const [availableCabangList, setAvailableCabangList] = useState<string[]>([]);
    
    // Normalize branch number to string to ensure consistent comparison
    const normalizeCabangNumber = (value: any): string => {
        if (value === undefined || value === null) return "";
        return String(value);
    };
    
    const getCurrentUser = (): User | null => {
        const token = getToken();
        if (!token || !isTokenValid()) {
            // Redirect to login if token is missing or invalid
            window.location.href = '/login';
            return null;
        }
        
        const decodedToken = parseJwt(token);
        if (!decodedToken) return null;
        
        const role = getRoleFromToken();
        
        // Get cabang number from token and convert to string
        const nomorCabang = String(getCabangNumberFromToken());
        
        return {
            id: decodedToken.id || decodedToken.sub || '',
            username: decodedToken.sub || '',
            role: role,
            nomorCabang: nomorCabang
        };
    };
    
    useEffect(() => {
        // Mendapatkan data pengguna yang sedang login
        const currentUser = getCurrentUser();
        if (!currentUser) return; // Handle if no user is found
        
        setUser(currentUser);
        
        const fetchStokBarang = async () => {
            try {
                setLoading(true);
                setError(null);
                setNoDataAvailable(false);
                let data;
                
                // Hanya Direktur Utama & Admin yang bisa melihat semua stok barang
                if (currentUser.role === 'Direktur Utama' || currentUser.role === 'Admin') {
                    data = await getAllStokBarang();
                    // Extract unique branch numbers for the filter dropdown as strings
                    const uniqueCabangList = [...new Set(data.map((item: StokBarangItem) => 
                        normalizeCabangNumber(item.nomorCabang)
                    ))];
                    // Sort numerically but keep as strings
                    setAvailableCabangList(
                        uniqueCabangList.sort((a, b) => Number(a) - Number(b))
                    );
                } else {
                    // Role lain hanya bisa melihat stok cabang mereka
                    const nomorCabangValue = currentUser.nomorCabang;
                    // Convert to number when passing to API function
                    data = await getStokBarangByNomorCabang(Number(nomorCabangValue));
                    setAvailableCabangList([nomorCabangValue]);
                    setSelectedCabang(nomorCabangValue); // Auto-select the user's branch
                }
                
                // Check if data is empty or null
                if (!data || data.length === 0) {
                    setNoDataAvailable(true);
                    setStokBarang([]);
                    setFilteredStokBarang([]);
                    return;
                }
                
                // Ensure all data has normalized nomorCabang
                const normalizedData = data.map((item: StokBarangItem) => ({
                    ...item,
                    nomorCabang: normalizeCabangNumber(item.nomorCabang)
                }));
                
                setStokBarang(normalizedData);
                setFilteredStokBarang(normalizedData);
            } catch (err: any) {
                console.error("Error fetching stok barang:", err);
                
                // Handle different types of errors
                if (err.message && err.message.includes('404')) {
                    // 404 typically means no data found, not a server error
                    setNoDataAvailable(true);
                    setStokBarang([]);
                    setFilteredStokBarang([]);
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
    
    // Filter data berdasarkan cabang yang dipilih
    useEffect(() => {
        if (selectedCabang === "all") {
            setFilteredStokBarang(stokBarang);
        } else {
            const filtered = stokBarang.filter(item => 
                normalizeCabangNumber(item.nomorCabang) === selectedCabang
            );
            setFilteredStokBarang(filtered);
        }
    }, [selectedCabang, stokBarang]);
    
    // Handler untuk perubahan filter cabang
    const handleCabangFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCabang(value);
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
                        {user?.role === 'Direktur Utama' || user?.role === 'Admin'
                            ? 'Dashboard Semua Cabang'
                            : `Dashboard Pusat - Cabang ${user?.nomorCabang}`}
                    </h1>
                </div>
                
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">
                            {user?.role === 'Direktur Utama' || user?.role === 'Admin'
                                ? 'Menampilkan data dari semua cabang'
                                : 'Menampilkan data dari cabang Anda'}
                        </p>
                    </div>
                
                    {/* Filter untuk Admin dan Direktur Utama */}
                    {(user?.role === 'Direktur Utama' || user?.role === 'Admin') && !noDataAvailable && (
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
                                    <option value="all">Semua Cabang</option>
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
                                {user?.role === 'Direktur Utama' || user?.role === 'Admin'
                                    ? 'Belum ada data stok barang yang tersedia di sistem.'
                                    : `Belum ada data stok barang untuk cabang ${user?.nomorCabang}.`}
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
                                        {filteredStokBarang.reduce((total, item) => total + Number(item.stokBarang), 0)}
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
                                            filteredStokBarang.reduce((total, item) => 
                                                total + (Number(item.hargaBarang) * Number(item.stokBarang)), 0)
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
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Total</th>
                                                {(user?.role === 'Direktur Utama' || user?.role === 'Admin') && (
                                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredStokBarang.map((item) => (
                                                <tr key={`${item.kodeBarang}-${item.nomorCabang}`} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.kodeBarang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.namaBarang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.kategoriBarang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.nomorCabang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.stokBarang}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Intl.NumberFormat('id-ID', { 
                                                            style: 'currency', 
                                                            currency: 'IDR',
                                                            maximumFractionDigits: 0 
                                                        }).format(Number(item.hargaBarang))}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Intl.NumberFormat('id-ID', { 
                                                            style: 'currency', 
                                                            currency: 'IDR',
                                                            maximumFractionDigits: 0 
                                                        }).format(Number(item.hargaBarang) * Number(item.stokBarang))}
                                                    </td>
                                                    {(user?.role === 'Direktur Utama' || user?.role === 'Admin') && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link 
                                                                    to={`/edit-stok/${item.kodeBarang}/${item.nomorCabang}`}
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
                                            {selectedCabang === "all" 
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
}

export default DashboardCabang;