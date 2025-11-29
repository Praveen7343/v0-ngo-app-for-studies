"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Menu, X, Phone, ChevronDown } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false)

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Full Name */}
            <div className="flex items-center gap-2 md:gap-4">
              <Image
                src="/images/pss-logo.png"
                alt="PSS Trust Logo"
                width={70}
                height={70}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px] rounded-full border-2 border-primary flex-shrink-0"
              />
              <div>
                <h1 className="font-bold text-[10px] sm:text-sm md:text-lg lg:text-xl text-primary leading-tight">
                  Potukuchi Somasundara
                </h1>
                <p className="text-[9px] sm:text-xs md:text-sm lg:text-base text-primary font-semibold">
                  Social Welfare & Charitable Trust
                </p>
              </div>
            </div>

            {/* Chairman Photo and Contact Info */}
            <div className="flex items-center gap-2 md:gap-8">
              {/* Chairman Photo */}
              <div className="hidden md:flex items-center gap-3">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-2 border-primary overflow-hidden">
                  <Image
                    src="/images/image.png"
                    alt="Dr (H.C) P Srinivas - Chairman & Trustee"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs lg:text-sm font-semibold text-foreground">Dr (H.C) P Srinivas</p>
                  <p className="text-xs text-primary font-medium">CHAIRMAN</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg flex-shrink-0">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:9346206332" className="text-base font-semibold text-primary">
                  9346206332
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link href="/" className="px-3 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                Home
              </Link>
              <a
                href="#about"
                onClick={(e) => handleScroll(e, "about")}
                className="px-3 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                About Us
              </a>
              <a
                href="#impact"
                onClick={(e) => handleScroll(e, "impact")}
                className="px-3 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                Our Impact
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "contact")}
                className="px-3 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                Contact Us
              </a>
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                  Student
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Dropdown menu - shows on hover */}
                <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-lg shadow-lg border border-border py-2 min-w-[180px]">
                    <Link
                      href="/student/details"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Student Details
                    </Link>
                    <Link
                      href="/student/attendance"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Student Attendance
                    </Link>
                    <Link
                      href="/student/academics"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Student Academics
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/chairman-login">
                <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
                  Chairman Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile: Show trust name and menu button */}
            <div className="md:hidden flex items-center justify-between w-full">
              <span className="text-sm font-medium">PSS Trust</span>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-white/20">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" className="block px-3 py-2 text-primary-foreground hover:bg-white/10 rounded">
              Home
            </Link>
            <a
              href="#about"
              onClick={(e) => handleScroll(e, "about")}
              className="block px-3 py-2 text-primary-foreground hover:bg-white/10 rounded cursor-pointer"
            >
              About Us
            </a>
            <a
              href="#impact"
              onClick={(e) => handleScroll(e, "impact")}
              className="block px-3 py-2 text-primary-foreground hover:bg-white/10 rounded cursor-pointer"
            >
              Our Impact
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              className="block px-3 py-2 text-primary-foreground hover:bg-white/10 rounded cursor-pointer"
            >
              Contact Us
            </a>
            <div>
              <button
                onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-primary-foreground hover:bg-white/10 rounded"
              >
                Student
                <ChevronDown className={`w-4 h-4 transition-transform ${studentDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {studentDropdownOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/30 pl-3">
                  <Link
                    href="/student/details"
                    className="block px-3 py-2 text-primary-foreground/90 hover:bg-white/10 rounded text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Student Details
                  </Link>
                  <Link
                    href="/student/attendance"
                    className="block px-3 py-2 text-primary-foreground/90 hover:bg-white/10 rounded text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Student Attendance
                  </Link>
                  <Link
                    href="/student/academics"
                    className="block px-3 py-2 text-primary-foreground/90 hover:bg-white/10 rounded text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Student Academics
                  </Link>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-white/20 space-y-2">
              <Link href="/chairman-login" className="block">
                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
                  Chairman Login
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
