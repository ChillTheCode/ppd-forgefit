// src/components/LogBarangComponent.tsx
import React, { useState, useEffect } from 'react';
import { LogBarangResponseDTO } from '../interface/Barang'; 
import BarangService from '../services/barang';

interface LogBarangComponentProps {
  kodeBarang: number; // Or number, depending on how you use it
}

const fetchLogBarangData = async (
  kodeBarang: number
): Promise<LogBarangResponseDTO[]> => {
  console.log(`Fetching logs for kodeBarang: ${kodeBarang}`);
  
  try {
    
    const logs = await BarangService.getLogBarang(kodeBarang);
    return logs;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error('Failed to fetch logs');
  }

};

const LogBarangComponent: React.FC<LogBarangComponentProps> = ({
  kodeBarang,
}) => {
  const [logs, setLogs] = useState<LogBarangResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      if (!kodeBarang) {
        setLogs([]);
        setIsLoading(false);
        setError("Kode Barang tidak disediakan.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchLogBarangData(kodeBarang);
        setLogs(data.sort((a, b) => new Date(b.waktuLog).getTime() - new Date(a.waktuLog).getTime()));
      } catch (err) {
        console.error('Failed to fetch log barang:', err);
        setError('Gagal memuat data log. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [kodeBarang]); // Re-fetch when kodeBarang changes

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString; // Fallback if parsing fails
    }
  };


    const getKeteranganText = (keterangan: string): string | undefined => {
        interface KeteranganMap {
            [key: string]: string;
        }

        const keteranganMap: KeteranganMap = {
            PNSB: "Pengurangan Stok Barang",
            PCA: "Pengadaan Cabang Asli",
            PCKS: "Pengadaan Cabang Kerja Sama",
            PP: "Pengadaan Pusat",
        };

        return keteranganMap[keterangan];
    };

  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Log Barang: 
        </h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Memuat data log...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Log Barang: <span className="text-blue-600">{kodeBarang || 'N/A'}</span>
        </h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 bg-gray-50 min-h-screen">
      <div className=" mx-auto bg-white rounded-lg">
      <div>
        <h2 className="mb-3 text-sm text-gray-500">
          Log Barang: 
        </h2>
      </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-xl">Tidak ada data log ditemukan untuk barang ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div key={log.idLogBarang} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
                  {/* Column 1: Core Info */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-gray-500">ID Log: {log.idLogBarang}</p>
                    <p className="text-sm font-medium text-blue-700">
                      {formatDateTime(log.waktuLog)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cabang: <span className="font-semibold">{log.nomorCabang}</span>
                    </p>
                  </div>

                  {/* Column 2: Stock Change */}
                  <div className="md:col-span-1">
                     <p className="text-sm text-gray-600">
                      Stok Sebelum: <span className="font-semibold">{log.stokSebelum}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Stok Sesudah: <span className="font-semibold">{log.stokSesudah}</span>
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        log.stokSesudah > log.stokSebelum
                          ? 'text-green-600'
                          : log.stokSesudah < log.stokSebelum
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      Perubahan: {log.stokSesudah > log.stokSebelum ? '+' : ''}
                      {log.stokSesudah - log.stokSebelum}
                    </p>
                  </div>

                  {/* Column 3: Details */}
                  <div className="md:col-span-1">
                     <p className="text-sm text-gray-600">
                      ID Pengajuan: <span className="font-semibold">{log.idPengajuan || 'N/A'}</span>
                    </p>
                  </div>
                </div>
                {/* Keterangan full width below grid */}
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200 md:border-t-0 md:pt-0">
                  <p className="text-sm text-gray-800 bg-gray-100 rounded">
                    <span className="font-semibold">Keterangan:</span> {getKeteranganText(log.keterangan)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <footer className="bg-gray-100 p-3 rounded-b-lg text-center text-xs text-gray-500">
          Menampilkan {logs.length} log entri.
        </footer>
      </div>
    </div>
  );
};

export default LogBarangComponent;