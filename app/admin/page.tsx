"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Search, ChevronDown, ChevronUp, CheckCircle, Clock } from "lucide-react"

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
  login_time: string | null
  has_logged_in: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [students, setStudents] = useState<StudentData[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [chairman, setChairman] = useState<any>(null)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "logged_in" | "not_logged_in">("all")

  useEffect(() => {
    const chairmanData = localStorage.getItem("pssChairman")
    if (!chairmanData) {
      router.push("/chairman-login")
      return
    }

    setChairman(JSON.parse(chairmanData))

    const fetchStudents = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const { data: studentData, error: studentsError } = await supabase.from("students").select("*")

        if (studentsError) throw studentsError

        const formattedStudents = studentData.map((student: any) => ({
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
          login_time: student.login_time,
          has_logged_in: !!student.login_time,
        }))

        const { data: academicData, error: academicError } = await supabase.from("academic_details").select("*")

        if (academicError) throw academicError

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
        setStudents([])
      }
      setIsLoading(false)
    }

    fetchStudents()
  }, [router])

  useEffect(() => {
    let filtered = students.filter(
      (student) =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.trust_id.includes(searchTerm) ||
        student.email_id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterStatus === "logged_in") {
      filtered = filtered.filter((s) => s.has_logged_in)
    } else if (filterStatus === "not_logged_in") {
      filtered = filtered.filter((s) => !s.has_logged_in)
    }

    setFilteredStudents(filtered)
  }, [searchTerm, students, filterStatus])

  const groupedStudents = useMemo(() => {
    const groups: Record<string, StudentData[]> = {}

    filteredStudents.forEach((student) => {
      let group = "Other"

      const btech = student.academic_details.find((d) => d.level === "B.Tech")
      const diploma = student.academic_details.find((d) => d.level === "Diploma")

      if (btech) {
        group = `B.Tech - ${btech.yearOfStudying}`
      } else if (diploma) {
        group = `Diploma - ${diploma.yearOfStudying}`
      } else {
        const ssc = student.academic_details.find((d) => d.level === "SSC / 10th Class")
        if (ssc) group = "SSC Completed"
      }

      if (!groups[group]) groups[group] = []
      groups[group].push(student)
    })

    return groups
  }, [filteredStudents])

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedStudents).sort()
  }, [groupedStudents])

  const stats = useMemo(() => {
    const total = students.length
    const loggedIn = students.filter((s) => s.has_logged_in).length
    return { total, loggedIn, notLoggedIn: total - loggedIn }
  }, [students])

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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <h1 className="font-playfair font-bold text-lg text-primary">PSS Admin Dashboard</h1>
              <p className="text-xs text-gray-600">Chairman: {chairman?.fullName}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/")} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{stats.total}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="font-semibold text-gray-900">Registered</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Logged In</p>
                <p className="font-semibold text-green-600">{stats.loggedIn} Students</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Not Logged In Yet</p>
                <p className="font-semibold text-orange-600">{stats.notLoggedIn} Students</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex gap-4 items-center flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, Trust ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "logged_in" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("logged_in")}
                className={filterStatus === "logged_in" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Logged In
              </Button>
              <Button
                variant={filterStatus === "not_logged_in" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("not_logged_in")}
                className={filterStatus === "not_logged_in" ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                Not Logged In
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {sortedGroupKeys.length > 0 ? (
            sortedGroupKeys.map((group) => (
              <div key={group} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">{group}</h2>
                {groupedStudents[group].map((student) => (
                  <div key={student.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                      onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-gray-900">{student.student_name}</h3>
                          {student.has_logged_in ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              <Clock className="w-3 h-3" />
                              Not logged in
                            </span>
                          )}
                        </div>
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

                    {expandedStudent === student.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
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
                              <p className="text-xs text-gray-600 uppercase">Email ID</p>
                              <p className="text-sm text-gray-900 font-medium">{student.email_id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase">Address</p>
                              <p className="text-sm text-gray-900 font-medium">{student.address}</p>
                            </div>
                          </div>
                        </div>

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

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Activity</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-600 uppercase">Registered On</p>
                              <p className="text-sm text-gray-900">{new Date(student.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase">Last Login</p>
                              <p className="text-sm text-gray-900">
                                {student.login_time ? new Date(student.login_time).toLocaleString() : "Never"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No students found</div>
          )}
        </div>

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
