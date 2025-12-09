import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = () => {

    const handleSearch = () => {
    }

    return (
        <section className='w-full max-w-lg'>
            <div className="flex justify-center items-center w-full max-w-xl bg-white border border-gray-300 rounded-lg shadow-sm">
                <div className='px-2'>
                    <Search size={20} /> 
                </div>

                <input
                    type="text"
                    placeholder="Search songs, artists, or chords..."
                    className="w-full p-3 text-sm text-gray-700 placeholder-gray-500 bg-transparent focus:outline-none"
                />
                
            </div>
        </section>
    )
}

export default SearchBar