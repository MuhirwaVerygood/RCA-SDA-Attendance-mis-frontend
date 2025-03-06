"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchAttendances } from "../constants/files/Constants";

export interface AttendanceRecord {
    date: string;
    sabbathDate: string;
    sabbathName: string;
    abanditswe: number;
    abaje: number;
    abasuye: number;
    abasuwe: number;
    abafashije: number;
    abafashijwe: number;
    abatangiyeIsabato: number;
    abarwayi: number;
    abafiteImpamvu: number;
}

interface AttendanceContextType {
    attendances: Record<string, AttendanceRecord[]> | null;
    loading: boolean;
    error: string | null;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
    const [attendances, setAttendances] = useState<Record<string, AttendanceRecord[]> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAttendances(
                  '/attendances/grouped',
                  setLoading,
                  setError,
                  setAttendances,
                );
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <AttendanceContext.Provider value={{ attendances, loading, error }}>
            {children}
        </AttendanceContext.Provider>
    );
};

export const useAttendanceContext = (): AttendanceContextType => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error("useAttendanceContext must be used within an AttendanceProvider");
    }
    return context;
};  
