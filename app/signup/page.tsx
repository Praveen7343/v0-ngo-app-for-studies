"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

    // Validate form data
    if (!formData.fullName) {
      alert("Please enter your full name")
      return
    }

    try {
      const generatedTrustId = Math.random().toString().slice(2, 10).padEnd(8, "0")
      setTrustId(generatedTrustId)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          trustId: generatedTrustId,
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

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      // Also save to localStorage for backward compatibility
      const registrations = JSON.parse(localStorage.getItem("pssRegistrations") || "[]")
      registrations.push({
        fullName: formData.fullName,
        trustId: generatedTrustId,
        personal: {
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          mobileNumber: formData.mobileNumber,
          emailId: formData.emailId,
          address: formData.address,
        },
        ssc:
          formData.schoolName || formData.board
            ? {
                schoolName: formData.schoolName,
                board: formData.board,
                yearOfPassing: formData.sscYearOfPassing,
                percentage: formData.sscPercentage,
              }
            : null,
        diploma:
          formData.diplomaCollegeName || formData.diplomaBranch
            ? {
                collegeName: formData.diplomaCollegeName,
                branch: formData.diplomaBranch,
                yearOfStudying: formData.diplomaYearOfStudying,
                pin: formData.diplomaPin,
                percentage: formData.diplomaPercentage,
              }
            : null,
        btech:
          formData.btechCollegeName || formData.btechBranch
            ? {
                collegeName: formData.btechCollegeName,
                branch: formData.btechBranch,
                yearOfStudying: formData.btechYearOfStudying,
                percentage: formData.btechCgpaPercentage,
                pin: formData.btechPin,
              }
            : null,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("pssRegistrations", JSON.stringify(registrations))

      setStep(4)
    } catch (error) {
      console.error("[v0] Registration error:", error)
      alert("Registration failed. Please try again.")
    }
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Next Step:</strong> Use your full name and Trust ID to login
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
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
            {step === 2 && "Academic Details (SSC & Diploma)"}
            {step === 3 && "B.Tech Information"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full border-border"
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
                    <label className="block text-sm font-medium text-foreground">Date of Birth</label>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full border-border"
                    />
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
                    <label className="block text-sm font-medium text-foreground">Year of Studying</label>
                    <Input
                      name="diplomaYearOfStudying"
                      value={formData.diplomaYearOfStudying}
                      onChange={handleInputChange}
                      placeholder="Enter year"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">PIN Number</label>
                    <Input
                      name="diplomaPin"
                      value={formData.diplomaPin}
                      onChange={handleInputChange}
                      placeholder="Enter PIN"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Percentage (Till Now)</label>
                  <Input
                    name="diplomaPercentage"
                    value={formData.diplomaPercentage}
                    onChange={handleInputChange}
                    placeholder="Enter percentage"
                    className="w-full border-border"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-semibold text-lg text-foreground">B.Tech (Optional)</h3>
                <p className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  If you haven't started B.Tech yet, you can leave this section empty and continue.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">College/University</label>
                    <Input
                      name="btechCollegeName"
                      value={formData.btechCollegeName}
                      onChange={handleInputChange}
                      placeholder="Enter college name (optional)"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Branch</label>
                    <Input
                      name="btechBranch"
                      value={formData.btechBranch}
                      onChange={handleInputChange}
                      placeholder="Enter branch (optional)"
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
                      placeholder="Enter year (optional)"
                      className="w-full border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">PIN Number</label>
                    <Input
                      name="btechPin"
                      value={formData.btechPin}
                      onChange={handleInputChange}
                      placeholder="Enter PIN (optional)"
                      className="w-full border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">CGPA/Percentage (Till Now)</label>
                  <Input
                    name="btechCgpaPercentage"
                    value={formData.btechCgpaPercentage}
                    onChange={handleInputChange}
                    placeholder="Enter CGPA or percentage (optional)"
                    className="w-full border-border"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <h1 className="font-playfair text-2xl font-bold text-foreground mb-2">Registration Complete!</h1>
                <p className="text-muted-foreground mb-6">Thank you for registering with PSS Trust.</p>
                <Link href="/login">
                  <Button className="w-full">Go to Login</Button>
                </Link>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep(step - 1)
                    setError("")
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Processing..." : step === 4 ? "Login" : "Next"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
