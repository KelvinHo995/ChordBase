import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = () => {

    const handleSearch = () => {
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
                type="text"
                placeholder="Search songs, artists, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-gray-950 placeholder:text-zinc-500 focus:outline-none focus:ring-0 focus:border-slate-200 transition-all"
            />
        </div>
    )
}

export default SearchBar