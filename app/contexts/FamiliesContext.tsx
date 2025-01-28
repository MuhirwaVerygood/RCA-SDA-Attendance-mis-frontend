"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Family } from "../components/Families";
import { getFamilies } from "../constants/files/Constants";


interface FamiliesContextProps {
    families: Family[];
    totalMembers: number;
    setFamilies: React.Dispatch<React.SetStateAction<Family[]>>,
    setTotalMembers: React.Dispatch<React.SetStateAction<number>>
}

const FamiliesContext = createContext<FamiliesContextProps | undefined>(undefined);

export const FamiliesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [families, setFamilies] = useState<Family[]>([]);
    const [totalMembers, setTotalMembers] = useState<number>(0);

    const refreshFamilies = () => {
        getFamilies(setFamilies, setTotalMembers);
    };

    useEffect(() => {
        refreshFamilies();
    }, []);

    return (
        <FamiliesContext.Provider value={{ families, totalMembers, setFamilies, setTotalMembers }}>
            {children}
        </FamiliesContext.Provider>
    );
};

export const useFamilies = (): FamiliesContextProps => {
    const context = useContext(FamiliesContext);
    if (!context) {
        throw new Error("useFamilies must be used within a FamiliesProvider");
    }
    return context;
};
