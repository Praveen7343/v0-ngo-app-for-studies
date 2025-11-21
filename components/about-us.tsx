"use client"

export default function AboutUs() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-12">About Us</h2>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Organization Overview */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                PSS Trust (NGO){" "}
                <span className="font-bold">"POTUKUCHI SOMASUNDARA SOCIAL WELFARE AND CHARITABLE TRUST"</span> (Reg No:
                95/2003) established in august 15, 2003. by Mr. Dr (H.C) P Srinivas on the name of his father P
                Somasundara Sastry( National award best Teacher awardee from AP)
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Children from many Below Poverty Line families, migrant workers and daily wagers who study in government
                schools face several challenges to continue their secondary school and college education. The growing
                economic and cultural gaps in the society do not allow them to rise above their conditions. Boys keep
                dropping off from schools and work on meagre wages and girls keep getting married at early ages. These
                conditions either continue or keep worsening for generations unless there is intervention by the Civil
                Societies.
              </p>
            </div>

            {/* Our Mission */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission:</h3>
              <div className="bg-blue-50 border-l-4 border-blue-600 pl-6 py-4">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  The Vision and the Mission of the PSS Trust is to transform the BPL families who remain as
                  beneficiaries of the Government subsidies to dignified Tax paying civilians through education and
                  employment.
                </p>
              </div>
            </div>

            {/* Our Approach */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach:</h3>
              <div className="bg-blue-50 border-l-4 border-blue-600 pl-6 py-4">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  The PSS Trust approach is very practical and we did exactly what can make our vision realized. We are
                  happy to present here such insights of our consistent success. We are sure that we found working
                  solutions by focusing on.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image and Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="/images/trustees-group.png" alt="PSS Trust Trustees" className="w-full h-auto object-cover" />
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-blue-900">PSS Trust Team</h4>
                  <p className="text-blue-600 font-semibold">(Trustees & Leadership)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
