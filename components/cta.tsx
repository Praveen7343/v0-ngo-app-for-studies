"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CTA() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    address: "",
    sscSchool: "",
    sscBoard: "",
    sscYear: "",
    sscPercentage: "",
    diplomaCollege: "",
    diplomaBranch: "",
    diplomaYear: "",
    diplomaPin: "",
    diplomaPercentage: "",
    bTechCollege: "",
    bTechBranch: "",
    bTechYear: "",
    bTechPin: "",
    bTechPercentage: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateTrustId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (currentStep === 3) {
      const trustId = generateTrustId()
      const studentData = {
        ...formData,
        trustId,
      }

      const existingStudents = JSON.parse(localStorage.getItem("registeredStudents") || "[]")
      existingStudents.push(studentData)
      localStorage.setItem("registeredStudents", JSON.stringify(existingStudents))

      alert(`Registration successful! Your Trust ID is: ${trustId}. Please use this to login.`)
      setFormData({
        fullName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        gender: "",
        mobile: "",
        email: "",
        address: "",
        sscSchool: "",
        sscBoard: "",
        sscYear: "",
        sscPercentage: "",
        diplomaCollege: "",
        diplomaBranch: "",
        diplomaYear: "",
        diplomaPin: "",
        diplomaPercentage: "",
        bTechCollege: "",
        bTechBranch: "",
        bTechYear: "",
        bTechPin: "",
        bTechPercentage: "",
      })
      setCurrentStep(1)
      router.push("/login")
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-background to-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">Join Us Today</h2>
          <p className="text-lg text-foreground/70">
            Complete your registration to join thousands of students transforming their future through education
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  step <= currentStep ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {step}
              </div>
              <p className="text-sm text-foreground/60">
                {step === 1 ? "Personal" : step === 2 ? "Academic" : "B.Tech"}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's Name"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="motherName"
                  placeholder="Mother's Name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />

              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Step 2: SSC and Diploma Academic Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary mb-6">Academic Details (Year-Wise)</h3>

              <div>
                <h4 className="font-semibold text-foreground mb-4 border-b pb-2">SSC / 10th Class</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="sscSchool"
                    placeholder="School Name"
                    value={formData.sscSchool}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="sscBoard"
                    placeholder="Board"
                    value={formData.sscBoard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    name="sscYear"
                    placeholder="Year of Passing"
                    value={formData.sscYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="sscPercentage"
                    placeholder="Percentage/CGPA"
                    value={formData.sscPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 border-b pb-2">Diploma</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="diplomaCollege"
                    placeholder="College Name"
                    value={formData.diplomaCollege}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="diplomaBranch"
                    placeholder="Branch"
                    value={formData.diplomaBranch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    name="diplomaYear"
                    placeholder="Year of Studying"
                    value={formData.diplomaYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="diplomaPin"
                    placeholder="PIN Number"
                    value={formData.diplomaPin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <input
                  type="text"
                  name="diplomaPercentage"
                  placeholder="Percentage (Till Now)"
                  value={formData.diplomaPercentage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mt-4"
                />
              </div>
            </div>
          )}

          {/* Step 3: B.Tech Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary mb-6">B.Tech Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="bTechCollege"
                  placeholder="College/University"
                  value={formData.bTechCollege}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  name="bTechBranch"
                  placeholder="Branch"
                  value={formData.bTechBranch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="bTechYear"
                  placeholder="Year of Studying"
                  value={formData.bTechYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  name="bTechPin"
                  placeholder="PIN Number"
                  value={formData.bTechPin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <input
                type="text"
                name="bTechPercentage"
                placeholder="CGPA/Percentage (Till Now)"
                value={formData.bTechPercentage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />

              <p className="text-sm text-foreground/60 bg-blue-50 p-4 rounded-lg">
                Review all your information before submitting. Once registered, you'll receive a unique Trust ID for
                login.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-6">
            {currentStep > 1 && (
              <Button type="button" onClick={handlePrevious} variant="outline" className="flex-1 bg-transparent">
                Previous
              </Button>
            )}
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {currentStep === 3 ? "Complete Registration" : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
