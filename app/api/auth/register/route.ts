import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    const trustId = data.trustId

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
