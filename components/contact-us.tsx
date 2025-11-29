"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactUs() {
  return (
    <section id="contact" className="py-20 px-4 bg-gray-50 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Contact Us</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Phone */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Phone:
              </h3>
              <ul className="space-y-2 ml-7 text-gray-700">
                <li>+91-9246106332</li>
                <li>+91-9346206332</li>
              </ul>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                E-mail:
              </h3>
              <ul className="space-y-2 ml-7 text-gray-700">
                <li>
                  <a href="mailto:chairman@psstrust.org" className="hover:text-primary transition">
                    chairman@psstrust.org
                  </a>
                </li>
                <li>
                  <a href="mailto:info@psstrust.org" className="hover:text-primary transition">
                    info@psstrust.org
                  </a>
                </li>
                <li>
                  <a href="mailto:potukuchitrust@gmail.com" className="hover:text-primary transition">
                    potukuchitrust@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location (Office):
              </h3>
              <div className="ml-7 text-gray-700 space-y-2">
                <p className="font-semibold">PSS Trust:</p>
                <p>#2530/79, Watertank, Mathrusree Nagar,</p>
                <p>Miyapur, Hyderabad, Telangana 500049</p>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="rounded-lg overflow-hidden shadow-lg h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.8892889341497!2d78.35614!3d17.50652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91234567890d%3A0x123456789abcdef!2sPSS%20TRUST%20MIYAPUR!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PSS Trust Location"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
