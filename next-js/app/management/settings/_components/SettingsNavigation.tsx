"use client"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function SettingsNavigationBar() {

    const pages = [
        {
            name: "Evaluation",
            href: "evaluation",
        },
    ]

    return <div className="flex flex-col gap-2 p-2 min-w-[150px]">
        <p className="text-muted-foreground font-medium text-xs w-full border-b border-b-zinc-200 pb-1">Settings</p>
        <NavigationMenu>
            <NavigationMenuList>
                {pages.map((page, i) => (
                    <NavigationMenuItem key={i}>
                        <Link href={page.href} legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>{page.name}</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>

    </div>
}