"use client"

// Local Imports
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
// External Imports
import React from "react";
import { SiteHeader } from "@/components/ui/site-header";

export default function Layout({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title={title} />

                <main className="w-full">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}
