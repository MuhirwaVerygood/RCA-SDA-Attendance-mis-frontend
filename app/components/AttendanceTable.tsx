import React, { useEffect, useState } from "react";
import { getAllMembers, handleAddAttendance } from "../constants/files/Constants";
import { Button } from "@/components/ui/button";
import { useFamily } from "../contexts/FamilyContext";
import { User } from "./Signup";
import { Kid } from "@/lib/features/FamilySlice";

interface Family {
  id: number;
  familyName: string;
  father: string;
  mother: string;
}

export interface Member {
  id: number;
  name: string;
  class: string;
  family: Family;
}

export interface IndividualAttendance {
  memberId: number;
  yaje: boolean;
  yarasuye: boolean;
  yarasuwe: boolean;
  yarafashije: boolean;
  yarafashijwe: boolean;
  yatangiyeIsabato: boolean;
  yize7: boolean;
  ararwaye: boolean;
  afiteIndiMpamvu: boolean;
}

const AttendanceTable = ({ setDialogType }: { setDialogType: React.Dispatch<React.SetStateAction<"form" | "table" | null>> }) => {
  const [members, setMembers] = useState<Member[] | Kid[] >([]);
  const [attendance, setAttendance] = useState<IndividualAttendance[]>([]);
  const [abashyitsiCount, setAbashyitsiCount] = useState<number>(0);
  const [user, setUser]  = useState<User>()


  const { family } = useFamily()


    useEffect(() => {
      const userString = localStorage.getItem('loggedInUser');
      if (userString) {
        setUser(JSON.parse(userString));
      }
    }, []);

  useEffect(() => {
    if (!user) return; 

    if (user?.isAdmin) {
        getAllMembers().then((fetchedMembers: Member[]) => {
          setMembers(fetchedMembers);

          // Initialize attendance state with default values
          const initialAttendance = fetchedMembers.map((member) => ({
            memberId: member.id,
            yaje: false,
            yarasuye: false,
            yarasuwe: false,
            yarafashije: false,
            yarafashijwe: false,
            yatangiyeIsabato: false,
            yize7: false,
            ararwaye: false,
            afiteIndiMpamvu: false,
          }));
          setAttendance(initialAttendance);
        });
    } else if (user?.isFather || user?.isMother) {
      setMembers(family?.members || []);
      const initialAttendance = family?.members?.map((member) => ({
        memberId: member.id,
        yaje: false,
        yarasuye: false,
        yarasuwe: false,
        yarafashije: false,
        yarafashijwe: false,
        yatangiyeIsabato: false,
        yize7: false,
        ararwaye: false,
        afiteIndiMpamvu: false,
      }));

      console.log(initialAttendance);
      
      setAttendance(initialAttendance || []);
    }
  
  }, [user, family]);

  const handleCheckboxChange = (
    memberId: number,
    field: keyof IndividualAttendance
  ) => {
    setAttendance((prev) =>
      prev.map((entry) =>
        entry.memberId === memberId
          ? { ...entry, [field]: !entry[field] }
          : entry
      )
    );
  };

  const handleAbashyitsiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAbashyitsiCount(Number(e.target.value));
  };

  const handleSubmission = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      attendances: attendance,
      abashyitsi: abashyitsiCount,
    };

    handleAddAttendance(formData);
  };

  return (
    <div className="overflow-x-auto">
      <form onSubmit={handleSubmission}>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 ">Member ID</th>
              <th className="border border-gray-300 px-4 py-2">Member Name</th>
              <th className="border border-gray-300 px-4 py-2">Yaje</th>
              <th className="border border-gray-300 px-4 py-2">Yarasuye</th>
              <th className="border border-gray-300 px-4 py-2">Yarasuwe</th>
              <th className="border border-gray-300 px-4 py-2">Yarafashije</th>
              <th className="border border-gray-300 px-4 py-2">Yarafashijwe</th>
              <th className="border border-gray-300 px-4 py-2">Yatangiye Isabato</th>
              <th className="border border-gray-300 px-4 py-2">Yize 7</th>
              <th className="border border-gray-300 px-4 py-2">Ararwaye</th>
              <th className="border border-gray-300 px-4 py-2">Afite Indi Mpamvu</th>
            </tr>
          </thead>
          <tbody>
            {members
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{member.name}</td>

                  {/* Yaje Checkbox */}
                  <td
                    className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
                    onClick={() => handleCheckboxChange(member.id, "yaje")}
                  >
                    <input
                      type="checkbox"
                      checked={
                        attendance.find((entry) => entry.memberId === member.id)
                          ?.yaje ?? false
                      }
                      onChange={() => {}}
                      className="pointer-events-none w-4 h-4 rounded-sm border-2 border-gray-400 bg-black checked:bg-black checked:border-black checked:accent-black"
                    />
                  </td>

                  {/* Other fields */}
                  {Object.keys(attendance[0] || {})
                    .filter((key) => key !== "memberId" && key !== "yaje")
                    .map((field) => {
                      const isDisabled = field !== "ararwaye" && field !== "afiteIndiMpamvu" && !attendance.find((entry) => entry.memberId === member.id)?.yaje;
                      return (
                        <td
                          key={field}
                          className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
                          onClick={() => {
                            if (!isDisabled) {
                              handleCheckboxChange(member.id, field as keyof IndividualAttendance);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              (attendance.find((entry) => entry.memberId === member.id)?.[
                                field as keyof IndividualAttendance
                              ] ?? false) as boolean
                            }
                            disabled={isDisabled}
                            onChange={() => {}}
                            className={`pointer-events-none w-4 h-4 rounded-sm border-2 border-gray-400 ${
                              isDisabled ? "bg-gray-200" : "bg-black checked:bg-black checked:border-black checked:accent-black"
                            }`}
                          />
                        </td>
                      );
                    })}
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-between pt-4">
          <div className="space-x-2">
            <label>Abashyitsi</label>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-indigo-300"
              value={abashyitsiCount}
              onChange={handleAbashyitsiChange}
            />
          </div>

          <div className="col-span-2 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AttendanceTable;
