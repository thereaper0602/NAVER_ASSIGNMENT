type SearchBarProps = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
};

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
    return (
        <div className="relative w-full">
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text" placeholder="Search tasks..." className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
        </div>
    )
};

export default SearchBar;