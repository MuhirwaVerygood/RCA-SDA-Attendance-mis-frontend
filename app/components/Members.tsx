"use client";

import React, { useEffect, useState } from "react";
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
import { Family } from "./Families";
import axios from "axios";
import Cookie from "js-cookie";

const Members = () => {
    const [families, setFamilies] = useState<Family[]>([]);
    const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false); // New state for edit dialog
    const [newMember, setNewMember] = useState({ name: "", class: "" });
    const [editingMember, setEditingMember] = useState<any | null>(null); // State for selected member to edit

    const getFamilies = async () => {
        try {
            const res = await axios.get("http://localhost:3500/families", {
                headers: {
                    Authorization: `Bearer ${Cookie.get("token")}`,
                },
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

    const selectedFamily: any = families.find((family) => family.id === selectedFamilyId);

    const handleDeleteMember = async (familyId: number, memberId: number) => {
        try {
            await axios.delete(`http://localhost:3500/members/member/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${Cookie.get("token")}`,
                },
            });

            const updatedMembers = selectedFamily.members.filter(
                (member: any) => member.id !== memberId
            );
            const updatedFamily = { ...selectedFamily, members: updatedMembers };
            setFamilies((prev) =>
                prev.map((family) =>
                    family.id === updatedFamily.id ? updatedFamily : family
                )
            );
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    };

    const handleEditMember = async (familyId: number, member: any) => {
        setEditingMember(member); // Set member to edit
        setOpenEditDialog(true); // Open the edit dialog
    };

    const handleUpdateMember = async () => {
        
        if (editingMember ) {
            console.log("Reached here");

            const updatedMemberData = {
                name: newMember.name,
                class: newMember.class,
            };

            try {
                const res = await axios.put(
                    `http://localhost:3500/members/member/${editingMember.id}`,
                    updatedMemberData,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookie.get("token")}`,
                        },
                    }
                );

                if (res.status === 200) {
                    // Update the member in the state
                    const updatedFamily = {
                        ...selectedFamily,
                        members: selectedFamily.members.map((member: any) =>
                            member.id === editingMember.id
                                ? { ...member, ...updatedMemberData }
                                : member
                        ),
                    };

                    setFamilies((prev) =>
                        prev.map((family) =>
                            family.id === updatedFamily.id ? updatedFamily : family
                        )
                    );
                    setOpenEditDialog(false);
                    setEditingMember(null); // Clear the editing member
                    getFamilies()
                }
            } catch (error) {
                console.error("Error editing member:", error);
            }
        }
    };

    const handleAddMember = async () => {
        if (selectedFamily && newMember.name && newMember.class) {
            const newMemberData = {
                name: newMember.name,
                class: newMember.class,
            };

            try {
                const res = await axios.post(
                    `http://localhost:3500/members/${selectedFamily.id}`,
                    newMemberData,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookie.get("token")}`,
                        },
                    }
                );

                if (res.status === 201) {
                    const updatedFamily = {
                        ...selectedFamily,
                        members: [...selectedFamily.members, res.data],
                    };
                    setFamilies((prev) =>
                        prev.map((family) =>
                            family.id === updatedFamily.id ? updatedFamily : family
                        )
                    );
                    setNewMember({ name: "", class: "" });
                    setOpenAddDialog(false);
                }
            } catch (error) {
                console.error("Error adding member:", error);
            }
        }
    };

    return (
        <div className="flex flex-col pl-[5%] w-full pt-[5%]">
            <span className="font-semibold text-[25px] mb-[2%]">Family Members</span>

            <NavigationMenu className="bg-soft-white">
                <NavigationMenuList className="flex">
                    {families.map((family) => (
                        <NavigationMenuItem key={family.id}>
                            <NavigationMenuTrigger onClick={() => setSelectedFamilyId(family.id)}>
                                {family.name}
                            </NavigationMenuTrigger>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {selectedFamily && (
                <div className="mt-8 w-[90%]">
                    <h3 className="text-xl font-semibold mb-4">Members of {selectedFamily.name}</h3>
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
                            {selectedFamily.members?.map((member: any, index: number) => (
                                <TableRow key={member.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>{member.class}</TableCell>
                                    <TableCell className="flex gap-4">
                                        <Image
                                            className="h-6 w-6 cursor-pointer"
                                            src={Edit}
                                            alt="Edit member"
                                            onClick={() => handleEditMember(selectedFamily.id, member)}
                                        />
                                        <Image
                                            className="h-6 w-6 cursor-pointer"
                                            src={Delete}
                                            alt="Delete member"
                                            onClick={() => handleDeleteMember(selectedFamily.id, member.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Add Member Dialog */}
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
                                <Button type="submit" className="w-full mt-4">
                                    Add Member
                                </Button>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Edit Member Dialog */}
                    <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                        <AlertDialogTrigger asChild>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <h3 className="font-semibold text-xl mb-4 text-center">Edit Member Details</h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateMember();
                                }}
                                className="flex flex-col gap-4"
                            >
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={newMember.name || editingMember?.name || ""}
                                    onChange={(e) =>
                                        setNewMember({ ...newMember, name: e.target.value })
                                    }
                                    required
                                />
                                <Input
                                    type="text"
                                    placeholder="Class"
                                    value={newMember.class || editingMember?.class || ""}
                                    onChange={(e) =>
                                        setNewMember({ ...newMember, class: e.target.value })
                                    }
                                    required
                                />
                                <Button type="submit" className="w-full mt-4" >
                                    Update Member
                                </Button>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
    );
};

export default Members;
