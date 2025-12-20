import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search songs, artists, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-gray-950 placeholder:text-zinc-500 focus:outline-none focus:ring-0 focus:border-slate-200 transition-all"
            />
        </form>
    )
}

export default SearchBar