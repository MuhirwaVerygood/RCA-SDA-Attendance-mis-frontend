"use client";
import React, { useEffect, useState } from "react";
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { authorizedAPI } from "../constants/files/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProfileInputField from "./ProfileInputField";

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
    isFather: boolean;
    isMother: boolean;
    post: string;
    profileName: string;
    image: string;
    family: string | null;
}

export interface ProfileProperties{
    username: string
    profileName: string
    post: string, 
    image: string
}


const Navbar = () => {
    const [openEditProfite, setOpenEditProfileDialog] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileProperties>({ username: "", profileName: "", post: "" , image:""})
    const [userData, setUserData] = useState<UserResponse | null>(null);


    useEffect(() => {

        const savedUserString = localStorage.getItem("loggedInUser");
        const savedUser = savedUserString ? JSON.parse(savedUserString) : null;
        setUserData(savedUser);

        setProfileData((prevData) => ({
            ...prevData, username: savedUser.username || "", profileName: savedUser.profileName || "",
            post: savedUser.post,
            image: savedUser.image || ""
        }))
    }, [])

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



    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.type === "image/jpeg" || file.type === "image/png") {

            const uploadPreset = "RCA-SDA Profile preset";
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);

            formData.append("cloud_name", "dmx4rq1cv")
            fetch(`https://api.cloudinary.com/v1_1/dmx4rq1cv/image/upload`, {
                method: "post",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    setProfileData((prevData) => ({
                        ...prevData, image: data.secure_url 
                    }))
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            return;
        }
    }


   
    
    const handleSubmit = async(e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
                
        try {
            const res = await authorizedAPI.put("/users/profile", profileData);
            if (res.status == 200) {
                localStorage.setItem("loggedInUser", JSON.stringify(res.data))
            }

            setOpenEditProfileDialog(false)
            window.location.reload()
        } catch (error) {
            console.log(error);           
        }
        
    }


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
                                <AvatarImage src={userData?.image} />
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
                                                Profile Picture
                                            </DialogTitle>     
                                        </DialogHeader>
                                        
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <div className="flex flex-row items-center justify-between">
                                                <Avatar className="flex">
                                                    <AvatarImage src={profileData.image} />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <div className="flex gap-5 items-center">
                                                    <div>
                                                        <label htmlFor="upload-button" className="cursor-pointer bg-black  text-white py-2 px-4 rounded">
                                                            Change Picture
                                                        </label>
                                                        <input
                                                            id="upload-button"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleFileUpload}
                                                        />
                                                    </div>

                                                    <Button className=" bg-[#D3DDE7] text-red-600">Delete Picture</Button>
                                                </div>
                                            </div>

                                            <ProfileInputField label="Profile name" value={profileData.profileName} setProfileData={setProfileData} fieldName="profileName" />
                                            <ProfileInputField label="Username" value={profileData.username } setProfileData={setProfileData} fieldName="username" />
                                            <ProfileInputField label="Post in Church" value={profileData.post} setProfileData={setProfileData} fieldName="post" />
                                            <div className="flex justify-end">
                                                <Button className="w-[30%]" type="submit" >Save changes</Button>
                                            </div>
                                        </form>
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
