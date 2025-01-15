"use client";
import React, { useState } from "react";
import Notification from "../../app/constants/svgs/Notification.svg";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@radix-ui/react-menubar";
import SignOut from "../constants/svgs/SignOut.svg";
import UserLogo from "../constants/svgs/User.svg";
import About from "../constants/svgs/About.svg";
import Profile from "../constants/svgs/Profile.svg";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { authorizedAPI } from "../constants/files/api";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [openEditProfite, setOpenEditProfileDialog] = useState<boolean>(false);

    const handleLogout = async () => {
        try {
            const res = await authorizedAPI.get("/auth/logout");
            if (res.status == 200) {
                router.replace("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const router = useRouter();

    return (
        <header className="fixed top-0 left-0 z-50 w-full h-[50px] bg-soft-white shadow-custom flex justify-between items-center px-[2%]">
            {/* Left Section: App Title */}
            <div className="flex items-center">
                <span className="text-black font-semibold">
                    RCA SDA ATTENDANCE MIS
                </span>
            </div>

            {/* Right Section: Notification and User Menu */}
            <div className="flex items-center space-x-4 mr-5">
                {/* Notification Icon */}
                <Image
                    src={Notification}
                    alt="Notification Icon"
                    className="w-10 h-10 cursor-pointer"
                />

                {/* User Menu */}
                <Menubar className="hover:outline-none active:outline-none focus:outline-none">
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Avatar className="flex">
                                <AvatarImage src={Profile.src} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </MenubarTrigger>
                        <MenubarContent className="bg-soft-white px-8 space-y-3 py-2 mr-10 mt-5 border-[0.5px] border-[#CED4DA] rounded-md shadow-sm">
                            {/* Profile Option */}
                            <div className="flex items-center gap-2">
                                <Image
                                    src={UserLogo}
                                    alt="Profile Icon"
                                    className="h-4 w-4"
                                />
                              
                                <Dialog
                                    open={openEditProfite}
                                    onOpenChange={(open) => setOpenEditProfileDialog(open)}
                                >
                                    <DialogTrigger>
                                        <MenubarItem
                                            className="cursor-pointer hover:outline-none"
                                            onClick={(event) => {
                                                event.preventDefault(); 
                                                setOpenEditProfileDialog(true); 
                                            }}
                                        >
                                            Profile
                                        </MenubarItem>

                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Are you absolutely sure?
                                            </DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This
                                                will permanently delete your account
                                                and remove your data from our
                                                servers.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <p>Hello world</p>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <hr />

                            {/* About Option */}
                            <div className="flex items-center gap-2">
                                <Image
                                    src={About}
                                    alt="About Icon"
                                    className="h-4 w-4"
                                />
                                <MenubarItem className="cursor-pointer hover:outline-none">
                                    About
                                </MenubarItem>
                            </div>
                            <hr />

                            {/* Logout Option */}
                            <div className="flex items-center gap-2">
                                <Image
                                    src={SignOut}
                                    alt="Logout Icon"
                                    className="h-4 w-4"
                                />
                                <MenubarItem
                                    className="cursor-pointer hover:outline-none"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </MenubarItem>
                            </div>

                            <MenubarSeparator />
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </header>   
    );
};

export default Navbar;
