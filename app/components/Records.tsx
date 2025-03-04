"use client";
import React, { useState } from "react";
import Image from "next/image";
import Download from "../constants/svgs/Download.svg";
import Eye from "../constants/svgs/Eye.svg";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAttendanceContext } from "../contexts/AttendanceContext";
import AttendanceReport from "./AttendanceReport";

const Records = () => {
    const { attendances } = useAttendanceContext();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Control the dialog's visibility

    // Format the date for display
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-GB");
    };

    // Format the date for sending in requests
    const formatDateForRequest = (date: string) => {
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleViewClick = (date: string) => {
        const formattedDate = formatDateForRequest(date);
        setSelectedDate(formattedDate);

        console.log(formattedDate);

        setIsDialogOpen(true)
    }

    return (
        <div className="flex flex-col pl-[5%] w-full pt-[5%]">
            <span className="font-semibold text-[25px] mb-[2%]">Attendance Records</span>
            <Table className="w-[70%]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] font-bold text-black">#</TableHead>
                        <TableHead className="font-semibold text-black">Date</TableHead>
                        <TableHead className="font-semibold text-black text-center">Saturday</TableHead>
                        <TableHead className="font-semibold text-black text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendances &&
                        Object.entries(attendances).map(([sabbathDate, records], index) =>
                            records.map((record, recordIndex) => (
                                <TableRow key={`${sabbathDate}-${recordIndex}`}>
                                    <TableCell className="flex items-center">
                                        <input type="checkbox" id={`${index}-${recordIndex}`} />
                                        <label htmlFor={`${index}-${recordIndex}`} className="ml-2">
                                            {index + 1}
                                        </label>
                                    </TableCell>
                                    <TableCell>{formatDate(record.sabbathDate)}</TableCell>
                                    <TableCell className="text-center">{record.sabbathName}</TableCell>
                                    <TableCell className="flex gap-6 justify-center">
                                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Image
                                                    className="h-6 w-6 cursor-pointer"
                                                    src={Eye}
                                                    alt="View Attendance Record"
                                                    onClick={() => handleViewClick(record.sabbathDate)}
                                                />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="w-[95%] max-w-[90%] h-full overflow-auto bg-white p-6 rounded-lg shadow-lg">
                                                <div className="relative">
                                                    {isDialogOpen && <AttendanceReport date={selectedDate} setIsDialogOpen={ setIsDialogOpen} />}
                                                </div>
                                            </AlertDialogContent>
                                        </AlertDialog>
                        
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                </TableBody>
            </Table>
        </div>
    );
};

export default Records;
