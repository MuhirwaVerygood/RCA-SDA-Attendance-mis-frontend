"use client";

import React, { useEffect, useState } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
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
import Edit from "../constants/svgs/Edit.svg";
import Delete from "../constants/svgs/Delete.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Family } from "./Families";
import { handleAddMember, handleDeleteMember, handleUpdateMember } from "../constants/files/Constants";
import { useFamilies } from "../contexts/FamiliesContext";

const Members = () => {
    const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [newMember, setNewMember] = useState({ name: "", class: "" });
    const [editingMember, setEditingMember] = useState<any | null>(null);

    const { families, setTotalMembers, setFamilies } = useFamilies();
    
    const selectedFamily: any = families.find((family) => family.id === selectedFamilyId);

     const [user, setUser] = useState<any>(null); // Initialize user state

     useEffect(() => {
       // Fetch user data from localStorage
       const userString = localStorage.getItem('loggedInUser');
         const user = userString ? JSON.parse(userString) : null;
         console.log(user);
         
       setUser(user);
     }, []);
    
    

    const handleEditMember = async ( member: any) => {
        setEditingMember(member);
        setOpenEditDialog(true);
    };


 
    return (
      <div className="flex flex-col pl-[5%]  pt-[5%] ">
        <span className="font-semibold text-[25px] mb-[2%]">
          Family Members
        </span>

        {user?.isAdmin && (
          <div className="w-full py-7 px-4">
            <NavigationMenu className=" flex items-start w-full">
              <div className="w-full">
                <NavigationMenuList className="flex flex-col justify-start ">
                  {families.map((family: Family) => (
                    <NavigationMenuItem className=" w-full  " key={family.id}>
                      <NavigationMenuTrigger
                        className="flex text-start self-start"
                        onClick={() =>
                          setSelectedFamilyId(
                            selectedFamily === family.id ? null : family.id,
                          )
                        }
                      >
                        {family.name}
                      </NavigationMenuTrigger>
                      {selectedFamilyId === family.id && (
                        <div className="mt-4 w-full  ">
                          <Table className="w-full bg-white">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px] font-bold text-black">
                                  #
                                </TableHead>
                                <TableHead className="font-semibold text-black">
                                  Names
                                </TableHead>
                                <TableHead className="font-semibold text-black">
                                  Class
                                </TableHead>
                                <TableHead className="font-semibold text-black">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {family.members?.map((member, index) => (
                                <TableRow key={member.id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{member.name}</TableCell>
                                  <TableCell>{member.class}</TableCell>
                                  <TableCell className="flex gap-5">
                                    <Image
                                      className="h-6 w-6 cursor-pointer"
                                      src={Edit}
                                      alt="Edit member"
                                      onClick={() => handleEditMember(member)}
                                    />
                                    <Image
                                      className="h-6 w-6 cursor-pointer"
                                      src={Delete}
                                      alt="Delete member"
                                      onClick={() =>
                                        handleDeleteMember(
                                          selectedFamily,
                                          member.id,
                                          setFamilies,
                                        )
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          <Button
                            className="mt-4"
                            onClick={() => setOpenAddDialog(true)}
                          >
                            Add a Member
                          </Button>
                        </div>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </div>
            </NavigationMenu>
          </div>
        )}

        {selectedFamily && (
          <div className="mt-8 bg-red-500">
            {/* Add Member Dialog */}
            <AlertDialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <AlertDialogContent>
                <h3 className="font-semibold text-xl mb-4 text-center">
                  Add a New Member
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddMember(
                      selectedFamily,
                      newMember,
                      setFamilies,
                      setNewMember,
                      setOpenAddDialog,
                    );
                  }}
                  className="flex flex-col gap-4"
                >
                  <Input
                    type="text"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Class"
                    value={newMember.class}
                    onChange={(e) =>
                      setNewMember({ ...newMember, class: e.target.value })
                    }
                    required
                  />
                  <Button onClick={() => setOpenAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full ">
                    Add Member
                  </Button>
                </form>
              </AlertDialogContent>
            </AlertDialog>

            {/* Edit Member Dialog */}
            <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
              <AlertDialogTrigger asChild></AlertDialogTrigger>
              <AlertDialogContent>
                <h3 className="font-semibold text-xl mb-4 text-center">
                  Edit Member Details
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateMember(
                      editingMember,
                      newMember,
                      selectedFamily,
                      setFamilies,
                      setOpenEditDialog,
                      setEditingMember,
                      setTotalMembers,
                    );
                  }}
                  className="flex flex-col gap-4"
                >
                  <Input
                    type="text"
                    placeholder="Name"
                    value={newMember.name || editingMember?.name || ''}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Class"
                    value={newMember.class || editingMember?.class || ''}
                    onChange={(e) =>
                      setNewMember({ ...newMember, class: e.target.value })
                    }
                    required
                  />
                  <Button type="submit" className="w-full mt-4">
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
