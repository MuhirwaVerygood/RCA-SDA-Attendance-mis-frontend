"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Edit from "../constants/svgs/Edit.svg";
import Delete from "../constants/svgs/Delete.svg";
import { Kid, } from "@/lib/features/FamilySlice";
import {  handleAddFamily, handleDeleteFamily, handleSaveChanges, resetFamilyForm } from "../constants/files/Constants";
import { useFamilies } from "../contexts/FamiliesContext";
export interface Family {
    id: number;
    name: string;
    father: string;
    mother: string;
    members?: Kid[];
    kids: number;
}


export interface FamilyResponseStructure {
    id: number,
    familyName: string,
    father: string,
    mother: string,
    members: []
}

const Families = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [familyForm, setFamilyForm] = useState<Family>({
        id: 0,
        name: "",
        father: "",
        mother: "",
        kids: 0,
    });
    const { families, setTotalMembers, setFamilies } = useFamilies();
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFamilyForm({ ...familyForm, [name]: value });
    };


    const handleEditClick = (family: Family) => {
        setSelectedFamily(family);
        setFamilyForm(family);
        setOpenEditDialog(true);
    };


    const handleDeleteClick = (family: Family) => {
        setSelectedFamily(family);
        setOpenDeleteDialog(true);
    };




    return (
        <div className="flex flex-col pl-[5%] w-full pt-[5%] overflow-auto">
            <span className="font-semibold text-[25px] mb-[2%]">Families</span>
            <Table className="w-[90%] bg-soft-white mb-[5%]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] font-bold text-black">#</TableHead>
                        <TableHead className="font-semibold text-black">Family Name</TableHead>
                        <TableHead className="font-semibold text-black">Father&apos;s Name</TableHead>
                        <TableHead className="font-semibold text-black">Mother&apos;s Name</TableHead>
                        <TableHead className="font-semibold text-black text-center">
                            Number of Children
                        </TableHead>
                        <TableHead className="font-semibold text-black">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {families.map((family: Family) => (
                        <TableRow key={family.id}>
                            <TableCell>{family.id}</TableCell>
                            <TableCell>{family.name}</TableCell>
                            <TableCell>{family.father}</TableCell>
                            <TableCell>{family.mother}</TableCell>
                            <TableCell className="text-center">{family.kids}</TableCell>
                            <TableCell className="flex gap-4">
                                <Image
                                    className="h-6 w-6 cursor-pointer"
                                    src={Edit}
                                    alt="Edit family"
                                    onClick={() => handleEditClick(family)}
                                />
                                <Image
                                    className="h-6 w-6 cursor-pointer"
                                    src={Delete}
                                    alt="Delete family"
                                    onClick={() => handleDeleteClick(family)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Add Family Dialog */}
            <AlertDialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                <AlertDialogTrigger asChild>
                     <Button className="w-[15%]">Add Family</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <h3 className="font-semibold text-xl mb-4 text-center">Add a New Family</h3>
                    <div className="flex flex-col gap-4">
                        <Input
                            type="text"
                            name="name"
                            value={familyForm.name}
                            onChange={handleFormChange}
                            placeholder="Family Name"
                        />
                        <Input
                            type="text"
                            name="father"
                            value={familyForm.father}
                            onChange={handleFormChange}
                            placeholder="Father's Name"
                        />
                        <Input
                            type="text"
                            name="mother"
                            value={familyForm.mother}
                            onChange={handleFormChange}
                            placeholder="Mother's Name"
                        />

                        <Button onClick={() => setOpenAddDialog(false)}>Close</Button>
                        <Button onClick={() => handleAddFamily(familyForm, setOpenAddDialog, setFamilies, setTotalMembers)}>Add Family</Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Family Dialog */}
            <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <AlertDialogContent>
                    <h3 className="font-semibold text-xl mb-4 text-center">Edit Family</h3>
                    <div className="flex flex-col gap-4">
                        <Input
                            type="text"
                            name="name"
                            value={familyForm.name}
                            onChange={handleFormChange}
                            placeholder="Family Name"
                        />
                        <Input
                            type="text"
                            name="father"
                            value={familyForm.father}
                            onChange={handleFormChange}
                            placeholder="Father's Name"
                        />
                        <Input
                            type="text"
                            name="mother"
                            value={familyForm.mother}
                            onChange={handleFormChange}
                            placeholder="Mother's Name"
                        />
                        <Input
                            type="number"
                            name="kids"
                            value={familyForm.kids}
                            onChange={handleFormChange}
                            placeholder="Number of Children"
                        />
                        <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                        <Button onClick={() => handleSaveChanges(familyForm, selectedFamily, families, setFamilies, setFamilyForm, setOpenEditDialog)}>Save Changes</Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Family Dialog */}
            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogContent>
                    <h3 className="font-semibold text-xl text-center text-red-500">
                        Delete {selectedFamily?.name}
                    </h3>
                    <p className="text-center mt-4">
                        Are you sure you want to delete {selectedFamily?.name}?
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDeleteFamily(selectedFamily, families, setFamilies, setSelectedFamily, setOpenDeleteDialog)}
                        >
                            Delete
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Families;
