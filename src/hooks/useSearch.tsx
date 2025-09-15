import { useEffect, useMemo, useState } from "react";
import type { Column } from "../types/kanban";

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const useSearch = (columns: Column[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredColumns = useMemo(() => {
        if (!debouncedSearchTerm.trim()) {
            return columns;
        }

        return columns.map(column => ({
            ...column,
            tasks: column.tasks.filter(task =>
                task.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
        }));
    }, [columns, debouncedSearchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        filteredColumns
    };
};

export default useSearch;