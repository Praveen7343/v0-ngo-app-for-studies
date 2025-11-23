"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
          <div>
            <span className="font-playfair font-bold text-lg text-primary block">PSS</span>
            <span className="text-xs text-muted-foreground">Social Welfare</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#impact" className="text-foreground hover:text-primary transition-colors">
            Impact
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline">Student Login</Button>
          </Link>
          <Link href="/chairman-login">
            <Button variant="outline">Chairman Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-4">
            <a href="#features" className="block text-foreground hover:text-primary">
              Features
            </a>
            <a href="#impact" className="block text-foreground hover:text-primary">
              Impact
            </a>
            <Link href="/login">
              <Button variant="outline" className="w-full bg-transparent">
                Student Login
              </Button>
            </Link>
            <Link href="/chairman-login">
              <Button variant="outline" className="w-full bg-transparent">
                Chairman Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
