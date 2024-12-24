import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
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
    return (
        <Sidebar className="h-[calc(100vh-45px)] pt-[3%] pl-[2%] mt-[30px] bg-soft-white">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <div className="font-bold text-gray-800 mb-5">{item.title}</div>
                                    {item.subItems && (
                                        <SidebarMenuSub className="mb-[4%]">
                                            {item.subItems.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a
                                                            href={subItem.url}
                                                            className="pl-4 text-gray-600 hover:text-gray-800"
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
