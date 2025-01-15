import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface InputFieldProps {
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => (
    <div className="flex flex-col space-y-2">
        <Label>{label}</Label>
        <Input
            value={value}
            onChange={onChange}
            className="text-gray-400 focus:text-black"
        />
    </div>
);

export default ProfileInputField;