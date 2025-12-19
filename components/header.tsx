"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Menu, X, Phone, ChevronDown, Home, UserPlus, GraduationCap, LogIn, Info, TrendingUp, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsOpen(false)
  }

  const closeSidebar = () => {
    setIsOpen(false)
    setStudentDropdownOpen(false)
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
                      href="/student/daily-attendance"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Daily Attendance
                    </Link>
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
                    <Link
                      href="/student/fee-application"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Fee Application
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

            <div className="md:hidden flex items-center justify-between w-full">
              <span className="text-sm font-medium">PSS Trust</span>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={closeSidebar} />}

      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[75%] max-w-[300px] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header - Blue */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/pss-logo.png"
              alt="PSS Trust Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <h2 className="font-bold text-sm">PSS Trust</h2>
              <p className="text-xs text-primary-foreground/80">Menu</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="p-1" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Menu Items - White background */}
        <div className="bg-white h-full overflow-y-auto">
          <nav className="py-2">
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors"
              onClick={closeSidebar}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            {/* Sign Up */}
            <Link
              href="/signup"
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors"
              onClick={closeSidebar}
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Sign Up</span>
            </Link>

            {/* Student - with submenu */}
            <div>
              <button
                onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-primary hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">Student</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${studentDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {studentDropdownOpen && (
                <div className="bg-gray-50 border-l-4 border-primary ml-4">
                  <Link
                    href="/student/daily-attendance"
                    className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={closeSidebar}
                  >
                    Daily Attendance
                  </Link>
                  <Link
                    href="/student/details"
                    className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={closeSidebar}
                  >
                    Student Details
                  </Link>
                  <Link
                    href="/student/attendance"
                    className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={closeSidebar}
                  >
                    Student Attendance
                  </Link>
                  <Link
                    href="/student/academics"
                    className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={closeSidebar}
                  >
                    Student Academics
                  </Link>
                  <Link
                    href="/student/fee-application"
                    className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={closeSidebar}
                  >
                    Fee Application
                  </Link>
                </div>
              )}
            </div>

            {/* Chairman Login */}
            <Link
              href="/chairman-login"
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors"
              onClick={closeSidebar}
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Chairman Login</span>
            </Link>

            {/* About Us */}
            <a
              href="#about"
              onClick={(e) => handleScroll(e, "about")}
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">About Us</span>
            </a>

            {/* Our Impact */}
            <a
              href="#impact"
              onClick={(e) => handleScroll(e, "impact")}
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Our Impact</span>
            </a>

            {/* Contact Us */}
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Contact Us</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
