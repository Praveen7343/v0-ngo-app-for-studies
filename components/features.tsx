"use client"

import Image from "next/image"

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-8">
          Student Prospects at the Trust
        </h2>

        <div className="bg-white border border-border rounded-lg p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side - 8 Year Career Path */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
                8 Year Career Path for Technical Education
              </h3>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Career Path Diagram */}
                <div className="flex-shrink-0">
                  <Image
                    src="/images/screenshot-202025-11-29-20163334.png"
                    alt="8 Year Career Path Diagram"
                    width={280}
                    height={350}
                    className="rounded-lg"
                  />
                </div>

                {/* Career Path Description */}
                <div className="space-y-3">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong>9th Class</strong> – Enrollment with Trust– Focus on Basics
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong>10th Class</strong> – Board exams and Politechnic Entrance.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Some students will also be selected for Vocational courses after the 10 class. These kids secure
                        jobs after the completion of courses
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong>Diploma</strong> – 3 years
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong>Placement</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong>Engineering</strong> – 3 years
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong>Placement</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side - Skill Development Path */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">Skill Development path</h3>

              <div className="space-y-4 text-foreground">
                <div>
                  <p className="font-semibold">1. Health Sector</p>
                  <ul className="ml-6 space-y-1">
                    <li>1. Multipurpose Health Workers</li>
                    <li>2. Medical Lab Technician</li>
                    <li>3. Pharmatech</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">2. Computer Courses</p>
                  <ul className="ml-6 space-y-1">
                    <li>1. Animation and multimedia</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">3. Automobile</p>
                  <ul className="ml-6 space-y-1">
                    <li>1. Driver careers</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">4. Technicians</p>
                  <ul className="ml-6 space-y-1">
                    <li>1. Plumbing</li>
                    <li>2. Electrical technicians</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
