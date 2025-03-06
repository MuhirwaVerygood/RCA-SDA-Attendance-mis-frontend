'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Eye from '../constants/svgs/Eye.svg';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useFamily } from '../contexts/FamilyContext';
import AttendanceReport from './AttendanceReport';
import { useFamilyAttendance } from '../contexts/FamilyAttendanceContext';

const FamilyRecords = () => {
  const { attendances } = useFamilyAttendance();
  const { family } = useFamily();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Format the date for display
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB');

  // Format the date for requests
  const formatDateForRequest = (date: string) => {
    const parsedDate = new Date(date);
    return `${parsedDate.getFullYear()}-${String(
      parsedDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
  };

  const handleViewClick = (date: string) => {
    setSelectedDate(formatDateForRequest(date));
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col pl-[5%] w-full pt-[5%]">
      <span className="font-semibold text-[25px] mb-[2%]">
        Attendance Records - {family?.familyName}
      </span>
      <Table className="w-[70%]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-bold text-black">#</TableHead>
            <TableHead className="font-semibold text-black">Date</TableHead>
            <TableHead className="font-semibold text-black text-center">
              Saturday
            </TableHead>
            <TableHead className="font-semibold text-black text-center">
              Actions
            </TableHead>
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
                  <TableCell className="text-center">
                    {record.sabbathName}
                  </TableCell>
                  <TableCell className="flex gap-6 justify-center">
                    <AlertDialog
                      open={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                    >
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
                          {isDialogOpen && (
                            <AttendanceReport
                              date={selectedDate}
                              setIsDialogOpen={setIsDialogOpen}
                            />
                          )}
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )),
            )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FamilyRecords;
