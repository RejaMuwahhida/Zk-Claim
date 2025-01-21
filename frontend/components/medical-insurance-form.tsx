"use client";

import { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function MedicalInsuranceForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    dob: '',
    address: '',
    pincode: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [did, setDid] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => !field)) {
      alert('Please fill out all fields');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Identity
      const identityResponse = await axios.post(
        'http://localhost:3001/v2/identities',
        {
          didMetadata: {
            method: 'polygonid',
            blockchain: 'polygon',
            network: 'amoy',
            type: 'BJJ',
          },
          displayName: formData.name,
        },
        {
          headers: {
            Authorization: 'Basic dXNlcl91aTpwYXNzd29yZF91aQ==',
          },
        }
      );

      const identifier = identityResponse.data.identifier;

      // Update DID and switch to DID view
      setDid(identifier);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        <h1 className="text-2xl font-semibold text-sky-700">Your DID</h1>
        <p className="text-lg text-gray-700">{did}</p>
        <div className="mt-4">
          <QRCode value={did} />
        </div>
        <button
          className="mt-6 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow-md"
          onClick={() => navigator.clipboard.writeText(did)}
        >
          Copy DID
        </button>
        <Button
          className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow-md"
          onClick={() => setIsSubmitted(false)}
        >
          Go Back to Form
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-sky-700">Medical Insurance</CardTitle>
        <CardDescription>Please fill out your information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
      </CardContent>
    </Card>
  );
}
