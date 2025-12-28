"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Search, ChevronDown, ChevronUp, CheckCircle, Clock, FileText, X, Send, User } from "lucide-react"

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
  face_photo?: string | null
}

interface FeeApplication {
  id: string
  student_id: string
  trust_id: string
  fee_type: string
  reason: string
  amount: number
  status: string
  form_data: any
  voucher_data: any
  created_at: string
  student_name?: string
  mobile_number?: string
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
  const [activeTab, setActiveTab] = useState<"students" | "applications">("students")
  const [applications, setApplications] = useState<FeeApplication[]>([])
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null)
  const [messageModal, setMessageModal] = useState<{ show: boolean; application: FeeApplication | null }>({
    show: false,
    application: null,
  })
  const [acceptMessage, setAcceptMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    const chairmanData = localStorage.getItem("pssChairman")
    if (!chairmanData) {
      router.push("/chairman-login")
      return
    }

    setChairman(JSON.parse(chairmanData))

    const fetchData = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const { data: studentData, error: studentsError } = await supabase.from("students").select("*, face_photo")
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
          face_photo: student.face_photo,
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

        const { data: appData, error: appError } = await supabase
          .from("fee_applications")
          .select("*")
          .order("created_at", { ascending: false })

        if (appError) throw appError

        const appsWithNames = appData.map((app: any) => {
          const student = formattedStudents.find((s: any) => s.trust_id === app.trust_id)
          return {
            ...app,
            student_name: student?.student_name || app.form_data?.studentName || "Unknown",
            mobile_number: student?.mobile_number || app.voucher_data?.phoneNo || "-",
          }
        })

        setApplications(appsWithNames)
      } catch (error) {
        console.error("Error fetching data:", error)
        setStudents([])
        setApplications([])
      }
      setIsLoading(false)
    }

    fetchData()
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

  const sortedGroupKeys = useMemo(() => Object.keys(groupedStudents).sort(), [groupedStudents])

  const stats = useMemo(() => {
    const total = students.length
    const loggedIn = students.filter((s) => s.has_logged_in).length
    const pendingApps = applications.filter((a) => a.status === "pending").length
    const acceptedApps = applications.filter((a) => a.status === "accepted").length
    return { total, loggedIn, notLoggedIn: total - loggedIn, pendingApps, acceptedApps, totalApps: applications.length }
  }, [students, applications])

  const handleAcceptApplication = (application: FeeApplication) => {
    setMessageModal({ show: true, application })
  }

  const sendAcceptanceMessage = async () => {
    if (!messageModal.application) return
    setSendingMessage(true)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error } = await supabase
        .from("fee_applications")
        .update({
          status: "accepted",
          chairman_notes: acceptMessage,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", messageModal.application.id)

      if (error) throw error

      setApplications((prev) =>
        prev.map((app) =>
          app.id === messageModal.application?.id ? { ...app, status: "accepted", chairman_notes: acceptMessage } : app,
        ),
      )

      alert(
        `Application accepted! Message will be sent to ${messageModal.application.student_name} at ${messageModal.application.mobile_number}:\n\n${acceptMessage}`,
      )
      setMessageModal({ show: false, application: null })
      setAcceptMessage("")
    } catch (error) {
      console.error("Error accepting application:", error)
      alert("Error accepting application. Please try again.")
    }
    setSendingMessage(false)
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="rounded-full" />
              <div>
                <h1 className="font-bold text-lg text-primary">PSS Admin Dashboard</h1>
                <p className="text-xs text-gray-600">Chairman: {chairman?.fullName}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">{stats.total}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="font-semibold text-gray-900">Registered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Logged In</p>
                <p className="font-semibold text-green-600">{stats.loggedIn} Students</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("applications")}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="font-semibold text-orange-600">{stats.pendingApps} Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="font-semibold text-emerald-600">{stats.acceptedApps} Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("students")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === "students"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Students ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors relative ${
                activeTab === "applications"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Number of Applications ({stats.totalApps})
              {stats.pendingApps > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingApps}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Students Tab Content */}
        {activeTab === "students" && (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Search by name, Trust ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
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

            <div className="space-y-6">
              {sortedGroupKeys.length > 0 ? (
                sortedGroupKeys.map((group) => (
                  <div key={group} className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">{group}</h2>
                    {groupedStudents[group].map((student) => (
                      <div
                        key={student.id}
                        className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
                      >
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                          <div className="relative flex-shrink-0">
                            <div className="w-24 h-32 rounded-lg bg-gray-100 overflow-hidden ring-2 ring-gray-100 shadow-sm transition-transform group-hover:scale-[1.02]">
                              {student.face_photo ? (
                                <img
                                  src={student.face_photo || "/placeholder.svg"}
                                  alt={student.student_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                  <User className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            {student.face_photo && (
                              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{student.student_name}</h3>
                              {student.has_logged_in ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <CheckCircle className="w-3 h-3" /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                  <Clock className="w-3 h-3" /> Not logged in
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">Trust ID: {student.trust_id}</p>
                          </div>
                        </div>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                          onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                        >
                          {expandedStudent === student.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    ))}
                    {expandedStudent &&
                      groupedStudents[expandedStudent].map((student) => (
                        <div key={student.id} className="border-t border-gray-200 bg-gray-50 p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Father:</span> {student.father_name}
                            </div>
                            <div>
                              <span className="text-gray-500">Mother:</span> {student.mother_name}
                            </div>
                            <div>
                              <span className="text-gray-500">DOB:</span> {student.date_of_birth}
                            </div>
                            <div>
                              <span className="text-gray-500">Gender:</span> {student.gender}
                            </div>
                            <div>
                              <span className="text-gray-500">Mobile:</span> {student.mobile_number}
                            </div>
                            <div>
                              <span className="text-gray-500">Email:</span> {student.email_id}
                            </div>
                          </div>
                          {student.face_photo && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-3">Registration Photo</h4>
                              <img
                                src={student.face_photo || "/placeholder.svg"}
                                alt="Student Registration"
                                className="w-48 h-48 object-cover rounded-lg border shadow-sm"
                              />
                            </div>
                          )}
                          {student.academic_details.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Academic Details</h4>
                              {student.academic_details.map((detail, idx) => (
                                <div key={idx} className="bg-white p-3 rounded border mb-2">
                                  <p className="font-medium text-primary">{detail.level}</p>
                                  <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                                    <div>
                                      <span className="text-gray-500">School:</span> {detail.schoolName}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Board/Branch:</span> {detail.boardBranch}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Year:</span> {detail.yearOfStudying}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Percentage:</span> {detail.percentage}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No students found</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Applications Tab Content */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedApplication(expandedApplication === app.id ? null : app.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{app.student_name}</h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : app.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Trust ID: {app.trust_id}</p>
                        <p className="text-sm text-gray-600">
                          Amount: Rs. {app.voucher_data?.amount || app.amount || "-"} | Type: {app.fee_type}
                        </p>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {app.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAcceptApplication(app)
                            }}
                          >
                            Accept
                          </Button>
                        )}
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={() => setExpandedApplication(expandedApplication === app.id ? null : app.id)}
                        >
                          {expandedApplication === app.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedApplication === app.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      {app.form_data && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Request Form Details</h4>
                          <div className="bg-white p-3 rounded border text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-gray-500">Branch:</span> {app.form_data.trustBranch || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">College:</span> {app.form_data.collegeName || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">Phone:</span> {app.form_data.phoneNo || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">Trust Attendance:</span>{" "}
                                {app.form_data.trustAttendance || "-"}%
                              </div>
                              <div>
                                <span className="text-gray-500">College Attendance:</span>{" "}
                                {app.form_data.collegeAttendance || "-"}%
                              </div>
                              <div>
                                <span className="text-gray-500">Email:</span> {app.form_data.email || "-"}
                              </div>
                            </div>
                            {app.form_data.contribution && (
                              <div className="mt-2">
                                <span className="text-gray-500">Contribution:</span>
                                <p className="mt-1">{app.form_data.contribution}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {app.voucher_data && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Payment Voucher Details</h4>
                          <div className="bg-white p-3 rounded border text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-gray-500">Voucher No:</span> {app.voucher_data.voucherNo || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">Amount:</span> Rs. {app.voucher_data.amount || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">Payment Method:</span>{" "}
                                {app.voucher_data.paymentMethod || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">Bank:</span> {app.voucher_data.bank || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">Purpose:</span> {app.voucher_data.being || "-"}
                              </div>
                              <div>
                                <span className="text-gray-500">Phone:</span> {app.voucher_data.phoneNo || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No applications yet</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Accept Message Modal */}
      {messageModal.show && messageModal.application && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Accept Application</h3>
              <button
                onClick={() => setMessageModal({ show: false, application: null })}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Send acceptance message to <strong>{messageModal.application.student_name}</strong> (
              {messageModal.application.mobile_number})
            </p>
            <Textarea
              placeholder="Enter message to send to student..."
              value={acceptMessage}
              onChange={(e) => setAcceptMessage(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setMessageModal({ show: false, application: null })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={sendAcceptanceMessage}
                disabled={sendingMessage || !acceptMessage.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sendingMessage ? "Sending..." : "Accept & Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
