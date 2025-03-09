'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ThreeUsers from '.././app/constants/svgs/UsersThree.svg';
import Notebook from '.././app/constants/svgs/Notebook.svg';
import NotePencil from '.././app/constants/svgs/NotePencil.svg';
import User from '.././app/constants/svgs/User.svg';
import UserPlus from '.././app/constants/svgs/UserPlus.svg';
import Dashboard from '.././app/constants/svgs/dashboard.png';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userString = localStorage.getItem('loggedInUser');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  // Define menu items based on role
  const items = user?.isAdmin
    ? [
        {
          title: 'MAIN MENU',
          subItems: [
            {
              title: 'Dashboard',
              url: '/admin-landing',
              image: Dashboard,
            },
            {
              title: 'Families',
              url: '/families',
              image: ThreeUsers,
            },
            {
              title: 'Family members',
              url: '/families/members',
              image: User,
            },
            {
              title: 'Records',
              url: '/attendances/records',
              image: Notebook,
            },
            {
              title: 'Attendance',
              url: '/attendances',
              image: NotePencil,
            },
          ],
        },
        {
          title: 'SETTINGS',
          subItems: [
            {
              title: 'Add Admin',
              url: '/admin',
              image: UserPlus,
            },
          ],
        },
      ]
    : user?.isFather || user?.isMother
    ? [
        {
          title: 'MAIN MENU',
          subItems: [
            {
              title: 'Dashboard',
              url: '/father-landing',
              image: Dashboard,
            },

            {
              title: 'Family members',
              url: '/family/members',
              image: User,
            },
            {
              title: 'Records',
              url: '/family/attendances/records',
              image: Notebook,
            },
            {
              title: 'Attendance',
              url: '/family/attendances',
              image: NotePencil,
            },
          ],
        },
      ]
    : [];

  return (
    <Sidebar className="h-[calc(100vh-40px)] pt-[3%] pl-[1%] mt-[40px] bg-soft-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="font-bold text-gray-800 mb-5">
                    {item.title}
                  </div>
                  {item.subItems && (
                    <SidebarMenuSub className="mb-[4%]">
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <button
                              onClick={() => router.push(subItem.url)}
                              className={` flex items-center pl-2 text-gray-600 hover:bg-gray-200 focus:bg-gray-400 hover:text-gray-800 
                                ${
                                  pathname === subItem.url
                                    ? 'bg-gray-300 border-r-4 border-black'
                                    : ''
                                }`}
                            >
                              <Image
                                src={subItem.image}
                                alt={subItem.title}
                                className="mr-3 w-5 h-5"
                              />
                              {subItem.title}
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
