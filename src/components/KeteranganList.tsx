import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Assuming pengadaanCAservice returns a structured response, e.g.:
// { status: number; data?: any; message?: string; }
import pengadaanCAservice from '../services/pengadaanCAservice';

// Interface for the data structure of each item
interface Keterangan {
    waktu_pengajuan: string; // Assuming this is a date-time string
    keterangan: string;
    role_pengirim: string; // Role of the sender
    // Add an ID if available from the backend, useful for keys
    // id?: string | number;
}

// Interface for the component's props
interface KeteranganListProps {
    idPengajuan: string | null | undefined; // Allow null/undefined
}

// Define possible sort fields and directions
type SortField = 'waktu_pengajuan' | 'keterangan';
type SortDirection = 'asc' | 'desc';

// Component
const KeteranganList: React.FC<KeteranganListProps> = ({ idPengajuan }) => {
    const [keteranganList, setKeteranganList] = useState<Keterangan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // State for sorting
    const [sortField, setSortField] = useState<SortField>('waktu_pengajuan'); // Default sort
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc'); // Default direction (latest first)

    // --- Data Fetching Effect ---
    useEffect(() => {
        if (!idPengajuan) {
            setKeteranganList([]);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchKeterangan = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await pengadaanCAservice.getKeteranganByIdPengajuan(idPengajuan);
                if (response && response.status === 200 && response.data) {
                     if (Array.isArray(response.data)) {
                        console.log("Keterangan data:", response.data);
                         setKeteranganList(response.data as Keterangan[]);
                     } else {
                         console.error("Error fetching keterangan: Data received is not an array", response.data);
                         setError("Received invalid data format from server.");
                         setKeteranganList([]);
                     }
                } else {
                    console.error("Error fetching keterangan:", response?.message || `Status: ${response?.status}`);
                    setError(response?.message || 'Gagal mengambil data keterangan.');
                    setKeteranganList([]);
                }
            } catch (err: unknown ) {
                console.error("Error fetching keterangan:", err);
                if (err instanceof Error) {
                    setError(err.message || 'Terjadi kesalahan saat mengambil data.');
                } else {
                    setError('Terjadi kesalahan saat mengambil data.');
                }
                setKeteranganList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchKeterangan();
    }, [idPengajuan]); // Re-fetch only when idPengajuan changes

    // --- Sorting Logic using useMemo ---
    const displayedKeterangan = useMemo(() => {
        // Create a shallow copy to avoid mutating the original state array
        const sortedList = [...keteranganList];

        sortedList.sort((a, b) => {
            let compareResult = 0;

            // --- Comparison Logic ---
            switch (sortField) {
                case 'waktu_pengajuan': {
                    // Compare dates - getTime() gives milliseconds since epoch
                    const dateA = new Date(a.waktu_pengajuan).getTime();
                    const dateB = new Date(b.waktu_pengajuan).getTime();
                    compareResult = dateA - dateB; // Ascending by default
                    break;
                }
                case 'keterangan':
                    // Compare strings using localeCompare for better accuracy
                    compareResult = a.keterangan.localeCompare(b.keterangan); // Ascending by default
                    break;
                default:
                    // Should not happen with TypeScript, but good practice
                    compareResult = 0;
            }

            // --- Apply Direction ---
            return sortDirection === 'asc' ? compareResult : compareResult * -1; // Reverse if descending
        });

        return sortedList;
    }, [keteranganList, sortField, sortDirection]); // Recalculate when data or sort criteria change

    // --- Handler to change sorting ---
    // Use useCallback to prevent unnecessary re-creation of the handler function
    const handleSort = useCallback((field: SortField) => {
        setSortField(prevField => {
            // If clicking the same field, toggle direction, otherwise set to ascending
            const newDirection = (prevField === field && sortDirection === 'asc') ? 'desc' : 'asc';
            setSortDirection(newDirection);
            return field; // Set the new field
        });
        // **Alternative logic: Always reset to 'asc' when changing field**
        // setSortDirection(prevDirection => {
        //     if (sortField === field) {
        //         return prevDirection === 'asc' ? 'desc' : 'asc'; // Toggle if same field
        //     }
        //     return 'asc'; // Default to asc when changing field
        // });
        // setSortField(field);
    }, [sortDirection]); // Dependency needed if using the first logic block

    // --- Rendering Logic ---

    if (loading) {
        return <p>Loading history keterangan...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

     if (!idPengajuan) {
         return <p>Silahkan pilih pengajuan untuk melihat history.</p>;
     }

    // No need to check displayedKeterangan.length === 0 separately if you want to show sort buttons anyway
    // if (displayedKeterangan.length === 0) {
    //     return <p>Belum ada history keterangan untuk pengajuan ini.</p>;
    // }

    // Function to add sort indicator arrows
    const getSortIndicator = (field: SortField): string => {
        if (sortField !== field) return ''; // Not sorting by this field
        return sortDirection === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <div className="keterangan-history">
            <h4>
                History Keterangan
                {/* Optional: Add a reset sort button */}
                {/* <button onClick={() => { setSortField('waktu_pengajuan'); setSortDirection('desc'); }}>Reset Sort</button> */}
            </h4>

            {/* Sorting Controls */}
            <div style={{ marginBottom: '10px' }}>
                Sort by:
                <button onClick={() => handleSort('waktu_pengajuan')} style={{ marginLeft: '5px' }}>
                    Waktu{getSortIndicator('waktu_pengajuan')}
                </button>
                <button onClick={() => handleSort('keterangan')} style={{ marginLeft: '5px' }}>
                    Keterangan{getSortIndicator('keterangan')}
                </button>
            </div>

            {/* Display List or Empty Message */}
            {displayedKeterangan.length === 0 ? (
                 <p>Belum ada history keterangan untuk pengajuan ini.</p>
            ) : (
                <ul>
                    {displayedKeterangan.map((item, index) => (
                        <li key={item.waktu_pengajuan || index}> {/* Use unique ID if available */}
                            <strong>{new Date(item.waktu_pengajuan).toLocaleString('id-ID')}</strong>:
                            <p style={{ margin: '0 0 0 10px', display: 'inline' }}>{item.keterangan} - {item.role_pengirim}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default KeteranganList;