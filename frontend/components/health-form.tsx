'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HealthForm() {
  const [did, setDid] = useState('');
  const [diseases, setDiseases] = useState([{ disease_name: '', diagnosed_date: '', treatment_status: '' }]);

  const handleDiseaseChange = (index, field, value) => {
    setDiseases((prevDiseases) => {
      const updatedDiseases = [...prevDiseases];
      updatedDiseases[index][field] = value;
      return updatedDiseases;
    });
  };

  const addDisease = () => {
    setDiseases((prevDiseases) => [
      ...prevDiseases,
      { disease_name: '', diagnosed_date: '', treatment_status: '' },
    ]);
  };

  const removeDisease = (index) => {
    setDiseases((prevDiseases) => prevDiseases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      did,
      diseases,
    };
  
    try {
      const response = await fetch('http://localhost:5001/api/data/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('Medical history submitted successfully!');
      } else {
        const errorData = await response.json();
        //throw new Error(errorData.message || 'Failed to submit medical history');
      }
    } catch (error) {
      console.error(error);
     // alert(`An error occurred: ${error.message}`);
    }
  };
  

  return (
    <Card className="w-full max-w-md bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-sky-700">Add Medical History</CardTitle>
        <CardDescription>Enter your DID and details about diseases</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="did" className="text-sm font-medium text-gray-700">
              DID
            </Label>
            <Input
              id="did"
              name="did"
              value={did}
              onChange={(e) => setDid(e.target.value)}
              required
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-4">
            {diseases.map((disease, index) => (
              <div key={index} className="border p-4 rounded space-y-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Disease Name</Label>
                  <Input
                    type="text"
                    value={disease.disease_name}
                    onChange={(e) =>
                      handleDiseaseChange(index, 'disease_name', e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Diagnosed Date</Label>
                  <Input
                    type="date"
                    value={disease.diagnosed_date}
                    onChange={(e) =>
                      handleDiseaseChange(index, 'diagnosed_date', e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Treatment Status</Label>
                  <Input
                    type="text"
                    value={disease.treatment_status}
                    onChange={(e) =>
                      handleDiseaseChange(index, 'treatment_status', e.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-700 transition-colors mt-2"
                  onClick={() => removeDisease(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="w-full bg-gray-600 hover:bg-gray-700 transition-colors"
            onClick={addDisease}
          >
            Add Another Disease
          </Button>
          <Button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 transition-colors"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
