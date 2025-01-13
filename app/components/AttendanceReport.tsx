'use client'
import React, { useEffect, useState } from "react";
import Calendar from "../constants/svgs/Calendar.svg";
import ChurchLogo from "../constants/svgs/ChurchLogo.svg";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Image as PdfImage } from "@react-pdf/renderer"
import Image from "next/image";
import { authorizedAPI } from "../constants/files/api";

// Define types for the structure of each row in the attendance data
interface AttendanceRow {
  feature: string;
  ebenezer: string;
  salvSibs: string;
  jehovahNissi: string;
  church: number | string;
  ebenezerPercentage?: number;
  salvSibsPercentage?: number;
  jehovahNissiPercentage?: number;
  churchPercentage?: number;
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

const AttendanceReport = ({ date, setIsDialogOpen }: { date: string | null, setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
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
    const fetchAttendanceData = async () => {
      try {
        const response = await authorizedAPI.get(`http://localhost:3500/attendances/${date}`)
        const data: AttendanceData[] = await response.data;

        // Features to include in percentage calculation
        const featuresForPercentage = [
          "abaje",
          "abasuye",
          "abasuwe",
          "abafashije",
          "abafashijwe",
          "abatangiyeIsabato",
          "abarwayi",
          "abafiteImpamvu",
        ];

        const calculateChurchPercentage = (): number => {
          // Get the percentages for all families
          const ebenezerPercentage = Number(calculateFamilyPercentage("Ebenezer"));
          const salvSibsPercentage = Number(calculateFamilyPercentage("Salvation Siblings"));
          const jehovahNissiPercentage = Number(calculateFamilyPercentage("Jehovah-Nissi Family"));

          // Calculate the church percentage
          const churchPercentage = (ebenezerPercentage + salvSibsPercentage + jehovahNissiPercentage) / 3;
          return Number(churchPercentage.toFixed(2)); // Return as a string with two decimal points
        };


        // Helper function to calculate percentage
        const calculateFamilyPercentage = (familyName: string) => {
          let totalPercentage = 0;
          let validFeaturesCount = 0;

          featuresForPercentage.forEach((feature) => {
            const featureValue = Number(findValue(data, familyName, feature)) || 0;
            const abanditsweValue = Number(findValue(data, familyName, "abanditswe")) || 1; // Avoid division by zero

            if (abanditsweValue > 0) {
              const percentage = (featureValue / abanditsweValue) * 100;
              totalPercentage += percentage;
              validFeaturesCount++;
            }
          });

          // Return the average percentage for the family
          return validFeaturesCount > 0 ? (totalPercentage / validFeaturesCount).toFixed(2) : "0";
        };

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
          {
            feature: "Percentages",
            ebenezer: `${calculateFamilyPercentage("Ebenezer")}%`,
            salvSibs: `${calculateFamilyPercentage("Salvation Siblings")}%`,
            jehovahNissi: `${calculateFamilyPercentage("Jehovah-Nissi Family")}%`,
            church: `${calculateChurchPercentage()}%`
          },
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





  const styles = StyleSheet.create({
    page: {
      padding: 10,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    churchLogo: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
    },
    table: {
      marginTop: 20,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    tableCell: {
      padding: 5,
      border: '1px solid #000',
      textAlign: 'center',
    },
  });

  const AttendancePDF = ({ attendanceData, date }: { attendanceData: AttendanceRow[], date: string | null }) => {
    return (
      <Document>
        <Page style={styles.page}>
          {/* Header Section with Church Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <PdfImage src={ChurchLogo} style={styles.churchLogo} />
              <Text style={styles.title}>RCA SDA Attendance Report</Text>
            </View>
            <Text style={styles.title}>Date: {date}</Text>
          </View>

          {/* Table Headers */}
          <View style={styles.table}>
            <Text style={styles.tableCell}>FEATURES</Text>
            <Text style={styles.tableCell}>EBENEZER</Text>
            <Text style={styles.tableCell}>SALV SIBS</Text>
            <Text style={styles.tableCell}>JEHOVAH-NISSI</Text>
            <Text style={styles.tableCell}>CHURCH</Text>
          </View>

          {/* Table Rows */}
          {attendanceData.map((row, index) => (
            <View style={styles.table} key={index}>
              <Text style={styles.tableCell}>{row.feature}</Text>
              <Text style={styles.tableCell}>{row.ebenezer}</Text>
              <Text style={styles.tableCell}>{row.salvSibs}</Text>
              <Text style={styles.tableCell}>{row.jehovahNissi}</Text>
              <Text style={styles.tableCell}>{row.church}</Text>
            </View>
          ))}
        </Page>
      </Document>
    );
  };



  return (
    <div>
      <PDFDownloadLink
        document={<AttendancePDF attendanceData={attendanceData} date={date} />}
        fileName={`attendance-report-for-${date}.pdf`}
        className="flex justify-end mb-3"
      >
        <Button >Download</Button>
      </PDFDownloadLink>



      <div className="bg-soft-white w-[100%] mx-auto px-6 py-5 flex flex-col gap-6">
        {/* Header */}
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
                <span
                  className={`flex justify-center ${row.feature === "Percentages" ? "font-bold" : ""}`}
                >
                  {row.feature}
                </span>
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

        <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>

      </div>
    </div>
  );
};

export default AttendanceReport;
