"use client"

export default function OurImpact() {
  const stats = [
    {
      number: "200+",
      description: "Engineering Graduates and Employees in Reputed Organizations",
    },
    {
      number: "1,100+",
      description: "Are Diploma Holders",
    },
    {
      number: "465+",
      description: "Students studying Engineering and Polytechnic",
    },
    {
      number: "14",
      description: "We expanded to 7 branches",
    },
    {
      number: "23+",
      description: "Years of Experience",
    },
  ]

  const services = [
    "Education till the Graduation and Post Graduation",
    "One time meal, College fees, Exam fees, and Study materials",
    "Transportation Facility",
    "Provide Online and Offline Classes",
  ]

  return (
    <section id="impact" className="py-16 md:py-24 bg-gray-50 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">Our Impact</h2>
          <p className="text-xl text-gray-600">Let the Numbers Speak</p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="border border-gray-300 p-8 bg-white hover:shadow-lg transition-shadow">
                  <div className="text-4xl md:text-5xl font-bold text-teal-700 mb-4">{stat.number}</div>
                  <div className="w-12 h-1 bg-orange-400 mb-4"></div>
                  <p className="text-gray-800 font-semibold text-sm md:text-base">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services List */}
          <div className="bg-white border border-gray-300 p-8 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Our Support Services</h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-white text-sm font-bold">
                      ✓
                    </div>
                  </div>
                  <span className="text-gray-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
