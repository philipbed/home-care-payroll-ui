import { Caregiver, PayrollRow } from './definitions';

const mapTotalHours = ([currKey, currValue]: [string, any], payPeriod: Date) => {
  let date = new Date();
  let hours = 0;
  const dateKey = parseInt(currKey.replace(/_/g, "").trim());
  if (currKey.trim() !== 'MEMBER ID' && typeof dateKey === 'number' ) {
    date.setMonth(payPeriod.getMonth()) // TODO: remove
    date.setDate(dateKey); // TODO: remove
    date.setFullYear(payPeriod.getFullYear(), payPeriod.getMonth(), dateKey)
    if (currValue && typeof currValue === 'number') {
      hours = currValue
      return {totalHours: hours, date }
    }
    return;
}
}

const getNurses = ({current, caregiverName, payPeriod}: {current: any, caregiverName: string, payPeriod: Date}) => {
  return Object.entries(current).map((entry) => mapTotalHours(entry, payPeriod)).filter(events => events !== undefined).map(dateHour => ({...dateHour!, caregiverName}))
}

export const cleanData = ({data, payPeriod}:{data: [], payPeriod: Date}) => {
  const cleanedData = data.reduce((accumulator: PayrollRow, current, index: number) => {
    if (index === 0){
      return accumulator;
    }
    const caregiverName: string = current["Caregiver_Name"]
    const nurses: Caregiver[] = getNurses({current, caregiverName, payPeriod})
    const patientName = current["Patient_Name"];
    const dob =  current["DOB"] ? new Date(current["DOB"]) : "N/A";
    const insuranceProvider = current["INSURANCE"]
    const memberId = current["MEMBER ID"]

    const patient = {
      patientName,
      dob,
      insuranceProvider,
      memberId,
      nurses
    }

    if (patientName in accumulator){
      accumulator[patientName] = {
        ...accumulator[patientName],
        nurses: [...accumulator[patientName].nurses, ...patient.nurses]
      }
    }
    else {
      accumulator[patientName] = patient
    }
    return accumulator;

  }, {} as PayrollRow)

  delete cleanedData["null"];
  return cleanedData;
}
