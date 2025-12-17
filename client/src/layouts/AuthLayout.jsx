import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 text-gray-900">      
      {/* <Header /> */}

      <main className="flex justify-center w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default AuthLayout