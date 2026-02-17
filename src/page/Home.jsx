import React from 'react'
import Footer from '../components/Footer'
import FAQ from '../components/FAQ'
import Download from '../components/Download'
import PaymentInfo from '../components/PaymentInfo'
import Pricing from '../components/Pricing'
import HowItWorks from '../components/HowItWorks'
import Benefits from '../components/Benefits'
import Hero from '../components/Hero'

function Home() {
  return (
    <div className="min-h-screen bg-dark">
      <Hero />
      <Benefits />
      <HowItWorks />
      <Pricing />
      <PaymentInfo />
      <Download />
      <FAQ />
      <Footer/>
    </div>
  )
}

export default Home