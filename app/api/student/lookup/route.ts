import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { studentName, trustId } = await request.json()

    if (!studentName || !trustId) {
      return NextResponse.json({ error: "Student Name and Trust ID are required" }, { status: 400 })
    }

    // Fetch student with case-insensitive name match
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .ilike("student_name", studentName.trim())
      .eq("trust_id", trustId.trim())
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: "No student found with the provided name and Trust ID" }, { status: 404 })
    }

    // Fetch academic details for this student
    const { data: academicDetails } = await supabase.from("academic_details").select("*").eq("student_id", student.id)

    return NextResponse.json({
      student: {
        ...student,
        academic_details: academicDetails || [],
      },
    })
  } catch {
    return NextResponse.json({ error: "An error occurred while fetching student details" }, { status: 500 })
  }
}
