"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Engineering Student",
    content:
      "PSS helped me find a scholarship worth ₹5 lakhs. Without this platform, I wouldn't have been able to pursue my dream of studying at a top university.",
    rating: 5,
  },
  {
    name: "Raj Kumar",
    role: "Medical Student",
    content:
      "The mentorship program connected me with a doctor who guided me through medical entrance exams. I got into my dream college!",
    rating: 5,
  },
  {
    name: "Anjali Desai",
    role: "MBA Graduate",
    content:
      "From getting a scholarship to landing my first job, PSS was there at every step. Truly life-changing platform.",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">Student Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students whose lives were transformed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground font-semibold text-lg">"{testimonial.name}"</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
