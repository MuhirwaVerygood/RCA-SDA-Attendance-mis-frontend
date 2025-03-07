"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { authorizedAPI } from '../constants/files/api';
import toast from 'react-hot-toast';

const InviteAdmin = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newData = { ...formData, password: 'securePassword123' };

    try {
      // Make a POST request to the /users/admin/add endpoint
      const response = await authorizedAPI.post('/users/admin/add', newData);

      // Handle success

      // Reset the form after successful submission
      setFormData({
        username: '',
        email: '',
      });

      toast.success(response.data.message, { position: 'top-center' });
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  return (
    <div className="pl-[4%] mx-auto bg-soft-white md:w-[60%] sm:w-[80%] ss:w-full xl:w-[40%] pt-[4%] pb-[5%] mt-[10%] rounded-md shadow-custom">
      <p className="font-bold mb-[4%]">Add admin</p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="Admin username"
          className="w-[70%]"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Admin email"
          className="w-[70%]"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">Add admin</Button>
      </form>
    </div>
  );
};

export default InviteAdmin;
