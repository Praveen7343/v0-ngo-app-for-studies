"use client"

import { Card } from "@/components/ui/card"

const stats = [
  { number: "50,000+", label: "Students Supported" },
  { number: "$200M+", label: "Scholarships Distributed" },
  { number: "1,000+", label: "Partner Universities" },
  { number: "95%", label: "Success Rate" },
]

export default function Stats() {
  return (
    <section id="impact" className="py-20 md:py-32 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">Our Impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Real numbers, real lives changed</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-border text-center p-8 hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-primary font-playfair mb-2">{stat.number}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
