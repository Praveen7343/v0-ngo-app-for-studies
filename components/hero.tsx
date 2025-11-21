"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-white py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Empowering Students Since 2020</span>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-balance leading-tight text-foreground">
            Every Student Deserves <span className="text-primary">Quality Education</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl text-pretty leading-relaxed">
            PSS (Platform for Student Success) is an NGO dedicated to breaking financial barriers. We connect aspiring
            scholars with scholarships, mentorship, and the guidance they need to pursue higher education.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Learn More
            </Button>
          </div>

          <div className="pt-12">
            <img
              src="/images/trustees-team.jpg"
              alt="PSS Trust Leadership Team"
              className="rounded-xl shadow-2xl border border-border w-full max-w-4xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
