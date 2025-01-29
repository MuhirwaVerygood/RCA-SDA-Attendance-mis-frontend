import { Family, FamilyResponseStructure } from "@/app/components/Families";
import { User } from "@/app/components/Signup";
import { AttendanceRecord } from "@/app/contexts/AttendanceContext";
import axios, { AxiosResponse } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { authorizedAPI, unauthorizedAPI } from "./api";
import { IndividualAttendance, Member } from "@/app/components/AttendanceTable";
import { GeneralFormAttendance } from "@/app/components/AttendanceContainer";


export interface AttendanceByTable{
    attendances: IndividualAttendance[],
    abashyitsi: number 
}

export async function registerUser(formData: User, router: AppRouterInstance) {
    try {
        const res = await unauthorizedAPI.post("/auth/signup", formData);
        console.log(res.status);
        if (res.status == 201) {
            toast.success(res.data.message, { position: "top-center" })
            res.data.user.isAdmin ? router.replace("/admin-landing") : "";
        }

    } catch (error: any) {
        console.log(error.response.data.statusCode);

        if (error.response.data.statusCode == 409) {
            toast.error(error.response.data.message, { position: "top-center" })
        }
    }
}


export async function loginUser(
    user: User, rememberMe: boolean, router: AppRouterInstance,
) {
    try {
        const res = await unauthorizedAPI.post("/auth/signin", user);
        if (res.status === 200) {
            const loggedInUser= res.data.user;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
            toast.success("Logged in successfully", { position: "top-center" });
            
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
        console.log(error);

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
    return familyData
}

export function getTotalMemberCount(familyData: any) {
    return familyData.reduce((acc: number, family: FamilyResponseStructure) => {
        return acc + family.members.length;
    }, 0);
}


export function getTotalActiveMembers( familyData: any){
    return familyData.reduce((acc: number,  family: FamilyResponseStructure)=>{
        return acc + (family.activeMembers ?? 0);
    }, 0)
}

export async function getFamilies(
    setFamilies: (value: React.SetStateAction<Family[]>) => void,
    setTotalMembers: (value: React.SetStateAction<number>) => void,
    setTotalActiveMembers?: React.Dispatch<React.SetStateAction<number>>
) {
    try {
        const res = await authorizedAPI.get("/families");


        const familyData = convertFamilyToFamilyData(res)

        const totalMembersCount = getTotalMemberCount(familyData)
        const totalActiveMembers = getTotalActiveMembers(familyData)

        setTotalMembers(totalMembersCount);
        if (setTotalActiveMembers) {
            setTotalActiveMembers(totalActiveMembers);
        }

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
            const res = await authorizedAPI.post(
                "/families",
                {
                    familyName: familyForm.name,
                    father: familyForm.father,
                    mother: familyForm.mother,
                    father_email: familyForm.father_email,
                    mother_email: familyForm.mother_email,
                    mother_class: familyForm.mother_class,
                    father_class: familyForm.father_class,
                    password: "securePassword123"
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
            const res = await authorizedAPI.put(
                `/families/${selectedFamily.id}`,
                {
                    familyName: familyForm.name,
                    father: familyForm.father,
                    mother: familyForm.mother,
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
) {
    if (selectedFamily) {
        try {
            const res = await authorizedAPI.delete(
                `/families/${selectedFamily.id}`,
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
        await authorizedAPI.delete(`/members/member/${memberId}`, {
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
        toast.success("Member deleted successfully", { position: "top-center" });
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
            const res = await authorizedAPI.post(
                `/members/${selectedFamily.id}`,
                newMemberData
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
                toast.success("Member added successfully", { position: "top-center" })
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
        const updatedMemberData = {
            name: newMember.name,
            class: newMember.class,
        };

        try {
            const res = await authorizedAPI.put(
                `/members/member/${editingMember.id}`,
                updatedMemberData
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


export async function fetchAttendances(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setAttendances: React.Dispatch<React.SetStateAction<Record<string, AttendanceRecord[]> | null>>
) {
    try {
        setLoading(true);
        setError(null); // Reset error before fetching
        const response = await authorizedAPI.get<Record<string, AttendanceRecord[]>>(
            "/attendances/grouped",
        );
        setAttendances(response.data);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
    } finally {
        setLoading(false);
    }
};





export async function getAttendancesByDate(date: Date) {
    try {
        const res = await authorizedAPI.get(`/attendances/${date}`,

        );
        return res.data;
    } catch (error) {
        console.error("Error fetching attendances by date:", error);
    }
}



export async function getAllMembers(): Promise<Member[]> {
    try {
        const res = await authorizedAPI.get("/members");

        if (res.status === 200) {
            return res.data; // Return the fetched members
        }

        return []; // Return an empty array if the response status is not 200
    } catch (error) {
        console.error("Error fetching members:", error);
        return []; // Return an empty array in case of an error
    } 
}


export async function handleAddAttendance( 
    attendance: AttendanceByTable | GeneralFormAttendance 
 ){
    let formData;
    try {
        
        if("attendances" in attendance && "abashyitsi" in attendance){
            formData={
                attendances: attendance.attendances,
                abashyitsi: attendance.abashyitsi
            }

            
            const res = await authorizedAPI.post("/attendances/general/table" , formData);
            if (res.status === 200 || res.status === 201) {
                console.log("Attendance successfully added:", res.data);
        
              } else {
                console.error("Failed to add attendance:", res.statusText);
                throw new Error("Failed to add attendance");
              }
        }

    } catch (error : any) {
        console.error("An error occurred while adding attendance:", error.message);
        throw new Error(error.message); 
    }
 }
   