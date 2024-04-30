'use client';

import { Patient, PayrollRow } from '@/lib/definitions';
import { createContext, useContext, useReducer } from 'react';

type Action =
  | { type: 'ADD_CAREGIVER'; payload: Patient }
  | { type: 'REMOVE_CAREGIVER'; payload: string }
  | { type: 'ADD_CAREGIVERS'; payload: PayrollRow};

type Dispatch = (action: Action) => void;

const CaregiverContext = createContext<{ state: PayrollRow; dispatch: Dispatch } | undefined>(undefined);

export const useCaregiverContext = () => {
  const context = useContext(CaregiverContext);
  if (!context) {
    throw new Error('useCaregiverContext must be used within a CaregiverProvider');
  }
  return context;
};

const reducer = (state: PayrollRow, action: Action): PayrollRow => {
  switch (action.type) {
    case 'ADD_CAREGIVER':
      return { ...state, [action.payload.patientName]: action.payload };
      case 'ADD_CAREGIVERS':
        return { ...state, ...action.payload };
    case 'REMOVE_CAREGIVER': {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};


const CaregiverProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <CaregiverContext.Provider value= {{ state, dispatch }
}>
  { children }
  </CaregiverContext.Provider>
  );
};

export default CaregiverProvider
