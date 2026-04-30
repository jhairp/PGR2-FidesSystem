import { useState, useMemo } from "react";

export function useCentroTable(centros) {
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        return centros.filter(c => 
            c.nom_cen?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.ciudad_cen?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [centros, searchQuery]);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * perPage, 
        currentPage * perPage
    );

    return {
        searchQuery, setSearchQuery,
        perPage, setPerPage,
        currentPage, setCurrentPage,
        paginatedData,
        totalItems: filteredData.length
    };
}