import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { ProfileProperties } from "./Navbar";

interface InputFieldProps {
    label: string;
    value: string;
    fieldName: string;
    setProfileData: React.Dispatch<React.SetStateAction<ProfileProperties>>,
}

const ProfileInputField: React.FC<InputFieldProps> = ({ label, value, setProfileData ,fieldName }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData, 
            [name]: value
        }))
    }
    return (
        <div className="flex flex-col space-y-2">
            <Label>{label}</Label>
            <Input
                name={fieldName}
                value={value}
                onChange={handleInputChange}
                className="text-gray-400 focus:text-black"
            />
        </div>
    )
}
   
;

export default ProfileInputField;