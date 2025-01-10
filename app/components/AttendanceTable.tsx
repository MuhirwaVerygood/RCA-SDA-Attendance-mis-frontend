import React, { useEffect } from 'react'
import { getAllMembers } from '../constants/files/Constants';

const AttendanceTable = () => {
    useEffect(() => {
        console.log(getAllMembers());
    },[])
  return (
    <div>
      
    </div>
  )
}

export default AttendanceTable
