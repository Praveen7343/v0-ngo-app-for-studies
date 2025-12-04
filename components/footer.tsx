"use client"

export default function Footer() {
  return (
    <footer>
      {/* Focus, Impact, and Our Branches section */}
      <div className="bg-muted py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Focus Section */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-6">Focus</h3>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Parent and student counseling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Learning outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Technical education</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Employment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Health and wellbeing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Underprivileged children and youth</span>
                </li>
              </ul>
            </div>

            {/* Impact Section */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-6">Impact</h3>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>1100+ children completed Secondary school</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>800+ Diploma Engineers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>180+ Graduate Engineers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>85% are Girls – Educated & Employed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>No Girl child marriages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Ongoing counseling for students and parents</span>
                </li>
              </ul>
            </div>

            {/* Our Branches Section */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-6">Our Branches</h3>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Hyderabad</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Rangareddy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Sangareddy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Karimnagar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                  <span>Medchel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Simple copyright bar */}
      <div className="bg-primary text-white py-4 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            © 2025 Potukuchi Somasundara Social Welfare & Charitable Trust. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
