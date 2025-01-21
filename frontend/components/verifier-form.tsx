'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function VerifierForm() {
  const [did, setDid] = useState('');
  const [claimDisease, setClaimDisease] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Send GET request to fetch EHR
      const ehrResponse = await fetch(`http://localhost:5001/api/reclaim/receive-ehr/${did}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!ehrResponse.ok) {
        throw new Error('Failed to fetch EHR');
      }

      const ehrData = await ehrResponse.json();

      // Step 2: Create POST request to verify proof
      const verifyResponse = await fetch('http://localhost:5001/api/verify/verify-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claimDisease }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify proof');
      }

      const verifyData = await verifyResponse.json();

      // Step 3: Alert based on the success parameter
      if (verifyData.success) {
        alert('Verification successful!');
      } else {
        alert('Verification failed!');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during the verification process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-sky-700">Verifier Form</CardTitle>
        <CardDescription>
          Enter the DID and claim disease to verify medical records.
        </CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="claimDisease" className="text-sm font-medium text-gray-700">
              Claim Disease
            </Label>
            <Input
              id="claimDisease"
              name="claimDisease"
              value={claimDisease}
              onChange={(e) => setClaimDisease(e.target.value)}
              required
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-sky-600 hover:bg-sky-700'
            } transition-colors`}
          >
            {loading ? 'Verifying...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
