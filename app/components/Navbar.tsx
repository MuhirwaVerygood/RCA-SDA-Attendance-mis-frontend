import React from "react";
import Notification from "../../app/constants/svgs/Notification.svg";
import Customer from "../../app/constants/svgs/Customer.svg";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, ChevronsUpDown } from "lucide-react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@radix-ui/react-menubar";

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 z-50 w-full h-[50px] bg-soft-white shadow-custom flex justify-between items-center px-[2%]">
            <div className="flex items-center">
                <span className="text-black font-semibold">RCA SDA ATTENDANCE MIS</span>
            </div>
            <div className="flex items-center space-x-4">
                <Image
                    src={Notification}
                    alt="Notification Icon"
                    className="w-10 h-10 cursor-pointer"
                />
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>Profile</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>About</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Logout</MenubarItem>
                            <MenubarSeparator />
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </header>
    );
};

export default Navbar;
