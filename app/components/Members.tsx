"use client";

import React, { useState } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import Edit from "../constants/Edit.svg";
import Delete from "../constants/Delete.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Member {
    id: number;
    name: string;
    class: string;
}

const Members = () => {
    const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
    const [families, setFamilies] = useState<string[]>(["Ebenezer", "Salvation Siblings", "Jehovah-Nissi"]);
    const [members, setMembers] = useState<{
        [key: string]: Member[];
    }>({
        Ebenezer: [
            { id: 1, name: "John Doe", class: "Class A" },
            { id: 2, name: "Jane Doe", class: "Class B" },
        ],
        "Salvation Siblings": [
            { id: 3, name: "Albert Smith", class: "Class C" },
            { id: 4, name: "Mary Johnson", class: "Class D" },
        ],
        "Jehovah-Nissi": [
            { id: 5, name: "Chris Williams", class: "Class E" },
            { id: 6, name: "Lucy Brown", class: "Class F" },
        ],
    });

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newMember, setNewMember] = useState({ name: "", class: "" });

    const handleDeleteMember = (familyName: string, memberId: number) => {
        setMembers((prevMembers) => {
            const updatedFamilyMembers = prevMembers[familyName].filter(
                (member) => member.id !== memberId
            );
            return { ...prevMembers, [familyName]: updatedFamilyMembers };
        });
    };

    const handleEditMember = (familyName: string, member: Member) => {
        console.log("Editing member:", familyName, member);
    };

    const handleAddMember = () => {
        if (selectedFamily && newMember.name && newMember.class) {
            setMembers((prevMembers) => {
                const updatedFamilyMembers = [
                    ...prevMembers[selectedFamily],
                    { id: Date.now(), name: newMember.name, class: newMember.class },
                ];
                return { ...prevMembers, [selectedFamily]: updatedFamilyMembers };
            });
            setNewMember({ name: "", class: "" });
            setOpenAddDialog(false);
        }
    };

    return (
        <div className="flex flex-col pl-[5%] w-full pt-[5%]">
            <span className="font-semibold text-[25px] mb-[2%]">Family Members</span>

            <NavigationMenu className="bg-soft-white ">
                <NavigationMenuList className="flex">
                    {families.map((family, index) => (
                        <NavigationMenuItem key={index}>
                            <NavigationMenuTrigger onClick={() => setSelectedFamily(family)}>
                                {family}
                            </NavigationMenuTrigger>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {selectedFamily && (
                <div className="mt-8 w-[90%]">
                    <h3 className="text-xl font-semibold mb-4">Members of {selectedFamily}</h3>
                    <Table className="w-full bg-soft-white">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] font-bold text-black">#</TableHead>
                                <TableHead className="font-semibold text-black">Names</TableHead>
                                <TableHead className="font-semibold text-black">Class</TableHead>
                                <TableHead className="font-semibold text-black">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members[selectedFamily].map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.id}</TableCell>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>{member.class}</TableCell>
                                    <TableCell className="flex gap-4">
                                        <Image
                                            className="h-6 w-6 cursor-pointer"
                                            src={Edit}
                                            alt="Edit member"
                                            onClick={() => handleEditMember(selectedFamily, member)}
                                        />
                                        <Image
                                            className="h-6 w-6 cursor-pointer"
                                            src={Delete}
                                            alt="Delete member"
                                            onClick={() => handleDeleteMember(selectedFamily, member.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <AlertDialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                        <AlertDialogTrigger asChild>
                            <Button className="mt-4">Add a Member</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <h3 className="font-semibold text-xl mb-4 text-center">Add a New Member</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddMember();
                                }}
                                className="flex flex-col gap-4"
                            >
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                    required
                                />
                                <Input
                                    type="text"
                                    placeholder="Class"
                                    value={newMember.class}
                                    onChange={(e) => setNewMember({ ...newMember, class: e.target.value })}
                                    required
                                />
                                <div className="flex justify-end gap-4">
                                    <Button type="button" onClick={() => setOpenAddDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Add</Button>
                                </div>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
    );
};

export default Members;
