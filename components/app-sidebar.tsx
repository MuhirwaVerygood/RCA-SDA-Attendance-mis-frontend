import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";

// Menu items.
const items = [
    {
        title: "MAIN MENU",
        subItems: [
            {
                title: "Families",
                url: "/families",
            },
            {
                title: "Members By Family",
                url: "/members/family",
            },
            {
                title: "Attendance Records",
                url: "/attendances/records",
            },
            {
                title: "Attendance",
                url: "/attendances",
            },
        ],
    },
    {
        title: "SETTINGS",
        subItems: [
            {
                title: "Settings",
                url: "/settings",
            },
            {
                title: "Logout",
                url: "/logout",
            },
        ],
    },
];

export function AppSidebar() {
    const pathname = usePathname(); // Get current path

    return (
        <Sidebar className="h-[calc(100vh-40px)]   pt-[3%] pl-[2%] mt-[40px] bg-soft-white">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu >
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <div className="font-bold text-gray-800 mb-5">{item.title}</div>
                                    {item.subItems && (
                                        <SidebarMenuSub className="mb-[4%] ">
                                            {item.subItems.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton  asChild>
                                                        <a
                                                            href={subItem.url}
                                                            className={` pl-4 text-gray-600 hover:bg-gray-200 focus:bg-gray-400  hover:text-gray-800 
                              ${pathname === subItem.url ? 'bg-gray-300 border-r-4 border-black ' : ''}`} // Active link styles
                                                        >
                                                            {subItem.title}
                                                        </a>
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
