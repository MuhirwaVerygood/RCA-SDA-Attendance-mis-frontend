'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Family } from '../components/Families';
import { getMyFamily } from '../constants/files/Constants';

interface FamilyContextProps {
  family: Family | null;
  totalMembers: number;
  totalActiveMembers: number;
  setFamily: React.Dispatch<React.SetStateAction<Family | null>>;
  setTotalMembers: React.Dispatch<React.SetStateAction<number>>;
  setTotalActiveMembers: React.Dispatch<React.SetStateAction<number>>;
}

const FamilyContext = createContext<FamilyContextProps | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [family, setFamily] = useState<Family | null>(null);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalActiveMembers, setTotalActiveMembers] = useState<number>(0);

  const refreshFamily = () => {
    getMyFamily(setFamily, setTotalMembers, setTotalActiveMembers);
  };

  useEffect(() => {
    refreshFamily();
  }, []);

  return (
    <FamilyContext.Provider
      value={{
        family,
        totalMembers,
        totalActiveMembers,
        setFamily,
        setTotalMembers,
        setTotalActiveMembers,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = (): FamilyContextProps => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
