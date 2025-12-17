import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import SearchBar from './SearchBar'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Music,
  Home,
  Library,
  Heart,
  Upload,
  Sparkles,
  Settings,
  User,
  LogOut,
  Shield,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react"


const SAMPLE_USER = {
  displayName: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder-user.jpg",
  role: "admin",
}

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // --- MOCK STATE (Replace these with your real props or state later) ---
  const isLoggedIn = true 
  const isAdmin = true
  // ---------------------------------------------------------------------

  const pathname = location.pathname

  // Action Links (Visible only when logged in)
  const userLinks = [
    { href: "/playlists", label: "Favorites", icon: Heart },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/chord-generator", label: "AI Generate", icon: Sparkles },
  ]

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...")
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Music className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">ChordBase</span>
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            
            {isLoggedIn ? (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
                      <Avatar className="h-9 w-9 border border-gray-200">
                        <AvatarImage src={SAMPLE_USER?.avatar || "/placeholder.svg"} alt={SAMPLE_USER?.displayName} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {SAMPLE_USER?.displayName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium text-gray-900">{SAMPLE_USER?.displayName}</p>
                      <p className="text-xs text-gray-500">{SAMPLE_USER?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Logged Out State
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="mb-4">
               <SearchBar /> 
            </div>
            <div className="flex flex-col gap-2">
              {isLoggedIn && actionLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                   <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <User className="h-4 w-4" />
                      Profile
                  </Link>
                  <button
                    onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 rounded-md text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-4">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="justify-start bg-indigo-600 hover:bg-indigo-700">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="hidden md:flex md:items-center md:gap-1 pb-3 border-t border-border pt-3">
          {isLoggedIn &&
            userLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="mb-4">
              <SearchInput placeholder="Search songs, artists..." />
            </div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              {isLoggedIn &&
                userLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header