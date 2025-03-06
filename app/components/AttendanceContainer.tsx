"use client";
import React, { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import AttendanceTable from "../components/AttendanceTable";
import { addGeneralAttendanceByForm } from "../constants/files/Constants";
import { User } from "./Signup";

export interface GeneralFormAttendance {
    abaje: number;
    abasuye: number;
    abasuwe: number;
    abafashije: number;
    abafashijwe: number;
    abatangiyeIsabato: number;
    abize7: number;
    abarwayi: number;
    abafiteImpamvu: number;
    abashyitsi: number;
}

// Helper function to format labels
const formatLabel = (key: string): string => {
    const specialKeys = {
        abatangiyeIsabato: "Abatangiye Isabato",
        abize7: "Abize 7",
        abafiteImpamvu: "Abafite Impamvu",
    };

    // Return the special key label if it exists
    if (specialKeys[key as keyof typeof specialKeys]) {
        return specialKeys[key as keyof typeof specialKeys];
    }

    // Format other keys: Replace camel case and capitalize the first letter
    const formatted = key.replace(/([a-z])([A-Z])/g, "$1 $2");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const AttendanceContainer = () => {
    const [dialogType, setDialogType] = useState<"form" | "table" | null>(null);

    const [ formData, setFormData] = useState<GeneralFormAttendance>({
        abaje: 0,
        abasuye: 0,
        abasuwe: 0,
        abafashije: 0,
        abafashijwe: 0,
        abatangiyeIsabato: 0,
        abize7: 0,
        abarwayi: 0,
        abafiteImpamvu: 0,
        abashyitsi: 0
    });



      const [user, setUser]  = useState<User>()
    
    
    
    
      const attendanceUrl = user?.isAdmin ? '/attendances/general/form': "/attendances/family/form"
    
    
        useEffect(() => {
          const userString = localStorage.getItem('loggedInUser');
          if (userString) {
            setUser(JSON.parse(userString));
          }
        }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: Number(value),
        });
    };

    const handleSubmit = () => {
        addGeneralAttendanceByForm(attendanceUrl, formData)
    };

    return (
        <div className="pt-[2%] pl-[5%] ss:w-[100%] sm:w-[80%]  xl:w-[40%]">
            <h3 className="text-lg font-bold tracking-widest">Take Attendance</h3>
            <div className="bg-soft-white flex flex-col items-center px-3 py-8 mt-5 space-y-3">
                <span className="flex justify-center">You can take attendance in two ways:</span>

                {/* Trigger for Short Form */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-[60%]" onClick={() => setDialogType("form")}>
                            Fill a short form
                        </Button>
                    </AlertDialogTrigger>
                    {dialogType === "form" && (
                        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                            <form className="md:grid md:grid-cols-2 md:gap-4 ss:flex ss:flex-col ss:space-y-3 md:space-y-0 ">
                                {Object.keys(formData).map((key) => (
                                    <div key={key} className="flex flex-col">
                                        <label className="text-sm font-medium" htmlFor={key}>
                                            {formatLabel(key)}
                                        </label>
                                        <input
                                            type="number"
                                            id={key}
                                            name={key}
                                            value={formData[key as keyof GeneralFormAttendance]}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-indigo-300"
                                        />
                                    </div>
                                ))}
                                <div className="col-span-2 flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setDialogType(null)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit}>Submit</Button>
                                </div>
                            </form>
                        </AlertDialogContent>
                    )}
                </AlertDialog>

                <div className="w-full">
                    <span className="flex justify-center">Or</span>
                </div>

                {/* Trigger for Table */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-[60%]" onClick={() => setDialogType("table")}>
                            Fill a table
                        </Button>
                    </AlertDialogTrigger>
                    {dialogType === "table" && (
                        <AlertDialogContent className="max-h-[80vh] min-w-[100%]  overflow-y-auto">
                            <AttendanceTable setDialogType={setDialogType} />
                        </AlertDialogContent>
                    )}
                </AlertDialog>
            </div>
        </div>
    );
};

export default AttendanceContainer;
