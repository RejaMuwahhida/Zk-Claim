'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

export default function MedicalInsuranceForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.age && formData.gender) {
      console.log('Form submitted:', formData)
      // Here you would typically send the data to a server
      alert('Form submitted successfully!')
    } else {
      alert('Please fill out all fields')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="w-full max-w-md bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-sky-700">Medical Insurance</CardTitle>
        <CardDescription>Please fill out your information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
            <Input 
              id="age" 
              name="age" 
              type="number" 
              value={formData.age} 
              onChange={handleChange} 
              required
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <RadioGroup 
              name="gender" 
              value={formData.gender} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              className="flex space-x-4"
            >
              {['Male', 'Female', 'Other'].map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender.toLowerCase()} id={gender.toLowerCase()} />
                  <Label htmlFor={gender.toLowerCase()} className="text-sm text-gray-600">{gender}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 transition-colors">
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

