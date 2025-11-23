import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import AboutUs from "@/components/about-us"
import OurImpact from "@/components/our-impact"
import ContactUs from "@/components/contact-us"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <AboutUs />
      <OurImpact />
      <ContactUs />
      <Footer />
    </main>
  )
}
