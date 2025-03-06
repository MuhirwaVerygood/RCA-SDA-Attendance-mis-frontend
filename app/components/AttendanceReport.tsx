'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { authorizedAPI } from '../constants/files/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ChurchLogo from '../constants/svgs/ChurchLogo.svg';
import Calendar from '../constants/svgs/Calendar.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User } from './Signup';
import axios from 'axios';

interface Family {
  id: number;
  familyName: string;
  father: string;
  mother: string;
}

export interface AttendanceData {
  id: number;
  abanditswe: number;
  abaje: number;
  abasuye: number;
  abasuwe: number;
  abafashije: number;
  abafashijwe: number;
  abatangiyeIsabato: number;
  abarwayi: number;
  abafiteImpamvu: number;
  abize7: number;
  abashyitsi: number;
  date: string;
  family: Family;
}

const AttendanceReport = ({
  date,
  setIsDialogOpen,
}: {
  date: string | null;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [families, setFamilies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Fetch user and attendance data in a single useEffect
  useEffect(() => {
    const fetchData = async () => {
      const userString = localStorage.getItem('loggedInUser');
      if (userString) {
        const loggedInUser = JSON.parse(userString);
        setUser(loggedInUser);

        try {
          // Determine the API URL based on the user's role
          const apiUrl = loggedInUser?.isAdmin
            ? `/attendances/${date}`
            : loggedInUser?.isFather || loggedInUser?.isMother
            ? `/attendances/family/${date}`
            : '';

          // If no valid API URL is determined, throw an error
          if (!apiUrl) {
            throw new Error('Invalid user role or missing date.');
          }

          // Fetch data from the API
          const response = await authorizedAPI.get(apiUrl);
          const data: AttendanceData[] = response.data;

          // Process the data
          if (data.some((item) => item.family == null)) {
            setAttendanceData(data);
            console.log(attendanceData);
            
          } else {
            const uniqueFamilies = Array.from(
              new Set(data.map((item) => item.family.familyName)),
            );
            setFamilies(uniqueFamilies);
            setAttendanceData(data);
          }
        } catch (error) {
          console.error('Error fetching attendance data:', error);

          // Handle Axios errors
          if (axios.isAxiosError(error)) {
            // Axios-specific error handling
            if (error.response) {
              // The request was made and the server responded with a status code
              console.error('Axios error response:', error.response);
              setError(
                `Error: ${error.response.status} - ${error.response.statusText}`,
              );
            } else if (error.request) {
              // The request was made but no response was received
              console.error('Axios error request:', error.request);
              setError('No response received from the server.');
            } else {
              // Something happened in setting up the request
              console.error('Axios error:', error.message);
              setError(`Error: ${error.message}`);
            }
          } else {
            // Handle non-Axios errors
            console.error('Non-Axios error:', error);
            setError('An unexpected error occurred.');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    if (date) {
      fetchData();
    }
  }, [date]);

  const features = [
    'abanditswe',
    'abaje',
    'abasuye',
    'abasuwe',
    'abafashije',
    'abafashijwe',
    'abatangiyeIsabato',
    'abarwayi',
    'abafiteImpamvu',
    'abize7',
    'abashyitsi',
  ];

  const formatFeatureName = (feature: string): string => {
    return feature
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  // Calculate total for a given key
  const calculateTotal = (key: keyof AttendanceData): number => {
    return attendanceData.reduce(
      (sum, item) => sum + (Number(item[key]) || 0),
      0,
    );
  };

  // Get attendance value for a specific family and key
  const getValue = (familyName: string, key: keyof AttendanceData): number => {
    const entry = attendanceData.find(
      (item) => item.family.familyName === familyName,
    );
    return entry ? Number(entry[key]) || 0 : 0;
  };

  // Calculate percentage for each family
  const familyPercentages = families.map((family) => {
    const registered =
      getValue(family, 'abanditswe') -
      getValue(family, 'abafiteImpamvu') -
      getValue(family, 'abarwayi');
    if (registered === 0) return '0%';

    // Calculate the average percentage across all features for this family
    const totalPercentage = features
      .filter(
        (feature) =>
          feature !== 'abanditswe' &&
          feature !== 'abashyitsi' &&
          feature !== 'abarwayi' &&
          feature !== 'abafiteImpamvu',
      ) // Exclude specific features
      .reduce((sum, feature) => {
        const value = getValue(family, feature as keyof AttendanceData);
        return sum + (value / registered) * 100;
      }, 0);

    const avgPercentage = totalPercentage / (features.length - 4); // Exclude 4 features from count
    return avgPercentage.toFixed(2) + '%';
  });

  // Calculate overall percentage
  const overallPercentage = families.length
    ? (
        familyPercentages.reduce(
          (sum, percentage) => sum + parseFloat(percentage),
          0,
        ) / families.length
      ).toFixed(2) + '%'
    : '0%';

  // Download Attendance Report as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${date}`, 20, 10);

    const formatFeature = (feature: string) => {
      return feature
        .replace(/([A-Z])/g, ' $1') // Add a space before each uppercase letter
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
    };

    const tableData: any[] = [];
    const headers = ['Feature', ...families, 'Total'];

    features.forEach((feature) => {
      const row = [
        formatFeature(feature),
        ...families.map((family) =>
          getValue(family, feature as keyof AttendanceData),
        ),
        calculateTotal(feature as keyof AttendanceData),
      ];
      tableData.push(row);
    });

    // Add percentage row
    const percentageRow = [
      'Percentage',
      ...familyPercentages,
      overallPercentage,
    ];
    tableData.push(percentageRow);

    autoTable(doc, {
      head: [headers],
      body: tableData,
      didParseCell: function (data) {
        if (data.row.index === tableData.length - 1 && data.column.index > 0) {
          const percentageRaw = data.cell.raw;
          const percentage =
            typeof percentageRaw === 'string'
              ? parseFloat(percentageRaw.replace('%', ''))
              : 0;

          if (percentage < 50) {
            data.cell.styles.textColor = [255, 0, 0]; // Red color
          }
        }
      },
    });

    doc.save(`Attendance_Report_${date}.pdf`);
  };






  const calculateAttendancePercentage = (
    attendance: AttendanceData,
    features: string[],
  ): string => {
    
    // Calculate the number of registered members who were expected to attend
    const registered =
      attendance.abanditswe - attendance.abafiteImpamvu - attendance.abarwayi;

    // If no members were expected to attend, return 0%
    if (registered === 0) return '0%';

    // Exclude specific features from the calculation
    const includedFeatures = features.filter(
      (feature) =>
        feature !== 'abanditswe' &&
        feature !== 'abashyitsi' &&
        feature !== 'abarwayi' &&
        feature !== 'abafiteImpamvu',
    );

    // Calculate the total percentage across the included features
    const totalPercentage = includedFeatures.reduce((sum, feature) => {
      const value: any = attendance[feature as keyof AttendanceData] || 0;
      return sum + (value / registered) * 100;
    }, 0);

    // Calculate the average percentage
    const avgPercentage = totalPercentage / includedFeatures.length;

    // Return the percentage as a formatted string
    return `${avgPercentage.toFixed(2)}%`;
  };




console.log(attendanceData[0]);


 
  const isParent = user?.isFather || user?.isMother;
  const famPercentage = isParent ? calculateAttendancePercentage(attendanceData[0], features) : ""
  console.log(famPercentage);
  

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 font-semibold">
          <Image src={Calendar} className="w-6 h-6" alt="calendar" />
          <div>
            <span>Attendance List for {date}</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Image src={ChurchLogo} className="w-10 h-10" alt="church logo" />
          <div>
            <span className="font-bold">RCA SDA</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end py-5">
        <Button onClick={downloadPDF} className="px-4 py-5 text-white rounded">
          Download PDF
        </Button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Feature
            </th>
            {families.map((family) => (
              <th key={family} className="border border-gray-300 px-4 py-2">
                {family}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature}>
              <td className="border border-gray-300 px-4 py-2">
                {formatFeatureName(feature)}
              </td>
              {families.map((family) => (
                <td
                  key={family}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  {getValue(family, feature as keyof AttendanceData)}
                </td>
              ))}
              <td className="border border-gray-300 px-4 py-2 text-center">
                {calculateTotal(feature as keyof AttendanceData)}
              </td>
            </tr>
          ))}

          {/* Percentage Row */}
          <tr className="bg-gray-200 font-bold">
            <td className="border border-gray-300 px-4 py-2">Percentage</td>
            {familyPercentages.map((percentage, index) => {
              const numericPercentage = parseFloat(percentage);
              return (
                <td
                  key={index}
                  className={`border text-center border-gray-300 px-4 py-2 ${
                    numericPercentage < 50 ? 'text-red-500' : ''
                  }`}
                >
                  { user?.isAdmin? percentage : calculateAttendancePercentage(attendanceData[0], features) }
                </td>
              );
            })}
            <td className="border border-gray-300 px-4 py-2">
              {overallPercentage}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 flex space-x-4 justify-end">
        <Button
          onClick={() => setIsDialogOpen(false)}
          className="px-4 py-5 text-white rounded w-[10%]"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default AttendanceReport;
