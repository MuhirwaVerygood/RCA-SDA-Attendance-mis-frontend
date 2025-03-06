import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchAttendances,  } from '../constants/files/Constants';
import { AttendanceRecord } from './AttendanceContext';


// Define the context type
interface FamilyAttendanceContextType {
  attendances: Record<string, AttendanceRecord[]> | null;
  loading: boolean;
  error: string | null;
}

// Create the context
const FamilyAttendanceContext = createContext<
  FamilyAttendanceContextType | undefined
>(undefined);

// Context provider component
export const FamilyAttendanceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

const [attendances, setAttendances] = useState<Record<
      string,
      AttendanceRecord[]
    > | null>(null);  

    
    
    
  useEffect(() => {
    fetchAttendances("/attendances/family" , setLoading , setError , setAttendances);
  }, [])

  return (
    <FamilyAttendanceContext.Provider value={{ attendances, loading, error }}>
      {children}
    </FamilyAttendanceContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useFamilyAttendance = () => {
  const context = useContext(FamilyAttendanceContext);
  if (!context) {
    throw new Error(
      'useFamilyAttendance must be used within a FamilyAttendanceProvider',
    );
  }
  return context;
};
