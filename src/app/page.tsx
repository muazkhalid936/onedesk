import React from 'react'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import PainPoints from '@/components/landing/PainPoints'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Comparison from '@/components/landing/Comparison'
import Testimonials from '@/components/landing/Testimonials'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

const page = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <PainPoints />
      <Features />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  )
}

export default page