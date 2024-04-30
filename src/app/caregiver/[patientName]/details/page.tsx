'use client'

import { useCaregiverContext } from '@/app/components/provider'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import adaptivePlugin from '@fullcalendar/adaptive'
import 'tailwindcss/tailwind.css'
import '../../../styles/details.css'

const CaregiverDetails = ({params} : {params: {patientName: string}}) => {
  const {state} = useCaregiverContext();
  const patient = state[decodeURIComponent(params.patientName)]

  const getNurseWorkdays = () => patient.nurses.map(nurse => {
    const startDate = nurse.date;
    const endDate = new Date(startDate).setHours(startDate.getHours()+nurse.totalHours)
    return {
      title: `${nurse.caregiverName}\n ${nurse.totalHours} hours worked`,
      start: startDate,
      end: endDate,
      hours: nurse.totalHours,
      allDay: true
    }
  })

  return (
    <div>
      <h1><strong>Patient Details</strong></h1>
      <p>Name: {patient.patientName}</p>
      <p>Member ID: {patient.memberId}</p>
      <p>Insurance Provider: {patient.insuranceProvider}</p>
      <p>DOB: { typeof patient.dob === "string" ? patient.dob : patient.dob.toDateString()}</p>
      <br>
      </br>
      <div className='mx-auto max-w-screen-lg'>
        <FullCalendar
        schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
        events={getNurseWorkdays()}
        plugins={[ dayGridPlugin, adaptivePlugin ]}
        initialView="dayGridFourWeek"
        initialDate={new Date("6/1/2023")}
        headerToolbar={{start: undefined, end: 'prev,next', center: 'title', }}
        views={{
          dayGridFourWeek: {
            type: 'dayGrid',
            duration:  {weeks: 4 },
            initialDate: new Date("6/1/2023")
          }
        }}
      />
      <div className="notes-section mt-4 p-4">
        <p className="text-xl mb-2">Notes:</p>
        <br/>
        <br/>
        <hr className='bg-black h-0.5 print:bg-black print:h-0.5'/>
        <br/>
        <br/>
        <hr className='bg-black h-0.5'/>
      </div>
      </div>
  </div>
)
}

export default CaregiverDetails
