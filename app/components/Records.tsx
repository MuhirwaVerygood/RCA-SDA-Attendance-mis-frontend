import Image from "next/image"
import Download from "../constants/Download.svg"
import Eye from "../constants/Eye.svg"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

const Records = () => {
  return (
      <div className='flex flex-col pl-[5%] w-full pt-[5%]'>
          <span className='font-semibold text-[25px] mb-[2%]'>Attendance Reports</span>
          <Table className='w-[70%] '>
              <TableHeader>
                  <TableRow>
                      <TableHead className="w-[50px] font-bold text-black">#</TableHead>
                      <TableHead className="font-semibold text-black">Date</TableHead>
                      <TableHead className="font-semibold text-black">Saturday</TableHead>
                      <TableHead className="font-semibold text-black text-center    ">Actions</TableHead>
                     
                  </TableRow>
              </TableHeader>
              <TableBody>
                  <TableRow>
                      <TableCell className="flex items-center">
                          <input type="checkbox" name='id' id="1" />
                          <label htmlFor="id" className="ml-2">1</label>
                      </TableCell>
                      <TableCell>
                          2024.01.20
                      </TableCell>
                      <TableCell>JA</TableCell>
                      <TableCell className='flex gap-6 justify-center'>
                          <Image
                              className='h-6 w-6 cursor-pointer'
                              src={Eye}
                              alt='View  Attendance Record'
                          />
                          <Image
                              className='h-6 w-6 cursor-pointer'
                              src={Download}
                              alt='Download Attendance Record'
                          />
                      </TableCell>
                  </TableRow>
              </TableBody>
          </Table>
    </div>
  )
}

export default Records
