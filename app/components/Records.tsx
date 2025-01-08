"use client"
import React from 'react';
import Image from 'next/image';
import Download from '../constants/svgs/Download.svg';
import Eye from '../constants/svgs/Eye.svg';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAttendanceContext } from '../contexts/AttendanceContext';
import { parseISO, format } from 'date-fns';

const Records = () => {
    const { attendances, loading, error } = useAttendanceContext();

    const formatDate =(date: string )=>{
        return new Date(date).toLocaleDateString('en-GB')
    }

    return (
        <div className='flex flex-col pl-[5%] w-full pt-[5%]'>
            <span className='font-semibold text-[25px] mb-[2%]'>Attendance Reports</span>
            <Table className='w-[70%] '>
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
                                    <TableCell>{ formatDate(record.attendance_date)}</TableCell> 
                                    <TableCell className="text-center">{record.sabbathName}</TableCell>
                                    <TableCell className='flex gap-6 justify-center'>
                                        <Image
                                            className='h-6 w-6 cursor-pointer'
                                            src={Eye}
                                            alt='View Attendance Record'
                                        />
                                        <Image
                                            className='h-6 w-6 cursor-pointer'
                                            src={Download}
                                            alt='Download Attendance Record'
                                        />
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
