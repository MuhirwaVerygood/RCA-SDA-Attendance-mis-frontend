"use client"
import React, { useState, useEffect } from 'react'
import Landing from '../components/Landing'
import { FamiliesPresenceGraph } from '../components/FamiliesPresenceGraph'
import { FamiliesPieChart } from '../components/FamiiliesPieChart'
import { Skeleton } from '@/components/ui/skeleton'

const Page = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // Adjust the delay as needed
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-5">
      {loading ? (
        <Skeleton className="w-[70%]  mx-auto h-[20vh]" />
      ) : (
        <Landing />
      )}
      <div className="w-full pl-[2%] h-[50vh] flex justify-between">
        {/* Skeleton for FamiliesPresenceGraph */}
        {loading ? (
          <Skeleton className="w-[70%] mt-[3%] h-full" />
        ) : (
          <FamiliesPresenceGraph />
        )}
        {/* Skeleton for FamiliesPieChart */}
        {loading ? (
          <Skeleton className="w-[25%] mr-[1%] h-full  mt-[3%]" />
        ) : (
          <FamiliesPieChart />
        )}
      </div>
    </div>
  )
}

export default Page
