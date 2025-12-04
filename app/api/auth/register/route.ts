import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

async function generateTrustId(supabase: any, yearOfJoining: string, dateOfBirth: string): Promise<string> {
  // Get last 2 digits of joining year (e.g., 2024 -> 24)
  const yearPart = yearOfJoining.slice(-2)

  // Get the day from date of birth (e.g., 2007-04-13 -> 13)
  const dobDate = new Date(dateOfBirth)
  const dayPart = dobDate.getDate().toString().padStart(2, "0")

  // Get the count of students who joined in the same year to determine registration number
  const { count, error } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .ilike("trust_id", `${yearPart}%`)

  if (error) {
    console.error("[v0] Error counting students:", error)
  }

  // Registration number is count + 1, padded to 2 digits
  const registrationNumber = ((count || 0) + 1).toString().padStart(2, "0")

  // Final Trust ID format: YY + RR + DD (e.g., 242113)
  const trustId = `${yearPart}${registrationNumber}${dayPart}`

  return trustId
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    // Use diploma year of studying as joining year, fallback to current year
    const joiningYear = data.diploma?.yearOfStudying || new Date().getFullYear().toString()
    const dateOfBirth = data.dateOfBirth

    if (!dateOfBirth) {
      return NextResponse.json({ success: false, error: "Date of birth is required" }, { status: 400 })
    }

    const trustId = await generateTrustId(supabase, joiningYear, dateOfBirth)

    const { data: student, error: studentError } = await supabase
      .from("students")
      .insert({
        trust_id: trustId,
        student_name: data.fullName,
        father_name: data.fatherName,
        mother_name: data.motherName,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        mobile_number: data.mobileNumber,
        email_id: data.emailId,
        address: data.address,
      })
      .select()
      .single()

    if (studentError) throw studentError

    const academicData = []

    if (data.ssc) {
      academicData.push({
        student_id: student.id,
        level: "ssc",
        school_or_college_name: data.ssc.schoolName,
        board_or_branch: data.ssc.board,
        year_of_passing_or_studying: data.ssc.yearOfPassing,
        percentage_or_cgpa: data.ssc.percentage,
      })
    }

    if (data.diploma) {
      academicData.push({
        student_id: student.id,
        level: "diploma",
        school_or_college_name: data.diploma.collegeName,
        board_or_branch: data.diploma.branch,
        year_of_passing_or_studying: data.diploma.yearOfStudying,
        percentage_or_cgpa: data.diploma.percentage,
        pin_number: data.diploma.pinNumber,
      })
    }

    if (data.btech) {
      academicData.push({
        student_id: student.id,
        level: "btech",
        school_or_college_name: data.btech.collegeName,
        board_or_branch: data.btech.branch,
        year_of_passing_or_studying: data.btech.yearOfStudying,
        percentage_or_cgpa: data.btech.cgpaPercentage,
        pin_number: data.btech.pinNumber,
      })
    }

    if (academicData.length > 0) {
      const { error: academicError } = await supabase.from("academic_details").insert(academicData)

      if (academicError) throw academicError
    }

    return NextResponse.json({ success: true, trustId: student.trust_id, studentId: student.id }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
