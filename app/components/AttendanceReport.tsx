'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Calendar from "../constants/svgs/Calendar.svg";
import ChurchLogo from "../constants/svgs/ChurchLogo.svg";
import Cookie from "js-cookie";

// Define types for the structure of each row in the attendance data
interface AttendanceRow {
  feature: string;
  ebenezer: string;
  salvSibs: string;
  jehovahNissi: string;
  church: number;
}

// Define the structure of the family data
interface Family {
  familyName: string;
  father: string;
  mother: string;
}

interface AttendanceData {
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
  abashyitsi: number;
  date: string;
  family: Family;
}

const AttendanceReport = ({date}:{date: string}) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const findValue = (data: AttendanceData[], familyName: string, key: string): string => {
    const attendance = data.find((item) => item.family.familyName === familyName);
    if (attendance) {
      const value = attendance[key as keyof AttendanceData];
      return value !== undefined && value !== null ? String(value) : "0"; // Ensure valid value
    }
    return "0"; 
  };

  function calculateTotal(data: any, feature: string): number {
    const ebenezerValue = Number(findValue(data, "Ebenezer", feature)) || 0; // Default to 0 if invalid
    const salvSibsValue = Number(findValue(data, "Salvation Siblings", feature)) || 0; // Default to 0 if invalid
    const jehovahNissiValue = Number(findValue(data, "Jehovah-Nissi Family", feature)) || 0; // Default to 0 if invalid

    return ebenezerValue + salvSibsValue + jehovahNissiValue;
  }

  useEffect(() => {
    // Fetch attendance data
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:3500/attendances/${date}`, {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
          },
        });
        const data: AttendanceData[] = await response.json();




        // Transform data into the required structure
        const transformedData: AttendanceRow[] = [
          { feature: "Abanditswe", ebenezer: findValue(data, "Ebenezer", "abanditswe"), salvSibs: findValue(data, "Salvation Siblings", "abanditswe"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abanditswe"), church: calculateTotal(data, "abanditswe") },
          { feature: "Abaje", ebenezer: findValue(data, "Ebenezer", "abaje"), salvSibs: findValue(data, "Salvation Siblings", "abaje"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abaje"), church: calculateTotal(data, "abaje") },
          { feature: "Abasuye", ebenezer: findValue(data, "Ebenezer", "abasuye"), salvSibs: findValue(data, "Salvation Siblings", "abasuye"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abasuye"), church: calculateTotal(data, "abasuye") },
          { feature: "Abasuwe", ebenezer: findValue(data, "Ebenezer", "abasuwe"), salvSibs: findValue(data, "Salvation Siblings", "abasuwe"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abasuwe"), church: calculateTotal(data, "abasuwe") },
          { feature: "Abafashije", ebenezer: findValue(data, "Ebenezer", "abafashije"), salvSibs: findValue(data, "Salvation Siblings", "abafashije"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abafashije"), church: calculateTotal(data, "abafashije") },
          { feature: "Abafashijwe", ebenezer: findValue(data, "Ebenezer", "abafashijwe"), salvSibs: findValue(data, "Salvation Siblings", "abafashijwe"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abafashijwe"), church: calculateTotal(data, "abafashijwe") },
          { feature: "Abat.Isabato", ebenezer: findValue(data, "Ebenezer", "abatangiyeIsabato"), salvSibs: findValue(data, "Salvation Siblings", "abatangiyeIsabato"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abatangiyeIsabato"), church: calculateTotal(data, "abatangiyeIsabato") },
          { feature: "Abarwayi", ebenezer: findValue(data, "Ebenezer", "abarwayi"), salvSibs: findValue(data, "Salvation Siblings", "abarwayi"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abarwayi"), church: calculateTotal(data, "abarwayi") },
          { feature: "Impamvu", ebenezer: findValue(data, "Ebenezer", "abafiteImpamvu"), salvSibs: findValue(data, "Salvation Siblings", "abafiteImpamvu"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abafiteImpamvu"), church: calculateTotal(data, "abafiteImpamvu") },
          { feature: "Abashyitsi", ebenezer: findValue(data, "Ebenezer", "abashyitsi"), salvSibs: findValue(data, "Salvation Siblings", "abashyitsi"), jehovahNissi: findValue(data, "Jehovah-Nissi Family", "abashyitsi"), church: calculateTotal(data, "abashyitsi") },
        ];

      

        setAttendanceData(transformedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        console.log(err);
        
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-soft-white w-[80%] mx-auto px-6 py-5 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 font-semibold">
          <Image src={Calendar} className="w-6 h-6" alt="calendar" />
          <div>
            <span>Attendance List</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Image src={ChurchLogo} className="w-10 h-10" alt="church logo" />
          <div>
            <span className="font-bold">RCA SDA</span>
          </div>
        </div>
      </div>

      {/* Columns Headers */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-soft-black px-1 py-1 rounded-md">
          <span className="flex justify-center text-white">FEATURES</span>
        </div>
        <div className="bg-soft-black px-1 py-1 rounded-md">
          <span className="flex justify-center text-white">EBENEZER</span>
        </div>
        <div className="bg-soft-black px-1 py-1 rounded-md">
          <span className="flex justify-center text-white">SALV SIBS</span>
        </div>
        <div className="bg-soft-black px-1 py-1 rounded-md">
          <span className="flex justify-center text-white">JEHOVAH-NISSI</span>
        </div>
        <div className="bg-soft-black px-1 py-1 rounded-md">
          <span className="flex justify-center text-white">CHURCH</span>
        </div>
      </div>

      {/* Rows */}
      <div className="grid grid-cols-5 gap-4">
        {/* Features Column */}
        <div className="flex flex-col gap-2">
          {attendanceData.map((row, index) => (
            <div
              key={`feature-${index}`}
              className="px-5 py-1 border-[1px] border-[#201F1F] rounded-md"
            >
              <span className="flex justify-center">{row.feature}</span>
            </div>
          ))}
        </div>

        {/* Ebenezer Column */}
        <div className="flex flex-col gap-2">
          {attendanceData.map((row, index) => (
            <div
              key={`ebenezer-${index}`}
              className="px-1 py-1 border-[1px] border-[#201F1F] rounded-md"
            >
              <span className="flex justify-center">{row.ebenezer}</span>
            </div>
          ))}
        </div>

        {/* Salv Sibs Column */}
        <div className="flex flex-col gap-2">
          {attendanceData.map((row, index) => (
            <div
              key={`salvSibs-${index}`}
              className="px-1 py-1 border-[1px] border-[#201F1F] rounded-md"
            >
              <span className="flex justify-center">{row.salvSibs}</span>
            </div>
          ))}
        </div>

        {/* Jehovah-Nissi Column */}
        <div className="flex flex-col gap-2">
          {attendanceData.map((row, index) => (
            <div
              key={`jehovahNissi-${index}`}
              className="px-1 py-1 border-[1px] border-[#201F1F] rounded-md"
            >
              <span className="flex justify-center">{row.jehovahNissi}</span>
            </div>
          ))}
        </div>

        {/* Church Column */}
        <div className="flex flex-col gap-2">
          {attendanceData.map((row, index) => (
            <div
              key={`church-${index}`}
              className="px-1 py-1 border-[1px] border-[#201F1F] rounded-md"
            >
              <span className="flex justify-center">{row.church}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
