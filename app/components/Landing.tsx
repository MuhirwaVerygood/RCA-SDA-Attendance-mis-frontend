"use client"
import React, { useEffect, useState } from "react";
import ChartArrowRise from "../constants/svgs/ChartArrowRise.svg";
import Image from "next/image";
import { useFamilies } from "../contexts/FamiliesContext";
import { Skeleton } from "@/components/ui/skeleton";
import { FamiliesPieChart } from "./FamiiliesPieChart";
import FamiliesPresenceGraph, { Attendance } from "./FamiliesPresenceGraph";
import { Family } from "./Families";

const Landing = () => {
    const { families, totalMembers, totalActiveMembers } = useFamilies();
    const [loading, setLoading] = useState(true)


    console.log(families);
    


      useEffect(() => {
        // Simulate a loading delay
        const timer = setTimeout(() => {
          setLoading(false);
        }, 2000); // Adjust the delay as needed
        return () => clearTimeout(timer);
      }, []);
    
    

const transformFamiliesData = (
  families: Family[],
): {
  id: number;
  familyName: string;
  attendances: Attendance[];
}[] => {
  return families.map((family) => ({
    id: family.id,
    familyName: family.familyName || family.name, // Ensure familyName is always present
    attendances:
      family.attendances?.map((attendance) => ({
        id: attendance?.id || 0, // Ensure ID is always present
        abanditswe: attendance?.abanditswe || 0, // Default values for missing fields
        abaje: attendance?.abaje || 0,
        date: attendance?.date || '', // Ensure date is always a string
      })) || [], // Default to an empty array if attendances is undefined
  }));
};
    
        

     
    const transformedFamilies = transformFamiliesData(families);
    
   
    
    return (
      <div className="flex flex-col">
        {loading ? (
          <Skeleton className="w-[70%]  mx-auto h-[20vh]" />
        ) : (
          <div className="flex flex-row w-[70%]  mx-auto space-x-6">
            <div className="flex flex-col w-[25%] bg-soft-white py-4 shadow-second">
              <span className="self-center text-[30px] font-bold">
                {totalMembers}
              </span>
              <p className="self-center font-semibold">Church Members</p>
            </div>
            <div className="flex flex-col w-[25%] bg-soft-white py-4 shadow-second">
              <span className="self-center text-[30px] font-bold">
                {families.length}
              </span>
              <p className="self-center font-semibold">Families</p>
            </div>
            <div className="flex flex-col w-[25%] bg-soft-white py-4 shadow-second">
              <div className="flex flex-row self-center">
                <span className="self-center text-[30px] font-bold">
                  {totalActiveMembers}
                </span>
                <Image
                  src={ChartArrowRise}
                  alt="Chart Arrow Rise"
                  className="h-6 w-6 mt-[4px] "
                />
              </div>
              <p className="self-center font-semibold">Active Members</p>
            </div>
          </div>
        )}

        <div className="w-full pl-[2%] pt-[4%] h-[50vh] flex justify-between">
          {/* Skeleton for FamiliesPresenceGraph */}
          {loading ? (
            <Skeleton className="w-[70%] mt-[3%] h-[calc(100vh-36vh)]" />
          ) : (
            <FamiliesPresenceGraph
              families={transformedFamilies}
              totalMembers={totalMembers}
            />
          )}
          {/* Skeleton for FamiliesPieChart */}
          {loading ? (
            <Skeleton className="w-[25%] mr-[1%] h-full  mt-[3%]" />
          ) : (
            <FamiliesPieChart />
          )}
        </div>
      </div>
    );
};

export default Landing;
