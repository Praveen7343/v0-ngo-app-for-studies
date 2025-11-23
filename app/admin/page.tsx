"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Search, ChevronDown, ChevronUp } from "lucide-react"

interface AcademicDetail {
  level: string
  schoolName: string
  boardBranch: string
  yearOfStudying: string
  percentage: string
  pin: string
}

interface StudentData {
  id: string
  student_name: string
  trust_id: string
  father_name: string
  mother_name: string
  email_id: string
  mobile_number: string
  date_of_birth: string
  gender: string
  address: string
  academic_details: AcademicDetail[]
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [students, setStudents] = useState<StudentData[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [chairman, setChairman] = useState<any>(null)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  useEffect(() => {
    // Check if chairman is logged in
    const chairmanData = localStorage.getItem("pssChairman")
    if (!chairmanData) {
      router.push("/chairman-login")
      return
    }

    setChairman(JSON.parse(chairmanData))

    const fetchStudents = async () => {
      try {
        const supabase = await import("@/lib/supabase/client").then((m) => m.createBrowserClient())

        const { data: studentData, error: studentsError } = await supabase.from("students").select("*")

        if (studentsError) throw studentsError

        const formattedStudents = studentData.map((student: any, index: number) => ({
          id: student.id,
          student_name: student.student_name,
          trust_id: student.trust_id,
          father_name: student.father_name || "-",
          mother_name: student.mother_name || "-",
          email_id: student.email_id || "-",
          mobile_number: student.mobile_number || "-",
          date_of_birth: student.date_of_birth || "-",
          gender: student.gender || "-",
          address: student.address || "-",
          academic_details: [],
          created_at: student.created_at,
        }))

        // Fetch academic details for each student
        const { data: academicData, error: academicError } = await supabase.from("academic_details").select("*")

        if (academicError) throw academicError

        // Organize academic details by student
        academicData.forEach((academic: any) => {
          const student = formattedStudents.find((s: any) => s.id === academic.student_id)
          if (student) {
            const levelName =
              academic.level === "ssc" ? "SSC / 10th Class" : academic.level === "diploma" ? "Diploma" : "B.Tech"

            student.academic_details.push({
              level: levelName,
              schoolName: academic.school_or_college_name || "-",
              boardBranch: academic.board_or_branch || "-",
              yearOfStudying: academic.year_of_passing_or_studying || "-",
              percentage: academic.percentage_or_cgpa || "-",
              pin: academic.pin_number || "-",
            })
          }
        })

        setStudents(formattedStudents)
      } catch (error) {
        console.error("[v0] Error fetching students:", error)
        // Fallback to localStorage if Supabase fails
        const registrations = JSON.parse(localStorage.getItem("pssRegistrations") || "[]")
        setStudents(
          registrations.map((student: any, index: number) => ({
            id: index.toString(),
            student_name: student.fullName,
            trust_id: student.trustId,
            father_name: student.personal?.fatherName || "-",
            mother_name: student.personal?.motherName || "-",
            email_id: student.personal?.emailId || "-",
            mobile_number: student.personal?.mobileNumber || "-",
            date_of_birth: student.personal?.dateOfBirth || "-",
            gender: student.personal?.gender || "-",
            address: student.personal?.address || "-",
            academic_details: [
              ...(student.ssc
                ? [
                    {
                      level: "SSC / 10th Class",
                      schoolName: student.ssc.schoolName || "-",
                      boardBranch: student.ssc.board || "-",
                      yearOfStudying: student.ssc.yearOfPassing || "-",
                      percentage: student.ssc.percentage || "-",
                      pin: "-",
                    },
                  ]
                : []),
              ...(student.diploma
                ? [
                    {
                      level: "Diploma",
                      schoolName: student.diploma.collegeName || "-",
                      boardBranch: student.diploma.branch || "-",
                      yearOfStudying: student.diploma.yearOfStudying || "-",
                      percentage: student.diploma.percentage || "-",
                      pin: student.diploma.pin || "-",
                    },
                  ]
                : []),
              ...(student.btech
                ? [
                    {
                      level: "B.Tech",
                      schoolName: student.btech.collegeName || "-",
                      boardBranch: student.btech.branch || "-",
                      yearOfStudying: student.btech.yearOfStudying || "-",
                      percentage: student.btech.percentage || "-",
                      pin: "-",
                    },
                  ]
                : []),
            ],
            created_at: student.createdAt || new Date().toISOString(),
          })),
        )
      }
      setIsLoading(false)
    }

    fetchStudents()
  }, [router])

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.trust_id.includes(searchTerm) ||
        student.email_id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStudents(filtered)
  }, [searchTerm, students])

  const handleLogout = () => {
    localStorage.removeItem("pssChairman")
    router.push("/")
  }

  const toggleExpand = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <h1 className="font-playfair font-bold text-lg text-primary">PSS Admin Dashboard</h1>
              <p className="text-xs text-gray-600">Chairman: {chairman?.fullName}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Students</p>
            <p className="text-3xl font-bold text-primary mt-2">{students.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">New This Month</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {
                students.filter((s) => {
                  const date = new Date(s.created_at)
                  const now = new Date()
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                }).length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">With Contact Info</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {students.filter((s) => s.mobile_number !== "-").length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 items-center">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, Trust ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Student Summary Card */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                  onClick={() => toggleExpand(student.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{student.student_name}</h3>
                    <p className="text-sm text-gray-600">Trust ID: {student.trust_id}</p>
                    <p className="text-sm text-gray-600">Email: {student.email_id}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    {expandedStudent === student.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedStudent === student.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Father's Name</p>
                          <p className="text-sm text-gray-900 font-medium">{student.father_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Mother's Name</p>
                          <p className="text-sm text-gray-900 font-medium">{student.mother_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Date of Birth</p>
                          <p className="text-sm text-gray-900 font-medium">{student.date_of_birth}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Gender</p>
                          <p className="text-sm text-gray-900 font-medium">{student.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Mobile Number</p>
                          <p className="text-sm text-gray-900 font-medium">{student.mobile_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase">Address</p>
                          <p className="text-sm text-gray-900 font-medium">{student.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Details */}
                    {student.academic_details.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Academic Details (Year-Wise)</h4>
                        <div className="space-y-4">
                          {student.academic_details.map((academic, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                              <h5 className="font-semibold text-primary mb-3">{academic.level}</h5>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-600 uppercase">School/College Name</p>
                                  <p className="text-sm text-gray-900">{academic.schoolName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 uppercase">Board/Branch</p>
                                  <p className="text-sm text-gray-900">{academic.boardBranch}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 uppercase">Year of Studying/Passing</p>
                                  <p className="text-sm text-gray-900">{academic.yearOfStudying}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 uppercase">Percentage/CGPA</p>
                                  <p className="text-sm text-gray-900">{academic.percentage}</p>
                                </div>
                                {academic.pin !== "-" && (
                                  <div>
                                    <p className="text-xs text-gray-600 uppercase">PIN Number</p>
                                    <p className="text-sm text-gray-900">{academic.pin}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">Registered: {new Date(student.created_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No students found</div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            <Link href="/login" className="text-primary hover:underline">
              Back to Main Site
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
