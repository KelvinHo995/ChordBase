import React, { useState, useEffect, useRef } from 'react'
import { Search, Music, User, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SongService } from '@/services/BackendService'

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const navigate = useNavigate()
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)

    // Debounce for search suggestions
    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([])
            setShowDropdown(false)
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const response = await SongService.getAll({ q: query, limit: 8 })
                setSuggestions(response.data?.songs || [])
                setShowDropdown(true)
            } catch (error) {
                console.error('Error fetching suggestions:', error)
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`)
            setShowDropdown(false)
            inputRef.current?.blur()
        }
    }

    const handleSuggestionClick = (song) => {
        navigate(`/songs/${song.song_id}`)
        setQuery('')
        setSuggestions([])
        setShowDropdown(false)
        inputRef.current?.blur()
    }

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex((prev) => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionClick(suggestions[selectedIndex])
                } else {
                    handleSubmit(e)
                }
                break
            case 'Escape':
                setShowDropdown(false)
                setSelectedIndex(-1)
                break
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowDropdown(true)
                    }}
                    placeholder="Tìm kiếm bài hát, nghệ sĩ hoặc từ khóa..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-gray-950 placeholder:text-zinc-500 focus:outline-none focus:ring-0 focus:border-slate-200 transition-all"
                    autoComplete="off"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 animate-spin" />
                )}
            </form>

            {/* Dropdown Suggestions */}
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {suggestions.map((song, index) => (
                        <div
                            key={song.song_id}
                            onClick={() => handleSuggestionClick(song)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                index === selectedIndex
                                    ? 'bg-indigo-50'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <Music className="h-4 w-4 text-indigo-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                    {song.title}
                                </div>
                                {song.artists && song.artists.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <User className="h-3 w-3" />
                                        <span className="truncate">
                                            {song.artists.map(a => a.name).join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {song.genre && (
                                <span className="text-xs text-gray-500 shrink-0">
                                    {song.genre.name}
                                </span>
                            )}
                        </div>
                    ))}
                    
                    {/* View all results option */}
                    <div
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 cursor-pointer hover:bg-gray-50 text-sm text-indigo-600 font-medium"
                    >
                        <Search className="h-4 w-4" />
                        Xem tất cả kết quả cho "{query}"
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBar