"use client"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table'
import React, { useEffect, useState } from 'react'
import Edit from "../constants/Edit.svg"
import Delete from "../constants/Delete.svg"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import { Kid, setFamily } from '@/lib/features/FamilySlice'

interface Family {
    id: number,
    name: string
    father: string
    mother: string
    members?: Kid[]
    kids: number
}

const Families = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editFamily, setEditFamily] = useState<Family | null>(null)
    const [familyForm, setFamilyForm] = useState<Family | null>({
        id: 0,
        name: '',
        father: '',
        mother: '',
        kids: 0
    })
    const [families, setFamilies] = useState<Family[]>([])

    

    // State for handling the delete family dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteFamily, setDeleteFamily] = useState<Family | null>(null)

    const dispatch = useAppDispatch()

    const getFamilies = async () => {
        try {
            const res = await axios.get("http://localhost:3500/families");

            const familyData = res.data.map((family: any) => ({
                id: family.id,
                name: family.familyName,
                father: family.father,
                mother: family.mother,
                members: family.members,
                kids: family.members.length,
            }));

            const sortedFamilies: Family[]  = familyData.sort((a: Family, b: Family) => a.id - b.id);
            setFamilies(sortedFamilies);
            dispatch(setFamily(sortedFamilies))
        } catch (error) {
            console.error("Error fetching families:", error);
        }
    };

    useEffect(() => {
        getFamilies();
    }, []);



    const handleEditClick = (family: Family) => {
        setEditFamily(family)
        setFamilyForm(family)
        setOpenEditDialog(true)
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (familyForm) {
            setFamilyForm({
                ...familyForm,
                [name]: value
            })
        }
    }

    const handleSaveChanges = () => {
        if (familyForm) {
            setFamilies((prevFamilies) =>
                prevFamilies.map((family) =>
                    family.id === familyForm.id ? familyForm : family
                )
            )
            setOpenEditDialog(false)
        }
    }

    // Function to open delete confirmation dialog
    const handleDeleteClick = (family: Family) => {
        setDeleteFamily(family)
        setOpenDeleteDialog(true)
    }

    // Function to confirm delete
    const handleDeleteFamily = () => {
        if (deleteFamily) {
            setFamilies((prevFamilies) =>
                prevFamilies.filter((family) => family.id !== deleteFamily.id)
            )
            setOpenDeleteDialog(false)
        }
    }

    // Add family logic
    const handleAddFamily = () => {
        if (familyForm && familyForm.name && familyForm.father && familyForm.mother && familyForm.kids > 0) {
            const newFamily = { ...familyForm, id: Date.now() }

            setFamilies((prevFamilies) => [...prevFamilies, newFamily])

            setFamilyForm({
                id: 0,
                name: '',
                father: '',
                mother: '',
                kids: 0
            })
            setOpenAddDialog(false)
        }
    }

    return (
        <div className='flex flex-col pl-[5%] w-full pt-[5%]'>
            <span className='font-semibold text-[25px] mb-[2%]'>Families</span>
            <Table className='w-[90%] bg-soft-white mb-[5%]'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] font-bold text-black">#</TableHead>
                        <TableHead className="font-semibold text-black">Family Name</TableHead>
                        <TableHead className="font-semibold text-black">Father's Name</TableHead>
                        <TableHead className="font-semibold text-black">Mother's name</TableHead>
                        <TableHead className="font-semibold text-black text-center ">Number of Children</TableHead>
                        <TableHead className="font-semibold text-black">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {families.map((family) => (
                        <TableRow key={family.id}>
                            <TableCell>
                                <input type="checkbox" id={`family-${family.id}`} />
                                <label htmlFor={`family-${family.id}`} className="ml-2">{family.id}</label>
                            </TableCell>
                            <TableCell>{family.name}</TableCell>
                            <TableCell>{family.father}</TableCell>
                            <TableCell>{family.mother}</TableCell>
                            <TableCell className='text-center'>{family.kids} </TableCell>
                            <TableCell className='flex gap-4'>
                                <Image
                                    className='h-6 w-6 cursor-pointer'
                                    src={Edit}
                                    alt='Edit family'
                                    onClick={() => handleEditClick(family)}
                                />
                                <Image
                                    className='h-6 w-6 cursor-pointer'
                                    src={Delete}
                                    alt='Delete family'
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
                    <Button className='w-[15%]'>Add Family</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <h3 className="font-semibold text-xl mb-4 text-center">Add a New Family</h3>
                    <div className="flex flex-col gap-4">
                        <Input
                            type="text"
                            name="name"
                            value={familyForm?.name || ''}
                            onChange={handleFormChange}
                            placeholder="Family Name"
                        />
                        <Input
                            type="text"
                            name="father"
                            value={familyForm?.father || ''}
                            onChange={handleFormChange}
                            placeholder="Father's Name"
                        />
                        <Input
                            type="text"
                            name="mother"
                            value={familyForm?.mother || ''}
                            onChange={handleFormChange}
                            placeholder="Mother's Name"
                        />
                        <Input
                            type="number"
                            name="kids"
                            value={familyForm?.kids || 0}
                            onChange={handleFormChange}
                            placeholder="Number of Children"
                        />
                        <Button onClick={() => setOpenAddDialog(false)}>Close</Button>
                        <Button onClick={handleAddFamily}>Add Family</Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Family Dialog */}
            <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <AlertDialogTrigger asChild>
                    <Button className="hidden">Edit Family</Button>
                </AlertDialogTrigger>
                <AlertDialogContent >
                    <div className='w-[90%] mx-auto'>
                        <h3 className="font-semibold text-xl mb-4 text-center">Edit Family</h3>

                        <div className="flex flex-col gap-4">
                            <Label htmlFor='name'>Family name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={familyForm?.name || ''}
                                onChange={handleFormChange}
                                placeholder="Family Name"
                            />
                            <Label htmlFor='name'>Father's name</Label>
                            <Input
                                type="text"
                                name="father"
                                value={familyForm?.father || ''}
                                onChange={handleFormChange}
                                placeholder="Father's Name"
                            />
                            <Label htmlFor='name'>Mother's name</Label>
                            <Input
                                type="text"
                                name="mother"
                                value={familyForm?.mother || ''}
                                onChange={handleFormChange}
                                placeholder="Mother's Name"
                            />
                            <Label htmlFor='name'>Number of children</Label>
                            <Input
                                type="number"
                                name="kids"
                                value={familyForm?.kids || 0}
                                onChange={handleFormChange}
                                placeholder="Number of Children"
                            />
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogTrigger asChild>
                    <Button className="hidden">Delete Family</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <h3 className="font-semibold text-xl text-center text-red-500">
                        Delete {deleteFamily?.name}
                    </h3>
                    <p className="text-center text-black mt-4">
                        Are you sure you want to delete {deleteFamily?.name}?
                    </p>

                    <div className="flex justify-center gap-9 mt-6">
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button
                            className="bg-red-500 text-white"
                            onClick={handleDeleteFamily}
                        >
                            Delete
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Families
