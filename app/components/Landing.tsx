"use client"
import React, { useEffect, useState } from "react";
import ChartArrowRise from "../constants/svgs/ChartArrowRise.svg";
import Image from "next/image";
import { Family } from "./Families";
import { getFamilies } from "../constants/files/Constants";
import { useFamilies } from "../contexts/FamiliesContext";

const Landing = () => {
    const { families, totalMembers} = useFamilies();
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
