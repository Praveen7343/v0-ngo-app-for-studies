"use client"

import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer>
      {/* New section with Focus, Impact, and Our Branches */}
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

      {/* Existing dark footer section */}
      <div className="bg-foreground text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">P</span>
                </div>
                <span className="font-playfair font-bold text-lg">PSS</span>
              </div>
              <p className="text-white/70 text-sm">
                Empowering middle-class students to achieve their educational dreams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Scholarships
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Mentorship
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Get in Touch</h4>
              <ul className="space-y-3 text-white/70 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@pss.org</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 1800 PSS HELP</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-white/50 text-sm">© 2025 Platform for Student Success. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="text-white/70 hover:text-white transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
