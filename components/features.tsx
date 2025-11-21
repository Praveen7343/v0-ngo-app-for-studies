"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Zap } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Scholarship Opportunities",
    description:
      "Access thousands of scholarship programs curated specifically for middle-class students pursuing higher education.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description:
      "Connect with experienced mentors who guide you through applications, career planning, and personal development.",
    color: "text-secondary",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description:
      "Free courses, study materials, and preparation guides for entrance exams and competitive assessments.",
    color: "text-accent",
  },
  {
    icon: Zap,
    title: "Career Support",
    description:
      "Get job placement assistance, interview coaching, and professional networking opportunities after graduation.",
    color: "text-primary",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">How We Support You</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and guidance at every step of your educational journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className={`${feature.color} mb-4`}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
