"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Search, ArrowLeft, CheckCircle, AlertCircle, Upload, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function FeeApplicationPage() {
  const [step, setStep] = useState<"search" | "apply" | "voucher" | "success">("search")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [studentData, setStudentData] = useState<any>(null)
  const [searchForm, setSearchForm] = useState({ name: "", trustId: "" })
  const [letterImage, setLetterImage] = useState<File | null>(null)
  const [letterImagePreview, setLetterImagePreview] = useState<string | null>(null)

  // Form data matching the Student Request Form
  const [formData, setFormData] = useState({
    trustBranch: "",
    date: new Date().toLocaleDateString("en-IN"),
    requestingFor: "",
    requestType: {
      semFee: false,
      provisions: false,
      others: false,
    },
    pinNo: "",
    collegeName: "",
    phoneNo: "",
    trustAttendance: "",
    collegeAttendance: "",
    academicYear: "",
    ceepRank: "",
    ecetRank: "",
    semesters: [
      { sem: "Sem I/I", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
      { sem: "Sem II/I", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
      { sem: "Sem I/II", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
      { sem: "Sem II/II", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
      { sem: "Sem I/III", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
      { sem: "Sem II/III", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
      { sem: "Sem I/IV", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
      { sem: "Sem II/IV", gpa1: "", backlogs1: "", gpa2: "", backlogs2: "" },
    ],
    email: "",
    contribution: "",
  })

  const [voucherData, setVoucherData] = useState({
    voucherNo: "",
    voucherDate: new Date().toLocaleDateString("en-IN"),
    paidTo: "",
    sumOfRupees: "",
    paymentMethod: "",
    bank: "",
    paymentDate: "",
    being: "",
    phoneNo: "",
    amount: "",
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/student/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: searchForm.name,
          trustId: searchForm.trustId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Student not found")
      }

      setStudentData(data.student)
      setFormData((prev) => ({
        ...prev,
        phoneNo: data.student.phone || "",
        email: data.student.email || "",
        collegeName: data.student.college_name || "",
      }))
      setVoucherData((prev) => ({
        ...prev,
        paidTo: data.student.name || "",
        phoneNo: data.student.phone || "",
      }))
      setStep("apply")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSemesterChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newSemesters = [...prev.semesters]
      newSemesters[index] = { ...newSemesters[index], [field]: value }
      return { ...prev, semesters: newSemesters }
    })
  }

  const handleLetterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLetterImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLetterImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContinueToVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("voucher")
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/student/fee-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentData.id,
          trustId: studentData.trust_id,
          formData: formData,
          voucherData: voucherData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application")
      }

      setStep("success")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "search" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}
            >
              1
            </div>
            <span className="text-sm hidden sm:inline">Verify</span>
          </div>
          <div className="w-8 h-0.5 bg-primary/20 mx-2"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "apply" ? "bg-primary text-primary-foreground" : step === "voucher" || step === "success" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <span className="text-sm hidden sm:inline">Request Form</span>
          </div>
          <div className="w-8 h-0.5 bg-primary/20 mx-2"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "voucher" ? "bg-primary text-primary-foreground" : step === "success" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
            <span className="text-sm hidden sm:inline">Payment Voucher</span>
          </div>
          <div className="w-8 h-0.5 bg-primary/20 mx-2"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "success" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              4
            </div>
            <span className="text-sm hidden sm:inline">Done</span>
          </div>
        </div>

        {step === "search" && (
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary">Student Request Form</h1>
                <p className="text-muted-foreground">Enter your details to access the fee application form</p>
              </div>
              <form onSubmit={handleSearch} className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={searchForm.name}
                    onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trustId">Trust ID</Label>
                  <Input
                    id="trustId"
                    placeholder="Enter your Trust ID (e.g., 242113)"
                    value={searchForm.trustId}
                    onChange={(e) => setSearchForm({ ...searchForm, trustId: e.target.value })}
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Verifying..."
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Verify & Continue
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "apply" && studentData && (
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6 md:p-8">
              {/* Request Form Header with Trust Logo */}
              <div className="flex items-center justify-center gap-4 mb-6 pb-4 border-b-2 border-primary">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/pss-logo.png"
                    alt="PSS Trust Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-primary">Student Request Form</h2>
                  <p className="text-xs text-muted-foreground">
                    Potukuchi Somasundara Social Welfare & Charitable Trust
                  </p>
                </div>
              </div>

              <form onSubmit={handleContinueToVoucher} className="space-y-6">
                {/* Row 1: Trust Branch, Trust ID, Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="trustBranch" className="text-sm font-medium">
                      Trust Branch:
                    </Label>
                    <Input
                      id="trustBranch"
                      value={formData.trustBranch}
                      onChange={(e) => setFormData({ ...formData, trustBranch: e.target.value })}
                      placeholder="e.g., BHEL"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Trust Id:</Label>
                    <Input value={studentData.trust_id} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Date:</Label>
                    <Input value={formData.date} disabled className="bg-muted" />
                  </div>
                </div>

                {/* Row 2: Requesting For and Request Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1">
                    <Label htmlFor="requestingFor" className="text-sm font-medium">
                      Requesting for:
                    </Label>
                    <Input
                      id="requestingFor"
                      value={formData.requestingFor}
                      onChange={(e) => setFormData({ ...formData, requestingFor: e.target.value })}
                      placeholder="e.g., Fifth Sem"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="semFee"
                        checked={formData.requestType.semFee}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            requestType: { ...formData.requestType, semFee: checked as boolean },
                          })
                        }
                      />
                      <Label htmlFor="semFee" className="text-sm">
                        Sem Fee
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="provisions"
                        checked={formData.requestType.provisions}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            requestType: { ...formData.requestType, provisions: checked as boolean },
                          })
                        }
                      />
                      <Label htmlFor="provisions" className="text-sm">
                        Provisions
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="others"
                        checked={formData.requestType.others}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            requestType: { ...formData.requestType, others: checked as boolean },
                          })
                        }
                      />
                      <Label htmlFor="others" className="text-sm">
                        Others
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Row 3: Student Name and Pin No */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Student Full Name:</Label>
                    <Input value={studentData.name} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pinNo" className="text-sm font-medium">
                      Pin No:
                    </Label>
                    <Input
                      id="pinNo"
                      value={formData.pinNo}
                      onChange={(e) => setFormData({ ...formData, pinNo: e.target.value })}
                      placeholder="e.g., 23054-CPS-050"
                      required
                    />
                  </div>
                </div>

                {/* Row 4: College Name and Phone No */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="collegeName" className="text-sm font-medium">
                      College Name:
                    </Label>
                    <Input
                      id="collegeName"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      placeholder="Enter college name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phoneNo" className="text-sm font-medium">
                      Phone No:
                    </Label>
                    <Input
                      id="phoneNo"
                      value={formData.phoneNo}
                      onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                {/* Row 5: Attendance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="trustAttendance" className="text-sm font-medium">
                      Trust Attendance %:
                    </Label>
                    <Input
                      id="trustAttendance"
                      value={formData.trustAttendance}
                      onChange={(e) => setFormData({ ...formData, trustAttendance: e.target.value })}
                      placeholder="e.g., 92.7"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="collegeAttendance" className="text-sm font-medium">
                      College Attendance %:
                    </Label>
                    <Input
                      id="collegeAttendance"
                      value={formData.collegeAttendance}
                      onChange={(e) => setFormData({ ...formData, collegeAttendance: e.target.value })}
                      placeholder="Enter college attendance %"
                      required
                    />
                  </div>
                </div>

                {/* Row 6: Academic Year, CEEP Rank, ECET Rank */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="academicYear" className="text-sm font-medium">
                      A.Y:
                    </Label>
                    <Input
                      id="academicYear"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      placeholder="e.g., 23-24"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ceepRank" className="text-sm font-medium">
                      CEEP Rank:
                    </Label>
                    <Input
                      id="ceepRank"
                      value={formData.ceepRank}
                      onChange={(e) => setFormData({ ...formData, ceepRank: e.target.value })}
                      placeholder="e.g., 60000"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ecetRank" className="text-sm font-medium">
                      ECET Rank:
                    </Label>
                    <Input
                      id="ecetRank"
                      value={formData.ecetRank}
                      onChange={(e) => setFormData({ ...formData, ecetRank: e.target.value })}
                      placeholder="Enter ECET rank"
                    />
                  </div>
                </div>

                {/* Semester Table */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Semester-wise Academic Performance:</Label>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-primary/10">
                        <tr>
                          <th className="border-r p-2 text-left font-medium">Sem/Year</th>
                          <th className="border-r p-2 text-center font-medium">GPA/CGPA</th>
                          <th className="border-r p-2 text-center font-medium">No. Bklogs</th>
                          <th className="border-r p-2 text-center font-medium">GPA/CGPA</th>
                          <th className="p-2 text-center font-medium">No. Bklogs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.semesters.map((semester, index) => (
                          <tr key={index} className="border-t">
                            <td className="border-r p-2 font-medium bg-muted/50">{semester.sem}</td>
                            <td className="border-r p-1">
                              <Input
                                value={semester.gpa1}
                                onChange={(e) => handleSemesterChange(index, "gpa1", e.target.value)}
                                className="h-8 text-center"
                                placeholder="-"
                              />
                            </td>
                            <td className="border-r p-1">
                              <Input
                                value={semester.backlogs1}
                                onChange={(e) => handleSemesterChange(index, "backlogs1", e.target.value)}
                                className="h-8 text-center"
                                placeholder="-"
                              />
                            </td>
                            <td className="border-r p-1">
                              <Input
                                value={semester.gpa2}
                                onChange={(e) => handleSemesterChange(index, "gpa2", e.target.value)}
                                className="h-8 text-center"
                                placeholder="-"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={semester.backlogs2}
                                onChange={(e) => handleSemesterChange(index, "backlogs2", e.target.value)}
                                className="h-8 text-center"
                                placeholder="-"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Contribution */}
                <div className="space-y-1">
                  <Label htmlFor="contribution" className="text-sm font-medium">
                    Your contribution towards Trust:
                  </Label>
                  <Textarea
                    id="contribution"
                    value={formData.contribution}
                    onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                    placeholder="Describe your contribution to the trust..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Upload Letter (Optional):</Label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLetterImageChange}
                      className="hidden"
                      id="letterImage"
                    />
                    <label htmlFor="letterImage" className="cursor-pointer">
                      {letterImagePreview ? (
                        <div className="space-y-2">
                          <img
                            src={letterImagePreview || "/placeholder.svg"}
                            alt="Letter preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <p className="text-sm text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-10 h-10 mx-auto text-primary/50" />
                          <p className="text-sm text-muted-foreground">Click to upload a letter image</p>
                          <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Continue to Payment Voucher
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "voucher" && studentData && (
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6 md:p-8">
              {/* Payment Voucher Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-primary">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/pss-logo.png"
                    alt="PSS Trust Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">POTUKUCHI SOMASUNDARA</h2>
                  <p className="text-sm font-semibold text-gray-700">SOCIAL WELFARE AND CHARITABLE TRUST</p>
                  <p className="text-xs text-muted-foreground">
                    Office # 2530/79, Near Water Tank, Matrusreenagar, Miyapur, Hyderabad-500049
                  </p>
                  <p className="text-xs text-muted-foreground">
                    E-mail: chairman@psstrust.org Ph: 040-42414207 Cell: 9246106332, 9346206332
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-center mb-6 underline">PAYMENT VOUCHER</h2>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                {/* Voucher No and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium whitespace-nowrap">Voucher No.</Label>
                    <Input
                      value={voucherData.voucherNo}
                      onChange={(e) => setVoucherData({ ...voucherData, voucherNo: e.target.value })}
                      className="flex-1"
                      placeholder="Enter voucher number"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium whitespace-nowrap">Date:</Label>
                    <Input value={voucherData.voucherDate} disabled className="flex-1 bg-muted" />
                  </div>
                </div>

                {/* Paid to */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">Paid to</Label>
                  <Input
                    value={voucherData.paidTo}
                    disabled
                    className="flex-1 bg-muted border-b-2 border-t-0 border-x-0 rounded-none"
                  />
                </div>

                {/* Sum of Rupees */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">Sum of Rupees</Label>
                  <Input
                    value={voucherData.sumOfRupees}
                    onChange={(e) => setVoucherData({ ...voucherData, sumOfRupees: e.target.value })}
                    className="flex-1"
                    placeholder="e.g., Six hundred fifty rupees only"
                    required
                  />
                </div>

                {/* Payment Method, Bank, Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium whitespace-nowrap text-xs">
                      By Cash/Online/Cheque/D.D. No.
                    </Label>
                    <Input
                      value={voucherData.paymentMethod}
                      onChange={(e) => setVoucherData({ ...voucherData, paymentMethod: e.target.value })}
                      className="flex-1"
                      placeholder="e.g., Online"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium whitespace-nowrap">Bank</Label>
                    <Input
                      value={voucherData.bank}
                      onChange={(e) => setVoucherData({ ...voucherData, bank: e.target.value })}
                      className="flex-1"
                      placeholder="Bank name"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium whitespace-nowrap">Date</Label>
                    <Input
                      type="date"
                      value={voucherData.paymentDate}
                      onChange={(e) => setVoucherData({ ...voucherData, paymentDate: e.target.value })}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>

                {/* Being (Purpose) */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">Being</Label>
                  <Input
                    value={voucherData.being}
                    onChange={(e) => setVoucherData({ ...voucherData, being: e.target.value })}
                    className="flex-1"
                    placeholder="e.g., 5th semester examination fees"
                    required
                  />
                </div>

                {/* Phone No */}
                <div className="flex items-center gap-2 justify-end">
                  <Label className="text-sm font-medium whitespace-nowrap">Ph No.</Label>
                  <Input
                    value={voucherData.phoneNo}
                    onChange={(e) => setVoucherData({ ...voucherData, phoneNo: e.target.value })}
                    className="w-48"
                    placeholder="Phone number"
                    required
                  />
                </div>

                {/* Amount Box */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="border-2 border-foreground/80 px-4 py-2 rounded">
                    <span className="font-bold">Rs.</span>
                    <Input
                      value={voucherData.amount}
                      onChange={(e) => setVoucherData({ ...voucherData, amount: e.target.value })}
                      className="inline-block w-24 border-0 p-0 h-auto font-bold text-lg"
                      placeholder="650/-"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep("apply")} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Request Form
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-primary mb-2">Application Submitted!</h1>
              <p className="text-muted-foreground mb-6">
                Your fee application has been successfully submitted. You will be notified once it is reviewed.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mb-6 max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Trust ID:</span>
                  <span className="font-medium">{studentData?.trust_id}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Student Name:</span>
                  <span className="font-medium">{studentData?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                    <Clock className="w-4 h-4" />
                    Pending Review
                  </span>
                </div>
              </div>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
