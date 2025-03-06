'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useFamily } from '../contexts/FamilyContext';
import {
  handleAddMember,
  handleDeleteMember,
  handleUpdateMember,
} from '../constants/files/Constants';
import Image from 'next/image';
import Edit from '../constants/svgs/Edit.svg';
import Delete from '../constants/svgs/Delete.svg';
import { useFamilies } from '../contexts/FamiliesContext';

const FamilyMembers = () => {
    const { family, setFamily, setTotalMembers } = useFamily();
    const {setFamilies} = useFamilies()
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', class: '' });
  const [editingMember, setEditingMember] = useState<any | null>(null);

  if (!family) {
    return <div className="text-center">No family data available.</div>;
  }

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setOpenEditDialog(true);
  };

  return (
    <div className="flex flex-col pl-[5%] pt-[5%]">
      <span className="font-semibold text-[25px] mb-[2%]">
        {family.familyName} Members
      </span>

      <Table className="ss:w-full md:w-[80%] bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] font-bold text-black">#</TableHead>
            <TableHead className="font-semibold text-black">Names</TableHead>
            <TableHead className="font-semibold text-black">Class</TableHead>
            <TableHead className="font-semibold text-black">Actions</TableHead>
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
                    handleDeleteMember(family, member.id, setFamilies)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button className="mt-4 ss:w-full md:w-[40%]" onClick={() => setOpenAddDialog(true)}>
        Add a Member
      </Button>

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
                family,
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
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button type="submit" className="ss:w-full">
              Add Member
            </Button>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Member Dialog */}
      <AlertDialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
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
                family,
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
  );
};

export default FamilyMembers;
