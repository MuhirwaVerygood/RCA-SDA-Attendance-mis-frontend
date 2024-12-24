import React from 'react';
import Notification from "../../app/constants/Notification.svg";
import Customer from "../../app/constants/Customer.svg";
import Image from 'next/image';

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-[40px] overflow-hidden bg-soft-white flex items-center justify-between shadow-custom z-50 pl-[2%] pr-[2%]">
            <div className="flex items-center">
                <span className="text-black font-semibold">RCA SDA ATTENDANCE MIS</span>
            </div>

            <div className="flex items-center space-x-4 pr-4">
                <Image src={Notification} alt="Notification Icon" className="w-8 h-8 cursor-pointer" />
                <Image src={Customer} alt="Customer Icon" className="w-8 h-8 cursor-pointer" />
            </div>
        </header>
    );
};

export default Navbar;
