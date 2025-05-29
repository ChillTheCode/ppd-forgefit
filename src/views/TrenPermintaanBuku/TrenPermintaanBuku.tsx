import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { getLineGraphPermintaan, getPersentasePerubahan, getRataRataPemesanan } from '../../services/tren-permintaan-buku';
import { GrafikPermintaanBukuResponse, PersentasePerubahanPermintaanResponse, RataRataPemesananBukuResponse } from '../../interface/TrenPermintaanBuku';
import ErrorModal from "../../components/Error.tsx";
import PermintaanBukuChart from '../../components/TrenPermintaanBukuChart';
import { getAllCabang } from '../../services/cabang.ts';
import { CabangResponse } from '../../interface/Cabang.ts';

const TrenPermintaanBuku: React.FC = () => {
  const navigate = useNavigate()

  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);    // Jan 1 current year
  const endOfYear = new Date(currentDate.getFullYear(), 11, 31);    // Dec 31 current year

  const [startDate, setStartDate] = useState<string>(startOfYear.toISOString().split('T')[0]); // Default value
  const [endDate, setEndDate] = useState<string>(endOfYear.toISOString().split('T')[0]); // Default value

  const [dataGraph, setDataGraph] = useState<GrafikPermintaanBukuResponse[]>([]);
  const [dataTable, setDataTable] = useState<RataRataPemesananBukuResponse[]>([]);
  const [dataPersentase, setDataPersentase] = useState<PersentasePerubahanPermintaanResponse[]>([]);
  const [filteredDataGraph, setFilteredDataGraph] = useState<GrafikPermintaanBukuResponse[]>([]);
  const [filteredDataTable, setFilteredDataTable] = useState<RataRataPemesananBukuResponse[]>([]);
  const [filteredDataPersentase, setFilteredDataPersentase] = useState<PersentasePerubahanPermintaanResponse[]>([]);
  const [dataCabang, setDataCabang] = useState<CabangResponse[]>([])
  const [selectedCabangs, setSelectedCabangs] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<{
    status: number;
    errorMessage: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("Access token not found");
            navigate("/unauthorized");
            return;
        }

        const startDateFormatted = new Date(startDate).toISOString().split('T')[0]; // "2025-01-01"
        const endDateFormatted = new Date(endDate).toISOString().split('T')[0]; // "2025-01-31"
        const responseGraph = await getLineGraphPermintaan(accessToken, startDateFormatted, endDateFormatted);
        const responseTable = await getRataRataPemesanan(accessToken, startDateFormatted, endDateFormatted);
        const responsePersentase = await getPersentasePerubahan(accessToken, startDateFormatted, endDateFormatted);
        const responseCabang = await getAllCabang(accessToken);

        if (responseGraph.status !== 200) {
          setErrorModal({
            status: responseGraph.status,
            errorMessage: responseGraph.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }
        if (responseTable.status !== 200) {
          setErrorModal({
            status: responseTable.status,
            errorMessage: responseTable.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }
        if (responsePersentase.status !== 200) {
          setErrorModal({
            status: responsePersentase.status,
            errorMessage: responsePersentase.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }

        if (responseCabang.status !== 200) {
          setErrorModal({
            status: responseCabang.status,
            errorMessage: responseCabang.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }

        if (responseGraph.data) {
          setDataGraph(responseGraph.data as GrafikPermintaanBukuResponse[]);
        } else {
          setError("Data Tren Permintaan Buku Grafik tidak ditemukan");
          setErrorModal({
            status: responseGraph.status,
            errorMessage: responseGraph.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }
        if (responseTable.data) {
          setDataTable(responseTable.data as RataRataPemesananBukuResponse[]);
        } else {
          setError("Data Tren Permintaan Buku Tabel Rata-rata tidak ditemukan");
          setErrorModal({
            status: responseTable.status,
            errorMessage: responseTable.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }
        if (responsePersentase.data) {
          setDataPersentase(responsePersentase.data as PersentasePerubahanPermintaanResponse[]);
        } else {
          setError("Data Tren Permintaan Buku Persentase Perubahan tidak ditemukan");
          setErrorModal({
            status: responsePersentase.status,
            errorMessage: responsePersentase.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }

        if (responseCabang.data) {
          const additionalCabang = {
            nomorCabang: "001",
            nama: "Pusat",
            isCabangAsli: true,
          };
          const updatedCabangData = [...responseCabang.data as CabangResponse[], additionalCabang];
          // Sort the cabang data based on nomorCabang
          updatedCabangData.sort((a, b) => {
            return parseInt(a.nomorCabang) - parseInt(b.nomorCabang);
          });
          setDataCabang(updatedCabangData);
          //setDataCabang(responseCabang.data as CabangResponse[]);
          // Initialize all cabangs as selected by default
          //setSelectedCabangs(responseCabang.data.map(cabang => cabang.nomorCabang));
          setSelectedCabangs([]);
        } else {
          setError("Data Cabang tidak ditemukan");
          setErrorModal({
            status: responseTable.status,
            errorMessage: responseTable.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }

      } catch (err) {
        console.error("Error fetching tren permintaan buku data: ", err)
        setError("Gagal memuat data tren permintaan buku")
        setErrorModal({
          status: 500,
          errorMessage: "Failed to fetch tren permintaan buku",
          timestamp: new Date().toString(),
      });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    // If any cabangs are selected, filter the table by them; else show all
    if (selectedCabangs.length > 0) {
      setFilteredDataGraph(dataGraph.filter(item => selectedCabangs.includes(item.nomorCabang)));
      setFilteredDataTable(dataTable.filter(item => selectedCabangs.includes(item.nomorCabang)));
      setFilteredDataPersentase(dataPersentase.filter(item => selectedCabangs.includes(item.nomorCabang)));
    } else {
      setFilteredDataGraph(dataGraph);
      setFilteredDataTable(dataTable);
      setFilteredDataPersentase(dataPersentase);
    }
  }, [selectedCabangs, dataGraph, dataTable, dataPersentase]);

  const handleCheckboxChange = (nomorCabang: string) => {
    setSelectedCabangs(prevSelected => {
      if (prevSelected.includes(nomorCabang)) {
        return prevSelected.filter(cabang => cabang !== nomorCabang);
      } else {
        return [...prevSelected, nomorCabang];
      }
    })
  };

  const formatNumber = (value: number): string => {
    return value.toFixed(2).replace('.', ',');
  };

  const formatPercentage = (value: number): string => {
    return (value * 100).toFixed(2).replace('.', ',') + '%';
  };

  const renderDataTable = () => {
    const groupedData = filteredDataTable.reduce((acc, item) => {
      const key = item.nomorCabang;
      if (!acc[key]) {
        acc[key] = { cabang: key, entries: [] };
      }
      acc[key].entries.push(item);
      return acc;
    }, {} as Record<string, { cabang: string; entries: RataRataPemesananBukuResponse[] }>);
    return Object.values(groupedData).map(({ cabang, entries }) => (
      <div key={cabang} className="mb-4">
        <h3 className="font-semibold">Cabang: {cabang} - {dataCabang.find(c => c.nomorCabang === cabang)?.nama}</h3>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 text-left border border-gray-300">Bulan-Tahun</th>
              <th className="py-2 text-left border border-gray-300">Judul Buku</th>
              <th className="py-2 text-left border border-gray-300">Rata-rata Pemesanan</th>
              <th className="py-2 text-left border border-gray-300">Total Pemesanan</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 border border-gray-300">{entry.monthYearString}</td>
                <td className="py-2 border border-gray-300">{entry.namaBarang}</td>
                <td className="py-2 border border-gray-300">{formatNumber(entry.averageOrders)}</td>
                <td className="py-2 border border-gray-300">{entry.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };
    
  const renderDataPersentase = () => {
    const filteredData = filteredDataPersentase.filter(item => !item.monthYearString.includes("N/A"));
    const groupedData = filteredData.reduce((acc, item) => {
      const key = `${item.namaBarang}#${item.nomorCabang}`;
      if (!acc[key]) {
        acc[key] = { namaBarang: item.namaBarang, nomorCabang: item.nomorCabang, entries: [] };
      }
      acc[key].entries.push(item);
      return acc;
    }, {} as Record<string, { namaBarang: string; nomorCabang: string; entries: PersentasePerubahanPermintaanResponse[] }>);
    return Object.values(groupedData).map(({ namaBarang, nomorCabang, entries }) => (
      <div key={`${namaBarang}-${nomorCabang}`} className="mb-4">
        <h3 className="font-semibold">Nama Buku: {namaBarang}</h3>
        <h4>Cabang: {nomorCabang} - {dataCabang.find(c => c.nomorCabang === nomorCabang)?.nama}</h4>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 text-left border border-gray-300">Bulan-Tahun</th>
              <th className="py-2 text-left border border-gray-300">Persentase</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 border border-gray-300">{entry.monthYearString}</td>
                <td className="py-2 border border-gray-300">{formatPercentage(entry.persentasePerubahan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Prediksi Kebutuhan Stok Buku Berdasarkan Audit Historis</h1>
      </div>

      
      {errorModal && (
        <ErrorModal
          status={errorModal.status}
          errorMessage={errorModal.errorMessage}
          timestamp={errorModal.timestamp}
          onClose={() => setErrorModal(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        {/* Date inputs */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Tanggal Awal Periode:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Tanggal Akhir Periode:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Cabang checkboxes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Cabang:</label>
          <label className="inline-flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={selectedCabangs.length === dataCabang.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCabangs(dataCabang.map(c => c.nomorCabang));
                } else {
                  setSelectedCabangs([]);
                }
              }}
            />
            <span>Pilih Semua</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dataCabang.map((cabang) => (
              <label key={cabang.nomorCabang} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCabangs.includes(cabang.nomorCabang)}
                  onChange={() => handleCheckboxChange(cabang.nomorCabang)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span>{`${cabang.nomorCabang} - ${cabang.nama}`}</span>
              </label>
            ))}
          </div>
        </div>

      </form>
        
      <h2 className="text-lg font-semibold mb-4">Grafik Garis Permintaan Buku</h2>
      {loading ? (
        <div>Loading...</div>
      ) : selectedCabangs.length === 0 ? (
        <div className="text-gray-500 italic">Silakan pilih cabang terlebih dahulu untuk melihat grafik.</div>
      ) : (
        <PermintaanBukuChart data={filteredDataGraph} selectedCabangsCount={selectedCabangs.length} />
      )}

      <h2 className="text-lg font-semibold mt-6">Tabel Rata-Rata Jumlah Pemesanan Buku</h2>

      {loading && <div>Loading...</div>}

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && !error && (
        selectedCabangs.length === 0 ? (
          <div className="text-gray-500 italic">Silakan pilih cabang terlebih dahulu untuk melihat tabel rata-rata.</div>
        ) : (
        renderDataTable()
      ))}

      <h2 className="text-lg font-semibold mt-6">Tabel Persentase Perubahan Permintaan Pemesanan Buku</h2>

      {loading && <div>Loading...</div>}

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && !error && (
        selectedCabangs.length === 0 ? (
          <div className="text-gray-500 italic">Silakan pilih cabang terlebih dahulu untuk melihat tabel persentase.</div>
        ) : (
          renderDataPersentase()
      ))}
    </div>
  );
};

export default TrenPermintaanBuku;