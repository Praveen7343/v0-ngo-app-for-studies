"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

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
    // SSC/10th Class
    schoolName: "",
    board: "",
    sscYearOfPassing: "",
    sscPercentage: "",
    // Diploma
    collegeName: "",
    branch: "",
    diplomaYearOfStudying: "",
    pinNumber: "",
    diplomaPercentage: "",
    // B.Tech
    btechCollege: "",
    btechBranch: "",
    btechYearOfStudying: "",
    btechPin: "",
    btechPercentage: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate required fields
    if (!formData.fullName.trim() || !formData.mobileNumber.trim() || !formData.emailId.trim()) {
      alert("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Save registration data
    setTimeout(() => {
      const registrationData = {
        ...formData,
        registrationId: `PSS-${Date.now()}`,
        registrationDate: new Date(),
        trustId: Math.floor(10000000 + Math.random() * 90000000).toString(),
      }

      // Get existing registrations or create new array
      const existingRegistrations = JSON.parse(localStorage.getItem("pssRegistrations") || "[]")
      existingRegistrations.push(registrationData)
      localStorage.setItem("pssRegistrations", JSON.stringify(existingRegistrations))

      setSuccessMessage(
        `Registration successful! Your Trust ID is: ${registrationData.trustId}. Please save this for login.`,
      )
      setIsLoading(false)

      // Reset form
      setTimeout(() => {
        setFormData({
          fullName: "",
          fatherName: "",
          motherName: "",
          dateOfBirth: "",
          gender: "",
          mobileNumber: "",
          emailId: "",
          address: "",
          schoolName: "",
          board: "",
          sscYearOfPassing: "",
          sscPercentage: "",
          collegeName: "",
          branch: "",
          diplomaYearOfStudying: "",
          pinNumber: "",
          diplomaPercentage: "",
          btechCollege: "",
          btechBranch: "",
          btechYearOfStudying: "",
          btechPin: "",
          btechPercentage: "",
        })
        setCurrentStep(1)
        setSuccessMessage("")
      }, 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
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

      {/* Registration Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-md flex items-start gap-3">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Registration Successful!</p>
                <p className="text-sm mt-1">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Image
              src="/images/pss-logo.png"
              alt="PSS Logo"
              width={80}
              height={80}
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="font-playfair text-2xl font-bold text-foreground">Student Registration</h1>
            <p className="text-muted-foreground mt-2">Complete your profile to get started with PSS</p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-8 justify-center">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Full Name *</label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="e.g., Sunkari Praveen Kumar"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Father's Name</label>
                    <Input
                      type="text"
                      name="fatherName"
                      placeholder="e.g., Yadagiri"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Mother's Name</label>
                    <Input
                      type="text"
                      name="motherName"
                      placeholder="e.g., Nagamani"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Date of Birth</label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full border border-border rounded-md px-3 py-2"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Mobile Number *</label>
                  <Input
                    type="tel"
                    name="mobileNumber"
                    placeholder="e.g., 9876543210"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Email ID *</label>
                  <Input
                    type="email"
                    name="emailId"
                    placeholder="e.g., praveen@email.com"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-border rounded-md px-3 py-2"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Step 2: SSC & Diploma */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">SSC / 10th Class</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">School Name</label>
                      <Input
                        type="text"
                        name="schoolName"
                        placeholder="School name"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Board</label>
                        <Input
                          type="text"
                          name="board"
                          placeholder="e.g., AP Board"
                          value={formData.board}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Year of Passing</label>
                        <Input
                          type="number"
                          name="sscYearOfPassing"
                          placeholder="e.g., 2018"
                          value={formData.sscYearOfPassing}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Percentage/CGPA</label>
                      <Input
                        type="text"
                        name="sscPercentage"
                        placeholder="e.g., 85%"
                        value={formData.sscPercentage}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Diploma</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">College Name</label>
                      <Input
                        type="text"
                        name="collegeName"
                        placeholder="College name"
                        value={formData.collegeName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Branch</label>
                        <Input
                          type="text"
                          name="branch"
                          placeholder="e.g., Cyber Security"
                          value={formData.branch}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Year of Studying</label>
                        <Input
                          type="text"
                          name="diplomaYearOfStudying"
                          placeholder="e.g., Final Year"
                          value={formData.diplomaYearOfStudying}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">PIN Number</label>
                        <Input
                          type="text"
                          name="pinNumber"
                          placeholder="e.g., 23054-cps-050"
                          value={formData.pinNumber}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Percentage (Till Now)</label>
                        <Input
                          type="text"
                          name="diplomaPercentage"
                          placeholder="e.g., 80%"
                          value={formData.diplomaPercentage}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: B.Tech */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">B.Tech (Optional)</h2>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">College/University</label>
                  <Input
                    type="text"
                    name="btechCollege"
                    placeholder="College/University name"
                    value={formData.btechCollege}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Branch</label>
                    <Input
                      type="text"
                      name="btechBranch"
                      placeholder="Branch name"
                      value={formData.btechBranch}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Year of Studying</label>
                    <Input
                      type="text"
                      name="btechYearOfStudying"
                      placeholder="e.g., 2nd Year"
                      value={formData.btechYearOfStudying}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">PIN Number</label>
                    <Input
                      type="text"
                      name="btechPin"
                      placeholder="PIN Number"
                      value={formData.btechPin}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">CGPA/Percentage (Till Now)</label>
                    <Input
                      type="text"
                      name="btechPercentage"
                      placeholder="e.g., 7.5 CGPA"
                      value={formData.btechPercentage}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              {currentStep < 3 && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              )}
              {currentStep === 3 && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? "Registering..." : "Complete Registration"}
                </Button>
              )}
            </div>
          </form>

          {/* Footer Text */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Already registered?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
