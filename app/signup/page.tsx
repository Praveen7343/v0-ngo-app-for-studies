"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Camera, RefreshCcw, CheckCircle, Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [trustId, setTrustId] = useState("")

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    emailId: "",
    address: "",
    // SSC / 10th Class
    schoolName: "",
    board: "",
    sscYearOfPassing: "",
    sscPercentage: "",
    // Diploma
    diplomaCollegeName: "",
    diplomaBranch: "",
    diplomaYearOfStudying: "",
    diplomaPin: "",
    diplomaPercentage: "",
    // B.Tech
    btechCollegeName: "",
    btechBranch: "",
    btechYearOfStudying: "",
    btechPin: "",
    btechCgpaPercentage: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (!formData.fullName) {
        setError("Please enter your full name")
        return
      }
      if (!formData.dateOfBirth) {
        setError("Please enter your date of birth (required for Trust ID)")
        return
      }
      setError("")
      setStep(2)
      return
    }

    if (step === 2) {
      if (!formData.diplomaYearOfStudying) {
        setError("Please enter your diploma year of studying (required for Trust ID)")
        return
      }
      setError("")
      setStep(3)
      return
    }

    // Step 3: Final submission
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          mobileNumber: formData.mobileNumber,
          emailId: formData.emailId,
          address: formData.address,
          ssc: {
            schoolName: formData.schoolName,
            board: formData.board,
            yearOfPassing: formData.sscYearOfPassing,
            percentage: formData.sscPercentage,
          },
          diploma: {
            collegeName: formData.diplomaCollegeName,
            branch: formData.diplomaBranch,
            yearOfStudying: formData.diplomaYearOfStudying,
            pinNumber: formData.diplomaPin,
            percentage: formData.diplomaPercentage,
          },
          ...(formData.btechCollegeName && {
            btech: {
              collegeName: formData.btechCollegeName,
              branch: formData.btechBranch,
              yearOfStudying: formData.btechYearOfStudying,
              cgpaPercentage: formData.btechCgpaPercentage,
              pinNumber: formData.btechPin,
            },
          }),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Registration failed")
      }

      setTrustId(result.trustId)
      setShowSuccess(true)
    } catch (error: any) {
      console.error("[v0] Registration error:", error)
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }



  const handleRegister = () => {
    handleSubmit(new Event("submit"))
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <header className="bg-white shadow-sm border-b border-border">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
              <div>
                <span className="font-playfair font-bold text-lg text-primary block">PSS</span>
                <span className="text-xs text-muted-foreground">Social Welfare</span>
              </div>
            </Link>
          </nav>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-playfair text-2xl font-bold text-foreground mb-2">Registration Successful!</h1>
              <p className="text-muted-foreground mb-6">Welcome to PSS Trust</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Trust ID</p>
              <p className="font-mono text-3xl font-bold text-primary mb-2">{trustId}</p>
              <p className="text-xs text-muted-foreground">Please save this ID for future logins</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium text-foreground mb-2">Trust ID Format:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• First 2 digits: Year of joining ({trustId.slice(0, 2)})</li>
                <li>• Next 2 digits: Registration number ({trustId.slice(2, 4)})</li>
                <li>• Last 2 digits: Day of birth ({trustId.slice(4, 6)})</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 mb-1">Confirmation Sent!</p>
                  <p className="text-xs text-green-800">
                    You will receive a confirmation email and SMS shortly on your registered email and phone number. Please check your inbox and messages.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Next Step:</strong> Use your full name and Trust ID to access student services
              </p>
            </div>

            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-sm border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-playfair font-bold text-lg text-primary block">PSS</span>
              <span className="text-xs text-muted-foreground">Social Welfare</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Image
              src="/images/pss-logo.png"
              alt="PSS Logo"
              width={80}
              height={80}
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="font-playfair text-2xl font-bold text-foreground">PSS Sign Up</h1>
            <p className="text-muted-foreground mt-2">Register to Join Our Community</p>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div className={`flex-1 h-1 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            {step === 1 && "Personal Information"}
            {step === 2 && "Academic Details (SSC, Diploma & B.Tech)"}
            {step === 3 && "Review & Complete Registration"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Father's Name</label>
                    <Input
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Enter father's name"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Mother's Name</label>
                    <Input
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      placeholder="Enter mother's name"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full border-border"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Required for Trust ID generation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Mobile Number</label>
                    <Input
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Email ID</label>
                  <Input
                    name="emailId"
                    type="email"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-semibold text-lg text-foreground">SSC / 10th Class</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">School Name</label>
                    <Input
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder="Enter school name"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Board</label>
                    <Input
                      name="board"
                      value={formData.board}
                      onChange={handleInputChange}
                      placeholder="Enter board name"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Year of Passing</label>
                    <Input
                      name="sscYearOfPassing"
                      value={formData.sscYearOfPassing}
                      onChange={handleInputChange}
                      placeholder="Enter year"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Percentage/CGPA</label>
                    <Input
                      name="sscPercentage"
                      value={formData.sscPercentage}
                      onChange={handleInputChange}
                      placeholder="Enter percentage"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <hr className="my-6" />

                <h3 className="font-semibold text-lg text-foreground">Diploma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">College Name</label>
                    <Input
                      name="diplomaCollegeName"
                      value={formData.diplomaCollegeName}
                      onChange={handleInputChange}
                      placeholder="Enter college name"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Branch</label>
                    <Input
                      name="diplomaBranch"
                      value={formData.diplomaBranch}
                      onChange={handleInputChange}
                      placeholder="Enter branch"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Year of Joining Diploma <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="diplomaYearOfStudying"
                      value={formData.diplomaYearOfStudying}
                      onChange={handleInputChange}
                      placeholder="e.g., 2024"
                      className="w-full border-border"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Required for Trust ID generation</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">PIN Number</label>
                    <Input
                      name="diplomaPin"
                      value={formData.diplomaPin}
                      onChange={handleInputChange}
                      placeholder="Enter PIN number"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Percentage/CGPA</label>
                  <Input
                    name="diplomaPercentage"
                    value={formData.diplomaPercentage}
                    onChange={handleInputChange}
                    placeholder="Enter percentage (if available)"
                    className="w-full border-border"
                  />
                </div>

                <hr className="my-6" />

                <h3 className="font-semibold text-lg text-foreground">B.Tech (Optional)</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">B.Tech information is optional. Skip if not applicable.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">College Name</label>
                    <Input
                      name="btechCollegeName"
                      value={formData.btechCollegeName}
                      onChange={handleInputChange}
                      placeholder="Enter college name"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Branch</label>
                    <Input
                      name="btechBranch"
                      value={formData.btechBranch}
                      onChange={handleInputChange}
                      placeholder="Enter branch"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Year of Studying</label>
                    <Input
                      name="btechYearOfStudying"
                      value={formData.btechYearOfStudying}
                      onChange={handleInputChange}
                      placeholder="e.g., 2024"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">PIN Number</label>
                    <Input
                      name="btechPin"
                      value={formData.btechPin}
                      onChange={handleInputChange}
                      placeholder="Enter PIN number"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">CGPA/Percentage</label>
                  <Input
                    name="btechCgpaPercentage"
                    value={formData.btechCgpaPercentage}
                    onChange={handleInputChange}
                    placeholder="Enter CGPA or percentage (if available)"
                    className="w-full border-border"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
                  <h3 className="font-bold text-green-900 mb-2 text-lg">Ready to Complete Registration?</h3>
                  <p className="text-sm text-green-800">
                    Review your details and click the button below to complete your registration. Your Trust ID will be generated immediately.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-3">Registration Summary:</p>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ Full Name: <span className="font-semibold">{formData.fullName}</span></li>
                    <li>✓ Date of Birth: <span className="font-semibold">{formData.dateOfBirth}</span></li>
                    <li>✓ Email: <span className="font-semibold">{formData.emailId}</span></li>
                    <li>✓ Mobile: <span className="font-semibold">{formData.mobileNumber}</span></li>
                    <li>✓ Diploma Year: <span className="font-semibold">{formData.diplomaYearOfStudying}</span></li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-xl text-lg font-medium border-2"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className={`flex-1 h-12 text-lg font-bold shadow-lg rounded-xl transition-all ${
                  step === 3 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : step === 1 ? (
                  "Continue to Education Details"
                ) : step === 2 ? (
                  "Review & Complete Registration"
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
