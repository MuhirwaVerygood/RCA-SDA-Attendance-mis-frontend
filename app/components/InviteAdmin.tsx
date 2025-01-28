import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const InviteAdmin = () => {
  return (
    <div className='pl-[4%]  mx-auto bg-soft-white md:w-[60%] sm:w-[80%] ss:w-full xl:w-[40%] pt-[4%] pb-[5%] mt-[10%] rounded-md shadow-custom ' >
          <p className='font-bold'>Add admin</p>
          <form className='space-y-3'>
              <Label htmlFor='email'>Email</Label>
              <Input type='email' className='w-[70%]' />
              <Button type='submit'>Invite</Button>
          </form>
          
    </div>
  )
}

export default InviteAdmin
