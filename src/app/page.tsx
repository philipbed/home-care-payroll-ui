'use client'
import Image from 'next/image';
import Link from 'next/link';
import Papa from 'papaparse';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useCaregiverContext } from './components/provider';
import { Caregiver, PayrollEvent, PayrollRow } from '@/lib/definitions';
import { cleanData } from '@/lib/parseUtils';

export default function Home() {
  const {state, dispatch} = useCaregiverContext()
  const [payrollFile, setFile] = useState<File | null>(null)
  const [payPeriod, setPayPeriod] = useState<Date>();

  const handlePayPeriodChange = (event: ChangeEvent<HTMLInputElement>) => {
    const strDate = event.currentTarget.value.split('/')
    strDate.splice(1,0,"1")
    const monthYear = new Date(strDate.join('/'))
    setPayPeriod(monthYear);
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    setFile(file);
  }

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (payrollFile) {
      Papa.parse(payrollFile, {
      header: true,  // indicates the first row contains column names
      dynamicTyping: true, // indicates numeric and boolean data should be converted to their type instead of remaining as strings
      complete: function(results: { data: [], error: [], meta: {}} ) {
        const cleanedData = cleanData({data: results.data, payPeriod: payPeriod!})
        dispatch({type: 'ADD_CAREGIVERS', payload: cleanedData})
      }
    });
    }

  }


  const renderRows = () => {
    return Object.keys(state).map((patientName: string) => {
      const {memberId, insuranceProvider, dob} = state[patientName];
      return (
        <tr className="hover:bg-gray-500" key={`${patientName}-${memberId}-${insuranceProvider}`}>
          <td className="py-2 px-3 border-b"><Link className="text-blue-600 px-3 py-1 hover:underline hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" href={`/caregiver/${encodeURIComponent(patientName)}/details`}>{patientName}</Link></td>
          <td className="py-2 px-3 border-b">{memberId || "N/A"}</td>
          <td className="py-2 px-3 border-b">{insuranceProvider}</td>
          <td className="py-2 px-3 border-b">{typeof dob === "string" ? dob : dob.toDateString()}</td>
        </tr>
      );
    })
  }

  const renderTable = () => {
    return <>
      {Object.keys(state).length !== 0 && (
        <table className="min-w-full bg-gray-400 shadow-md rounded-md overflow-hidden">
          <thead>
            <tr>
              <th className="py-2 px-3 bg-gray-600 text-center" scope="col">Patient Name</th>
              <th className="py-2 px-3 bg-gray-600 text-center" scope='col'>Member ID</th>
              <th className="py-2 px-3 bg-gray-600 text-center" scope='col'>Insurance Provider</th>
              <th className="py-2 px-3 bg-gray-600 text-center" scope='col'>DOB</th>
            </tr>
          </thead>
          <tbody style={{textAlign: 'center'}}>
            {renderRows()}
          </tbody>
        </table>
      )}
    </>
  }
  return (
    <div className="container mx-auto p-4">
      {Object.keys(state).length === 0 && (
      <form onSubmit={submitForm} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Pay Period (MM/YYYY)
        </label>
        <input type="text" onChange={handlePayPeriodChange} placeholder='MM/YYYY' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Upload Payroll File
        </label>
        <input type="file" onChange={handleFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Submit
        </button>
        </div>
      </form>
      )}
      <br/><br/>
      {renderTable()}
    </div>
  )
}
