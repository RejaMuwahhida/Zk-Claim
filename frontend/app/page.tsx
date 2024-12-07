import { Navbar } from '@/components/navbar'
import MedicalInsuranceForm from '@/components/medical-insurance-form'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <MedicalInsuranceForm />
      </main>
    </div>
  )
}

