'use client';
import { Calendar, ChevronDown, Home, Inbox, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import Link from "next/link"

// Menu items.
const upperItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    }
]
const learningVideos = [
    {
        title: "All Videos",
        url: "/videos",
        icon: Search,
    },
    {
        title: "Add Video",
        url: "/videos",
        icon: Calendar,
    }
]
const lowerItems = [
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
    {
        title: "Inbox",
        url: "/inbox",
        icon: Inbox,
    },
]
export function AppSidebar() {
    const { toggleSidebar } = useSidebar()
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarHeader>
                    <h1 className="text-2xl font-semibold">StudyMate</h1>
                    <p className="text-sm text-muted-foreground">
                        Instructor Dashboard
                    </p>
                </SidebarHeader>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <Collapsible defaultOpen className="group/collapsible">
                            <SidebarGroup>
                                {/* Top items */}
                                <SidebarMenu>
                                    {upperItems.map((item) => (
                                        <SidebarMenuItem key={item.title} onClick={() => {
                                            toggleSidebar()
                                        }}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>

                                {/* Collapsible: Learning Videos */}
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger>
                                        <p className="text-lg">Learning Videos</p>
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarMenu>
                                        {learningVideos.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild onClick={() => {
                                                    toggleSidebar()
                                                }}>
                                                    <Link href={item.url}>

                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>

                        {/* 🔽 Lower section (Settings, Inbox, etc.) */}
                        <SidebarGroup className="mt-4 border-t pt-4">
                            <SidebarMenu>
                                {lowerItems.map((item) => (
                                    <SidebarMenuItem key={item.title} onClick={() => {
                                        toggleSidebar()
                                    }}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
