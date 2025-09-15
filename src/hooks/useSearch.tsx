import { useEffect, useState } from "react";
import type { Column } from "../types/kanban";

const useSearch = (columns: Column[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredColumns, setFilteredColumns] = useState<Column[]>(columns);

    const filterTasks = (term: string) => {
        if (!term.trim()) {
            setFilteredColumns(columns);
            return;
        }
        
        const filtered = columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(task =>
                task.content.toLowerCase().includes(term.toLowerCase())
            )
        }));
        
        setFilteredColumns(filtered);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            filterTasks(searchTerm);
        }, 1000);
        return () => clearTimeout(timer); 
    },[searchTerm, columns]);

    return { searchTerm, setSearchTerm, filteredColumns };
};

export default useSearch;