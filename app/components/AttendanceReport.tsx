"use client";
import React, { useEffect, useState } from "react";
import { authorizedAPI } from "../constants/files/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ChurchLogo from "../constants/svgs/ChurchLogo.svg";
import Calendar from "../constants/svgs/Calendar.svg";

import Image from "next/image";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await authorizedAPI.get(
          `http://localhost:3500/attendances/${date}`
        );
        const data: AttendanceData[] = await response.data;

        // Extract unique family names dynamically
        const uniqueFamilies = Array.from(
          new Set(data.map((item) => item.family.familyName))
        );
        setFamilies(uniqueFamilies);
        setAttendanceData(data);
      } catch (error) {
        setError("Failed to fetch attendance data.");
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchAttendanceData();
    }
  }, [date]);

  const features = [
    "abanditswe",
    "abaje",
    "abasuye",
    "abasuwe",
    "abafashije",
    "abafashijwe",
    "abatangiyeIsabato",
    "abarwayi",
    "abafiteImpamvu",
    "abize7",
    "abashyitsi",
  ];


  const formatFeatureName = (feature: string): string => {
    return feature
      .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between camelCase words
      .replace(/^./, (str) => str.toUpperCase());  // Capitalize the first letter
  };


  // Calculate total for a given key
  const calculateTotal = (key: keyof AttendanceData): number => {
    return attendanceData.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  };

  // Get attendance value for a specific family and key
  const getValue = (familyName: string, key: keyof AttendanceData): number => {
    const entry = attendanceData.find(
      (item) => item.family.familyName === familyName
    );
    return entry ? Number(entry[key]) || 0 : 0;
  };




  // Calculate percentage per family
  // Calculate percentage per family based on abanditswe
  const familyPercentages = families.map((family) => {
    const registered = getValue(family, "abanditswe") - getValue(family, "abafiteImpamvu") - getValue(family, "abarwayi");
    if (registered === 0) return "0%";

    // Calculate the average percentage across all features for this family
    const totalPercentage = features
      .filter((feature) => feature !== "abanditswe" && feature !== "abashyitsi" && feature !== "abarwayi" && feature !== "abafiteImpamvu")  // Exclude "abanditswe" itself
      .reduce((sum, feature) => sum + (getValue(family, feature as keyof AttendanceData) / registered) * 100, 0);

    const avgPercentage = totalPercentage / (features.length - 4); // Exclude abanditswe from count
    return avgPercentage.toFixed(2) + "%";
  });


  const overallPercentage = families.length
    ? (
      familyPercentages.reduce((sum, percentage) => sum + parseFloat(percentage), 0) /
      families.length
    ).toFixed(2) + "%"
    : "0%";








  // Download Attendance Report as PDF
  const downloadPDF = () => {

    const doc = new jsPDF();
    doc.text(`Attendance Report - ${date}`, 20, 10);

    // Function to format the feature names
    const formatFeature = (feature: string) => {
      return feature
        .replace(/([A-Z])/g, ' $1') // Add a space before each uppercase letter
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
    };

    const tableData: any[] = [];
    const headers = ["Feature", ...families, "Total"];

    features.forEach((feature) => {
      // Fetch the values first
      const row = [
        formatFeature(feature), // Format the feature name after getting the values
        ...families.map((family) => getValue(family, feature as keyof AttendanceData)),
        calculateTotal(feature as keyof AttendanceData),
      ];
      tableData.push(row);
    });

    // Calculate percentage for each family (same as before)
    const percentageRow = [
      "Percentage",
      ...familyPercentages.map((percentage) => percentage.toString()), // Just return the percentage value as string
      overallPercentage.toString(), // Just return overall percentage as string
    ];

    tableData.push(percentageRow);

    // Generate PDF table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      didParseCell: function (data) {
        if (data.row.index === tableData.length - 1 && data.column.index > 0) {
          // Get the raw text from the cell
          const percentageRaw = data.cell.raw;

          // Handle the percentage if it's a number or string (ensure parsing)
          const percentage = typeof percentageRaw === 'string'
            ? parseFloat(percentageRaw.replace("%", ""))
            : 0;

          // Apply red color if percentage is below 50
          if (percentage < 50) {
            data.cell.styles.textColor = [255, 0, 0]; // Red color
          }
        }
      },
    });

    doc.save(`Attendance_Report_${date}.pdf`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  const familyTotals: Record<string, number> = {};

  features.forEach((feature) => {
    families.forEach((family) => {
      const value = getValue(family, feature as keyof AttendanceData);
      familyTotals[family] = (familyTotals[family] || 0) + value;
    });
  });



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
        <Button
          onClick={downloadPDF}
          className="px-4 py-5  text-white rounded"
        >
          Download PDF
        </Button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
            {families.map((family) => (
              <th key={family} className="border border-gray-300 px-4 py-2">{family}</th>
            ))}
            <th className="border border-gray-300 px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature}>
              <td className="border border-gray-300 px-4 py-2">{formatFeatureName(feature)}</td>
              {families.map((family) => (
                <td key={family} className="border border-gray-300 px-4 py-2 text-center">
                  {getValue(family, feature as keyof AttendanceData)}
                </td>
              ))}
              <td className="border border-gray-300 px-4 py-2 text-center">{calculateTotal(feature as keyof AttendanceData)}</td>
            </tr>
          ))}

          {/* Percentage Row */}
          <tr className="bg-gray-200 font-bold">
            <td className="border  border-gray-300 px-4 py-2">Percentage</td>
            {familyPercentages.map((percentage, index) => {
              const numericPercentage = parseFloat(percentage);
              return (
                <td
                  key={index}
                  className={`border text-center  border-gray-300 px-4 py-2 ${numericPercentage < 50 ? "text-red-500" : ""
                    }`}
                >
                  {percentage}
                </td>
              );
            })}
            <td
              className={`border border-gray-300 px-4 py-2  ${families.length > 0 &&
                parseFloat(
                  (familyPercentages.reduce(
                    (sum, percentage) => sum + parseFloat(percentage),
                    0
                  ) / families.length
                  ).toFixed(2)
                ) < 50
                ? "text-red-500"
                : ""
                }`}
            >
              {families.length > 0
                ? (
                  familyPercentages.reduce(
                    (sum, percentage) => sum + parseFloat(percentage),
                    0
                  ) / families.length
                ).toFixed(2) + "%"
                : "0%"}
            </td>
          </tr>


        </tbody>
      </table>

      <div className="mt-4 flex space-x-4 justify-end">

        <Button
          onClick={() => setIsDialogOpen(false)}
          className="px-4 py-5  text-white rounded  w-[10%]"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default AttendanceReport;
