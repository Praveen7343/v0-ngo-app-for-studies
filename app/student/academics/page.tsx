"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, GraduationCap, Search, ArrowLeft } from "lucide-react"

interface AcademicData {
  student_name: string
  trust_id: string
  academic_details: {
    level: string
    school_or_college_name: string | null
    board_or_branch: string | null
    year_of_passing_or_studying: string | null
    percentage_or_cgpa: string | null
    pin_number: string | null
  }[]
  grades: {
    subject: string
    marks: number
    grade: string
    status: string
  }[]
}

export default function StudentAcademicsPage() {
  const [studentName, setStudentName] = useState("")
  const [trustId, setTrustId] = useState("")
  const [academicData, setAcademicData] = useState<AcademicData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setAcademicData(null)
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

      setAcademicData({
        student_name: data.student.student_name,
        trust_id: data.student.trust_id,
        academic_details: data.student.academic_details || [],
        grades: [
          { subject: "Mathematics", marks: 85, grade: "A", status: "Passed" },
          { subject: "Science", marks: 78, grade: "B+", status: "Passed" },
          { subject: "English", marks: 82, grade: "A", status: "Passed" },
          { subject: "Social Studies", marks: 75, grade: "B+", status: "Passed" },
          { subject: "Computer Science", marks: 92, grade: "A+", status: "Passed" },
        ],
      })
    } catch {
      setError("Failed to fetch academic details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStudentName("")
    setTrustId("")
    setAcademicData(null)
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
              <span className="text-xs text-muted-foreground">Student Academics</span>
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
              <GraduationCap className="w-4 h-4" />
              Student Academics
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!academicData ? (
          <Card className="shadow-lg border-l-4 border-primary">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-playfair text-2xl">Check Academic Performance</CardTitle>
              <CardDescription>Enter the student name and Trust ID to view academic records</CardDescription>
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
                      View Academics
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
                <CardTitle className="font-playfair text-2xl">Academic Performance</CardTitle>
                <CardDescription>
                  Academic records for {academicData.student_name} (ID: {academicData.trust_id})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Education History */}
                {academicData.academic_details.length > 0 && (
                  <div className="pb-6 border-b border-border">
                    <h3 className="font-playfair text-lg font-bold text-foreground mb-6">Education History</h3>
                    {academicData.academic_details.map((detail, index) => (
                      <div key={index} className="mb-6 last:mb-0">
                        <h4 className="font-semibold text-foreground mb-4 capitalize">{detail.level}</h4>
                        <div className="grid md:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/30">
                          {detail.school_or_college_name && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase mb-1">
                                {detail.level === "ssc" ? "School" : "College"}
                              </p>
                              <p className="font-medium">{detail.school_or_college_name}</p>
                            </div>
                          )}
                          {detail.board_or_branch && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase mb-1">
                                {detail.level === "ssc" ? "Board" : "Branch"}
                              </p>
                              <p className="font-medium">{detail.board_or_branch}</p>
                            </div>
                          )}
                          {detail.year_of_passing_or_studying && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase mb-1">Year</p>
                              <p className="font-medium">{detail.year_of_passing_or_studying}</p>
                            </div>
                          )}
                          {detail.percentage_or_cgpa && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase mb-1">Percentage/CGPA</p>
                              <p className="font-medium">{detail.percentage_or_cgpa}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Current Performance */}
                <div>
                  <h3 className="font-playfair text-lg font-bold text-foreground mb-6">Subject-wise Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left p-3 font-semibold text-sm">Subject</th>
                          <th className="text-left p-3 font-semibold text-sm">Marks</th>
                          <th className="text-left p-3 font-semibold text-sm">Grade</th>
                          <th className="text-left p-3 font-semibold text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicData.grades.map((grade, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 text-sm font-medium">{grade.subject}</td>
                            <td className="p-3 text-sm">{grade.marks}/100</td>
                            <td className="p-3">
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                                {grade.grade}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                {grade.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Overall Performance */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary">82.4%</p>
                      <p className="text-xs text-muted-foreground">Overall Percentage</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">A</p>
                      <p className="text-xs text-muted-foreground">Overall Grade</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center col-span-2 sm:col-span-1">
                      <p className="text-2xl font-bold text-blue-600">3</p>
                      <p className="text-xs text-muted-foreground">Class Rank</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
