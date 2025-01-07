import { Family, FamilyResponseStructure } from "@/app/components/Families";
import { User } from "@/app/components/Signup";
import axios, { AxiosResponse } from "axios";
import Cookie from "js-cookie"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

export async function registerUser(formData: User, router: AppRouterInstance) {
     try {
                const res = await axios.post("http://localhost:3500/users/signup", formData);
                console.log(res.status);
                if (res.status == 201) {
                    toast.success(res.data.message, { position: "top-center" })
                    router.replace("/signin")
                }
    
            } catch (error: any) {
                console.log(error.response.data.statusCode);
    
                if (error.response.data.statusCode == 409) {
                    toast.error(error.response.data.message, { position: "top-center" })
                }
            }
}


export async function loginUser(user: User ,rememberMe: boolean , router: AppRouterInstance ) {
    try {
                const res = await axios.post("http://localhost:3500/users/signin", user);
                console.log(res.status);
                if (res.status === 200) {
                    Cookie.set("token", res.data.token);
                    toast.success(res.data.message, { position: "top-center" });
    
                    if (rememberMe) {
                        localStorage.setItem('email', user.email);
                        localStorage.setItem('password', user.password);
                    } else {
                        localStorage.removeItem('email');
                        localStorage.removeItem('password');
                    }
                }
    
                res.data.user.isAdmin ? router.replace("/admin-landing") : "";
            } catch (error: any) {
                console.log(error.response.data.statusCode);
    
                if (error.response.data.statusCode === 401) {
                    toast.error(error.response.data.message, { position: "top-center" })
                }
            }
}

export function convertFamilyToFamilyData(res: AxiosResponse<any, any>) {
    const familyData = res.data.map((family: FamilyResponseStructure) => ({
                   id: family.id,
                   name: family.familyName,
                   father: family.father,
                   mother: family.mother,
                   members: family.members,
                   kids: family.members.length,
     })); 
    return familyData;
}

export function getTotalMemberCount(familyData: any) {
   return familyData.reduce((acc: number, family: FamilyResponseStructure) => {
        return acc + family.members.length;
    }, 0);
}

export async function getFamilies(
    setFamilies: (value: React.SetStateAction<Family[]>) => void,
    setTotalMembers: (value: React.SetStateAction<number>) => void) {
    try {
                const res = await axios.get("http://localhost:3500/families", {
                    headers: {
                        Authorization: `Bearer ${Cookie.get("token")}`
                    }
                });
    
                const familyData = convertFamilyToFamilyData(res)
    
                const totalMembersCount = getTotalMemberCount(familyData)
    
                setTotalMembers(totalMembersCount);
    
                const sortedFamilies: Family[] = familyData.sort(
                    (a: Family, b: Family) => a.id - b.id
                );
                setFamilies(sortedFamilies);
            } catch (error) {
                console.error("Error fetching families:", error);
            }
}
export async function handleAddFamily(
    familyForm: Family,
    setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>,
    setFamilies: React.Dispatch<React.SetStateAction<Family[]>>,
    setTotalMembers: React.Dispatch<React.SetStateAction<number>>
) {
    if (familyForm.name && familyForm.father && familyForm.mother) {
        try {
            const res = await axios.post(
                "http://localhost:3500/families",
                {
                    familyName: familyForm.name,
                    father: familyForm.father,
                    mother: familyForm.mother,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookie.get("token")}`,
                    },
                }
            );
            if (res.status === 201) {
                toast.success("Family added successfully", { position: "top-center" });
                setOpenAddDialog(false);
                setFamilies((prev) => [...prev, res.data]);
                setTotalMembers((prev) => prev + 1);
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Server error:", error.response.data);
            } else {
                console.error("Client error:", error.message);
            }
            toast.error("Failed to add family", { position: "top-center" });
        }
    } else {
        toast.error("Please fill in all fields", { position: "top-center" });
    }
}



export function resetFamilyForm(
    setFamilyForm: React.Dispatch<React.SetStateAction<Family>>
) {
    setFamilyForm({
        id: 0,
        name: "",
        father: "",
        mother: "",
        kids: 0,
    });
};

export async function handleSaveChanges(
    familyForm: Family,
    selectedFamily: Family | null,
    families: Family[],
    setFamilies: React.Dispatch<React.SetStateAction<Family[]>>,
    setFamilyForm: React.Dispatch<React.SetStateAction<Family>>,
    setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
) {
    if (familyForm && selectedFamily) {
        try {
            const res = await axios.put(
                `http://localhost:3500/families/${selectedFamily.id}`,
                {
                    familyName: familyForm.name,
                    father: familyForm.father,
                    mother: familyForm.mother,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookie.get("token")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Family updated successfully", { position: "top-center" });
                const updatedFamilies = families.map((family) =>
                    family.id === selectedFamily.id ? { ...family, ...familyForm } : family
                );
                setFamilies(updatedFamilies);
                resetFamilyForm(setFamilyForm);
                setOpenEditDialog(false);
            }
        } catch (error) {
            console.error("Error updating family", error);
            toast.error("Failed to update family", { position: "top-center" });
        }
    }
}


export async function handleDeleteFamily(
    selectedFamily: Family | null,
    families: Family[],
    setFamilies: React.Dispatch<React.SetStateAction<Family[]>>, 
    setSelectedFamily: React.Dispatch<React.SetStateAction<Family | null>>,
    setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>
){
    if (selectedFamily) {
        try {
            const res = await axios.delete(
                `http://localhost:3500/families/${selectedFamily.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookie.get("token")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Family deleted successfully", { position: "top-center" });
                const updatedFamilies = families.filter(
                    (family) => family.id !== selectedFamily.id
                );
                setFamilies(updatedFamilies);
                setSelectedFamily(null);
                setOpenDeleteDialog(false);
            }
        } catch (error) {
            console.error("Error deleting family", error);
            toast.error("Failed to delete family", { position: "top-center" });
        }
    }
}


export async function handleDeleteMember(
    selectedFamily: any,
    memberId: number,
    setFamilies: React.Dispatch<React.SetStateAction<Family[]>>
) {
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
        toast.success("Member deleted successfully", { position:"top-center"});
    } catch (error) {
        console.error("Error deleting member:", error);
    }
}



export async function handleAddMember(
    selectedFamily: any,
    newMember: {
        name: string;
        class: string;
    },
    setFamilies: React.Dispatch<React.SetStateAction<Family[]>>,
    setNewMember: React.Dispatch<React.SetStateAction<{
        name: string;
        class: string;
    }>>,
    setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>
) {
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
                toast.success("Member added successfully", { position: "top-center"})
            }
        } catch (error) {
            console.error("Error adding member:", error);
        }
    }
}


export async function handleUpdateMember(
    editingMember: any,
    newMember: {
        name: string;
        class: string;
    },
    selectedFamily: any,
    setFamilies: React.Dispatch<React.SetStateAction<Family[]>>,
    setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>,
    setEditingMember: React.Dispatch<any>,
    setTotalMembers: React.Dispatch<React.SetStateAction<number>>
) {
    if (editingMember) {
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
                setEditingMember(null);
                getFamilies(setFamilies, setTotalMembers)
            }
        } catch (error) {
            console.error("Error editing member:", error);
        }
    }
}