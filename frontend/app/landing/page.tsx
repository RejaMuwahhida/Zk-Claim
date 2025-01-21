'use client'

import { Navbar } from '@/components/navbar'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex flex-col items-center justify-center p-4 text-center">
      
      <motion.h1 
        className="text-5xl md:text-6xl font-bold text-sky-700 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to IdenZK
      </motion.h1>
      <motion.p 
        className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Your health is our priority. Get comprehensive medical insurance tailored to your needs.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link href="/">
          <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full text-lg">
            Get Started
          </Button>
        </Link>
      </motion.div>
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        {[
          { title: "Comprehensive Coverage", description: "Protection for all aspects of your health" },
          { title: "24/7 Support", description: "Our team is always here to help you" },
          { title: "Affordable Plans", description: "Options to fit every budget" }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-xl font-semibold text-sky-600 mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div></>
  )
}

