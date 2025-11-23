import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { studentName, trustId } = await request.json()

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("trust_id", trustId)
      .eq("student_name", studentName)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    const { data: academicDetails, error: academicError } = await supabase
      .from("academic_details")
      .select("*")
      .eq("student_id", student.id)

    if (academicError) throw academicError

    const { error: updateError } = await supabase
      .from("students")
      .update({ login_time: new Date().toISOString() })
      .eq("id", student.id)

    if (updateError) throw updateError

    const responseData = {
      studentName: student.student_name,
      trustId: student.trust_id,
      loginTime: new Date().toISOString(),
      fatherName: student.father_name,
      motherName: student.mother_name,
      dateOfBirth: student.date_of_birth,
      gender: student.gender,
      mobileNumber: student.mobile_number,
      emailId: student.email_id,
      address: student.address,
      ssc: null as any,
      diploma: null as any,
    }

    academicDetails?.forEach((detail) => {
      if (detail.level === "ssc") {
        responseData.ssc = {
          schoolName: detail.school_or_college_name,
          board: detail.board_or_branch,
          yearOfPassing: detail.year_of_passing_or_studying,
          percentage: detail.percentage_or_cgpa,
        }
      } else if (detail.level === "diploma") {
        responseData.diploma = {
          collegeName: detail.school_or_college_name,
          branch: detail.board_or_branch,
          yearOfStudying: detail.year_of_passing_or_studying,
          pinNumber: detail.pin_number,
          percentage: detail.percentage_or_cgpa,
        }
      }
    })

    return NextResponse.json({ success: true, data: responseData }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
