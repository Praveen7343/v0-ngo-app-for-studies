"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, User, Search, ArrowLeft } from "lucide-react"

interface StudentData {
  id: string
  student_name: string
  trust_id: string
  father_name: string | null
  mother_name: string | null
  date_of_birth: string | null
  gender: string | null
  mobile_number: string | null
  email_id: string | null
  address: string | null
  login_time: string | null
  created_at: string
  academic_details?: {
    level: string
    school_or_college_name: string | null
    board_or_branch: string | null
    year_of_passing_or_studying: string | null
    percentage_or_cgpa: string | null
    pin_number: string | null
  }[]
}

export default function StudentDetailsPage() {
  const [studentName, setStudentName] = useState("")
  const [trustId, setTrustId] = useState("")
  const [student, setStudent] = useState<StudentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setStudent(null)
    setSearched(true)

    if (!studentName.trim() || !trustId.trim()) {
      setError("Please enter both Student Name and Trust ID")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/student/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: studentName.trim(), trustId: trustId.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Student not found")
        return
      }

      setStudent(data.student)
    } catch {
      setError("Failed to fetch student details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStudentName("")
    setTrustId("")
    setStudent(null)
    setSearched(false)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-playfair font-bold text-lg text-primary block">PSS Trust</span>
              <span className="text-xs text-muted-foreground">Student Details Lookup</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#2d3748] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors rounded"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <span className="flex items-center gap-2 px-4 py-3 text-sm font-medium bg-primary text-white rounded">
              <User className="w-4 h-4" />
              Student Details
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!student ? (
          <Card className="shadow-lg border-l-4 border-primary">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-playfair text-2xl">Find Student Details</CardTitle>
              <CardDescription>Enter the student name and Trust ID to view their details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    type="text"
                    placeholder="Enter student full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trustId">Trust ID</Label>
                  <Input
                    id="trustId"
                    type="text"
                    placeholder="Enter Trust ID (e.g., PSS2025001)"
                    value={trustId}
                    onChange={(e) => setTrustId(e.target.value)}
                    className="h-12 font-mono"
                    disabled={isLoading}
                  />
                </div>

                {error && searched && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search Student
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Search Another Student
            </Button>

            <Card className="shadow-lg border-l-4 border-primary">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Student Details</CardTitle>
                <CardDescription>Details for {student.student_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Personal Information */}
                <div className="pb-6 border-b border-border">
                  <h3 className="font-playfair text-lg font-bold text-foreground mb-6">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Student Name
                      </p>
                      <p className="text-lg font-semibold text-foreground">{student.student_name}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Trust ID
                      </p>
                      <p className="text-lg font-semibold text-foreground font-mono">{student.trust_id}</p>
                    </div>

                    {student.father_name && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Father's Name
                        </p>
                        <p className="text-lg font-semibold text-foreground">{student.father_name}</p>
                      </div>
                    )}

                    {student.mother_name && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Mother's Name
                        </p>
                        <p className="text-lg font-semibold text-foreground">{student.mother_name}</p>
                      </div>
                    )}

                    {student.date_of_birth && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Date of Birth
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {new Date(student.date_of_birth).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}

                    {student.gender && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Gender
                        </p>
                        <p className="text-lg font-semibold text-foreground">{student.gender}</p>
                      </div>
                    )}

                    {student.mobile_number && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Mobile Number
                        </p>
                        <p className="text-lg font-semibold text-foreground">{student.mobile_number}</p>
                      </div>
                    )}

                    {student.email_id && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Email ID
                        </p>
                        <p className="text-lg font-semibold text-foreground">{student.email_id}</p>
                      </div>
                    )}

                    {student.address && (
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Address
                        </p>
                        <p className="text-lg font-semibold text-foreground">{student.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Details */}
                {student.academic_details && student.academic_details.length > 0 && (
                  <div className="pb-6 border-b border-border">
                    <h3 className="font-playfair text-lg font-bold text-foreground mb-6">Academic Details</h3>

                    {student.academic_details.map((academic, index) => (
                      <div key={index} className="mb-6 last:mb-0">
                        <h4 className="font-semibold text-foreground mb-4 capitalize">{academic.level}</h4>
                        <div className="grid md:grid-cols-2 gap-6 pl-4 border-l-2 border-primary/30">
                          {academic.school_or_college_name && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                {academic.level === "ssc" ? "School Name" : "College Name"}
                              </p>
                              <p className="text-base font-semibold text-foreground">
                                {academic.school_or_college_name}
                              </p>
                            </div>
                          )}

                          {academic.board_or_branch && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                {academic.level === "ssc" ? "Board" : "Branch"}
                              </p>
                              <p className="text-base font-semibold text-foreground">{academic.board_or_branch}</p>
                            </div>
                          )}

                          {academic.year_of_passing_or_studying && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                {academic.level === "ssc" ? "Year of Passing" : "Year of Studying"}
                              </p>
                              <p className="text-base font-semibold text-foreground">
                                {academic.year_of_passing_or_studying}
                              </p>
                            </div>
                          )}

                          {academic.percentage_or_cgpa && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Percentage / CGPA
                              </p>
                              <p className="text-base font-semibold text-foreground">{academic.percentage_or_cgpa}</p>
                            </div>
                          )}

                          {academic.pin_number && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                PIN Number
                              </p>
                              <p className="text-base font-semibold text-foreground font-mono bg-muted p-2 rounded">
                                {academic.pin_number}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Registration Info */}
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-semibold">Registered On:</span>{" "}
                    {new Date(student.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {student.login_time && (
                    <p>
                      <span className="font-semibold">Last Login:</span>{" "}
                      {new Date(student.login_time).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
