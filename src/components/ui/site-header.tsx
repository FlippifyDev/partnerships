import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "../theme-toggle"
import { Button } from "./button"
import { Globe } from "lucide-react"
import Link from "next/link"

export function SiteHeader({ title }: { title: string }) {
    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{title}</h1>
                <div className="ml-auto flex jusitify-center items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {}}
                    >   
                        <Link href="https://flippify.io" target="_blank"><Globe /></Link>
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}