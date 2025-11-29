"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Calendar, Search, ArrowLeft } from "lucide-react"

interface AttendanceData {
  student_name: string
  trust_id: string
  attendance: {
    date: string
    subject: string
    status: "present" | "absent"
  }[]
  summary: {
    total_classes: number
    present: number
    absent: number
    percentage: number
  }
}

export default function StudentAttendancePage() {
  const [studentName, setStudentName] = useState("")
  const [trustId, setTrustId] = useState("")
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setAttendanceData(null)
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

      // Mock attendance data for now (can be replaced with real data later)
      setAttendanceData({
        student_name: data.student.student_name,
        trust_id: data.student.trust_id,
        attendance: [
          { date: "2025-11-29", subject: "Mathematics", status: "present" },
          { date: "2025-11-28", subject: "English", status: "present" },
          { date: "2025-11-27", subject: "Science", status: "absent" },
          { date: "2025-11-26", subject: "Social Studies", status: "present" },
          { date: "2025-11-25", subject: "Computer Science", status: "present" },
        ],
        summary: {
          total_classes: 53,
          present: 45,
          absent: 8,
          percentage: 85,
        },
      })
    } catch {
      setError("Failed to fetch attendance details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStudentName("")
    setTrustId("")
    setAttendanceData(null)
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
              <span className="text-xs text-muted-foreground">Student Attendance</span>
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
              <Calendar className="w-4 h-4" />
              Student Attendance
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!attendanceData ? (
          <Card className="shadow-lg border-l-4 border-primary">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-playfair text-2xl">Check Student Attendance</CardTitle>
              <CardDescription>Enter the student name and Trust ID to view attendance records</CardDescription>
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
                      Check Attendance
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
                <CardTitle className="font-playfair text-2xl">Attendance Record</CardTitle>
                <CardDescription>
                  Attendance for {attendanceData.student_name} (ID: {attendanceData.trust_id})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Attendance Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{attendanceData.summary.total_classes}</p>
                    <p className="text-xs text-blue-700">Total Classes</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{attendanceData.summary.present}</p>
                    <p className="text-xs text-green-700">Present</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{attendanceData.summary.absent}</p>
                    <p className="text-xs text-red-700">Absent</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{attendanceData.summary.percentage}%</p>
                    <p className="text-xs text-primary">Attendance %</p>
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
                      {attendanceData.attendance.map((record, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 text-sm">
                            {new Date(record.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-3 text-sm">{record.subject}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                record.status === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {record.status === "present" ? "Present" : "Absent"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
