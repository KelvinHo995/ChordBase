import React from 'react'
import { Shield, Upload, User } from 'lucide-react'
import SearchBar from './SearchBar'

const Header = () => {
  return (
    <header className="flex justify-around items-center w-full bg-white shadow-sm py-3 px-6 sticky top-0 z-50">
      Navbar
      <SearchBar />
      <nav class="bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex justify-end items-center h-16 space-x-8">
            <a href="/admin" class="flex flex-col items-center p-2 text-gray-700 hover:text-indigo-600">
              <Shield />
              <span class="text-xs font-medium mt-1">Admin</span>
            </a>
            <a href="/upload" class="flex flex-col items-center p-2 text-gray-700 hover:text-indigo-600">
              <Upload />
              <span class="text-xs font-medium mt-1">Upload</span>
            </a>
            <a href="/profile" class="flex flex-col items-center p-2 text-gray-700 hover:text-indigo-600">
              <User />
              <span class="text-xs font-medium mt-1">Profile</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header