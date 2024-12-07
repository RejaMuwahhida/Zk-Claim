'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function MedicalInsuranceForm() {
  
  return (
    <Card className="w-full max-w-md bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-sky-700">Medical Insurance</CardTitle>
        <CardDescription>Please fill out your information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          {['name', 'age', 'dob', 'address', 'pincode', 'state'].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                name={field}
                type={field === 'age' ? 'number' : field === 'dob' ? 'date' : 'text'}
                value={formData[field]}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <RadioGroup
              name="gender"
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
              className="flex space-x-4"
            >
              {['Male', 'Female', 'Other'].map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender.toLowerCase()} id={gender.toLowerCase()} />
                  <Label htmlFor={gender.toLowerCase()} className="text-sm text-gray-600">
                    {gender}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 transition-colors" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Application'}
          </Button>
        </form>
        {did && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-700">Your DID</p>
            <Input
              type="text"
              readOnly
              value={did}
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 text-center"
              onClick={() => navigator.clipboard.writeText(did)}
            />
            <p className="text-sm text-gray-500">Click to copy</p>
            <div className="mt-4">
              <QRCode value={qrValue} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
