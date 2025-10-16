import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">OD</span>
          </div>
          <span className="text-xl font-bold text-gray-900">OneDesk</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="#features" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Features
          </Link>
          <Link 
            href="#pricing" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Pricing
          </Link>
          <Link 
            href="#integrations" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Integrations
          </Link>
          <Link 
            href="#docs" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Docs
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/auth/login"
            className="hidden sm:inline-flex text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Login
          </Link>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}