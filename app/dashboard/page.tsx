"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, Home, User, Calendar, GraduationCap, ChevronDown } from "lucide-react"

interface UserData {
  studentName: string
  trustId: string
  loginTime: string
  fatherName?: string
  motherName?: string
  dateOfBirth?: string
  gender?: string
  mobileNumber?: string
  emailId?: string
  address?: string
  qualification?: string
  branch?: string
  pin?: string
  ssc?: {
    schoolName: string
    board: string
    yearOfPassing: string
    percentage: string
  }
  diploma?: {
    collegeName: string
    branch: string
    yearOfStudying: string
    pinNumber: string
    percentage: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem("pssUser")
    if (!userStr) {
      window.location.href = "/login"
      return
    }
    setUser(JSON.parse(userStr))
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("pssUser")
    window.location.href = "/"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "details", label: "Student Details", icon: User },
    { id: "attendance", label: "Student Attendance", icon: Calendar },
    { id: "academics", label: "Student Academics", icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Header with Logo */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-playfair font-bold text-lg text-primary block">PSS Trust</span>
              <span className="text-xs text-muted-foreground">Student Portal</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-foreground">{user.studentName}</p>
              <p className="text-xs text-muted-foreground">ID: {user.trustId}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-[#2d3748] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 py-1">
            {navItems.map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors rounded"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors rounded ${
                    activeTab === item.id ? "bg-primary text-white" : "hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ),
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden py-2">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium bg-white/10 rounded"
            >
              <span className="flex items-center gap-2">
                {navItems.find((item) => item.id === activeTab)?.icon &&
                  (() => {
                    const Icon = navItems.find((item) => item.id === activeTab)?.icon || User
                    return <Icon className="w-4 h-4" />
                  })()}
                {navItems.find((item) => item.id === activeTab)?.label || "Menu"}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`} />
            </button>

            {mobileNavOpen && (
              <div className="mt-2 space-y-1 bg-[#1a202c] rounded-lg p-2">
                {navItems.map((item) =>
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-white/10 transition-colors rounded"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setMobileNavOpen(false)
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm font-medium transition-colors rounded ${
                        activeTab === item.id ? "bg-primary text-white" : "hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-primary mb-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-playfair text-2xl font-bold text-foreground">Student Details</h2>
                  <Link href="/dashboard/edit-profile">
                    <Button className="bg-primary hover:bg-primary/90 text-white">Edit Profile</Button>
                  </Link>
                </div>

                {/* Personal Information Section */}
                <div className="mb-8 pb-8 border-b border-border">
                  <h3 className="font-playfair text-lg font-bold text-foreground mb-6">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Student Name
                      </p>
                      <p className="text-lg font-semibold text-foreground">{user.studentName}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Trust ID
                      </p>
                      <p className="text-lg font-semibold text-foreground font-mono">{user.trustId}</p>
                    </div>

                    {user.fatherName && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Father's Name
                        </p>
                        <p className="text-lg font-semibold text-foreground">{user.fatherName}</p>
                      </div>
                    )}

                    {user.motherName && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Mother's Name
                        </p>
                        <p className="text-lg font-semibold text-foreground">{user.motherName}</p>
                      </div>
                    )}

                    {user.dateOfBirth && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Date of Birth
                        </p>
                        <p className="text-lg font-semibold text-foreground">{user.dateOfBirth}</p>
                      </div>
                    )}

                    {user.gender && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Gender
                        </p>
                        <p className="text-lg font-semibold text-foreground">{user.gender}</p>
                      </div>
                    )}

                    {user.mobileNumber && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Mobile Number
                        </p>
                        <p className="text-lg font-semibold text-foreground">{user.mobileNumber}</p>
                      </div>
                    )}

                    {user.emailId && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Email ID
                        </p>
                        <p className="text-lg font-semibold text-foreground">{user.emailId}</p>
                      </div>
                    )}

                    {user.address && (
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Address
                        </p>
                        <p className="text-lg font-semibold text-foreground">{user.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Details Section */}
                {(user.ssc || user.diploma) && (
                  <div className="mb-8 pb-8 border-b border-border">
                    <h3 className="font-playfair text-lg font-bold text-foreground mb-6">Academic Details</h3>

                    {/* SSC Section */}
                    {user.ssc && (
                      <div className="mb-8">
                        <h4 className="font-semibold text-foreground mb-4">SSC / 10th Class</h4>
                        <div className="grid md:grid-cols-2 gap-8 pl-4 border-l-2 border-primary/30">
                          {user.ssc.schoolName && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                School Name
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.ssc.schoolName}</p>
                            </div>
                          )}

                          {user.ssc.board && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                Board
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.ssc.board}</p>
                            </div>
                          )}

                          {user.ssc.yearOfPassing && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                Year of Passing
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.ssc.yearOfPassing}</p>
                            </div>
                          )}

                          {user.ssc.percentage && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                Percentage / CGPA
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.ssc.percentage}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Diploma Section */}
                    {user.diploma && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Diploma</h4>
                        <div className="grid md:grid-cols-2 gap-8 pl-4 border-l-2 border-primary/30">
                          {user.diploma.collegeName && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                College Name
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.diploma.collegeName}</p>
                            </div>
                          )}

                          {user.diploma.branch && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                Branch
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.diploma.branch}</p>
                            </div>
                          )}

                          {user.diploma.yearOfStudying && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                Year of Studying
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.diploma.yearOfStudying}</p>
                            </div>
                          )}

                          {user.diploma.pinNumber && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                PIN Number
                              </p>
                              <p className="text-base font-semibold text-foreground font-mono bg-muted p-2 rounded">
                                {user.diploma.pinNumber}
                              </p>
                            </div>
                          )}

                          {user.diploma.percentage && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                Percentage (Till Now)
                              </p>
                              <p className="text-base font-semibold text-foreground">{user.diploma.percentage}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Last Login */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold">Last Login:</span> {new Date(user.loginTime).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-primary">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Student Attendance</h2>

                {/* Attendance Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">85%</p>
                    <p className="text-sm text-green-700">Overall Attendance</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">45</p>
                    <p className="text-sm text-blue-700">Classes Attended</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-orange-600">8</p>
                    <p className="text-sm text-orange-700">Classes Missed</p>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3 font-semibold text-sm">Date</th>
                        <th className="text-left p-3 font-semibold text-sm">Subject</th>
                        <th className="text-left p-3 font-semibold text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 text-sm">29 Nov 2025</td>
                        <td className="p-3 text-sm">Mathematics</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            Present
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm">28 Nov 2025</td>
                        <td className="p-3 text-sm">English</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            Present
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm">27 Nov 2025</td>
                        <td className="p-3 text-sm">Science</td>
                        <td className="p-3">
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Absent</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm">26 Nov 2025</td>
                        <td className="p-3 text-sm">Computer Science</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            Present
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  * Attendance records are updated by the trust administrators.
                </p>
              </div>
            </div>
          )}

          {activeTab === "academics" && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-primary">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Student Academics</h2>

                {/* Academic Performance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-primary">A+</p>
                    <p className="text-sm text-muted-foreground">Current Grade</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">92%</p>
                    <p className="text-sm text-blue-700">Average Score</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">3</p>
                    <p className="text-sm text-green-700">Rank in Class</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">6</p>
                    <p className="text-sm text-purple-700">Subjects Enrolled</p>
                  </div>
                </div>

                {/* Subjects Performance */}
                <h3 className="font-semibold text-lg mb-4">Subject-wise Performance</h3>
                <div className="space-y-4 mb-8">
                  {[
                    { subject: "Mathematics", score: 95, grade: "A+" },
                    { subject: "English", score: 88, grade: "A" },
                    { subject: "Science", score: 92, grade: "A+" },
                    { subject: "Computer Science", score: 98, grade: "A+" },
                    { subject: "Social Studies", score: 85, grade: "A" },
                    { subject: "Telugu", score: 90, grade: "A+" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-32 sm:w-40 text-sm font-medium">{item.subject}</div>
                      <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-semibold text-right">{item.score}%</div>
                      <div className="w-10 text-center">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                          {item.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exam Results Table */}
                <h3 className="font-semibold text-lg mb-4">Recent Exam Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3 font-semibold text-sm">Exam Name</th>
                        <th className="text-left p-3 font-semibold text-sm">Date</th>
                        <th className="text-left p-3 font-semibold text-sm">Score</th>
                        <th className="text-left p-3 font-semibold text-sm">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 text-sm">Mid-Term Examination</td>
                        <td className="p-3 text-sm">Oct 2025</td>
                        <td className="p-3 text-sm">456/500</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">A+</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm">Unit Test 2</td>
                        <td className="p-3 text-sm">Sep 2025</td>
                        <td className="p-3 text-sm">92/100</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">A+</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm">Unit Test 1</td>
                        <td className="p-3 text-sm">Aug 2025</td>
                        <td className="p-3 text-sm">88/100</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">A</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  * Academic records are updated after each examination by the trust administrators.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
