import React from "react";
import Notification from "../../app/constants/svgs/Notification.svg";
import Customer from "../../app/constants/svgs/Customer.svg";
import Image from "next/image";

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 z-50 w-full h-[40px] bg-soft-white shadow-custom flex justify-between items-center px-[2%]">
            <div className="flex items-center">
                <span className="text-black font-semibold">RCA SDA ATTENDANCE MIS</span>
            </div>
            <div className="flex items-center space-x-4">
                <Image
                    src={Notification}
                    alt="Notification Icon"
                    className="w-8 h-8 cursor-pointer"
                />
                <Image
                    src={Customer}
                    alt="Customer Icon"
                    className="w-8 h-8 cursor-pointer"
                />
            </div>
        </header>
    );
};

export default Navbar;
