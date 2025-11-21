"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { SidebarNav } from "@/components/sidebar-nav"

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
        <nav className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-playfair font-bold text-lg text-primary block">PSS</span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>
          </Link>
          <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </nav>
      </header>

      <div className="flex">
        <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 md:py-8">
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

          {/* Scholarships Tab */}
          {activeTab === "scholarships" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Available Scholarships</h2>
                <p className="text-muted-foreground">Scholarship opportunities will be displayed here.</p>
              </div>
            </div>
          )}

          {/* Mentorship Tab */}
          {activeTab === "mentorship" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Mentorship Program</h2>
                <p className="text-muted-foreground">Connect with experienced mentors to guide your journey.</p>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Learning Resources</h2>
                <p className="text-muted-foreground">Access study materials, guides, and educational content.</p>
              </div>
            </div>
          )}

          {/* Career Tab */}
          {activeTab === "career" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Career Support</h2>
                <p className="text-muted-foreground">Get help with resume building, interviews, and placements.</p>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Support & Help</h2>
                <p className="text-muted-foreground">Contact our support team for assistance.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
