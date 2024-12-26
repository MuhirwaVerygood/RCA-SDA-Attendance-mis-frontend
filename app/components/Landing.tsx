"use client"
import React, { useEffect, useState } from "react";
import ChartArrowRise from "../constants/ChartArrowRise.svg";
import Image from "next/image";
import axios from "axios";
import { Family } from "./Families";
import Cookie from "js-cookie";

const Landing = () => {
    const [families, setFamilies] = useState<Family[]>([]);
    const [totalMembers, setTotalMembers] = useState<number>(0); // State to store the total members

    // Function to get families and calculate the total number of members
    const getFamilies = async () => {
        try {
            const res = await axios.get("http://localhost:3500/families", {
                headers: {
                    Authorization: `Bearer ${Cookie.get("token")}`
                }
            });

            // Mapping the family data and extracting the necessary fields
            const familyData = res.data.map((family: any) => ({
                id: family.id,
                name: family.familyName,
                father: family.father,
                mother: family.mother,
                members: family.members,
                kids: family.members.length,
            }));

            // Calculate total number of members by summing the lengths of the 'members' array
            const totalMembersCount = familyData.reduce((acc: number, family: any) => {
                return acc + family.members.length;
            }, 0);

            // Set the total number of members
            setTotalMembers(totalMembersCount);

            // Sort families by id and update the state
            const sortedFamilies: Family[] = familyData.sort(
                (a: Family, b: Family) => a.id - b.id
            );
            setFamilies(sortedFamilies);
        } catch (error) {
            console.error("Error fetching families:", error);
        }
    };

    useEffect(() => {
        getFamilies();
    }, []);

    console.log(families);

    return (
        <div className="flex flex-row w-[70%] pt-[4%] mx-auto space-x-6">
            <div className="flex flex-col w-[25%] bg-soft-white py-4 shadow-second">
                <span className="self-center text-[30px] font-bold">{totalMembers}</span>
                <p className="self-center font-semibold">Church Members</p>
            </div>
            <div className="flex flex-col w-[25%] bg-soft-white py-4 shadow-second">
                <span className="self-center text-[30px] font-bold">{families.length}</span>
                <p className="self-center font-semibold">Families</p>
            </div>
            <div className="flex flex-col w-[25%] bg-soft-white py-4 shadow-second">
                <div className="flex flex-row self-center">
                    <span className="self-center text-[30px] font-bold">35</span>
                    <Image src={ChartArrowRise} alt="Chart Arrow Rise" className="h-6 w-6 mt-[4px] " />
                </div>
                <p className="self-center font-semibold">Active Members</p>
            </div>
        </div>
    );
};

export default Landing;
