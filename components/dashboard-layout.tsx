"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Home,
  Leaf,
  Truck,
  ShoppingBag,
  FileText,
  Trash2,
  Wallet,
  Settings,
  Menu,
  Bell,
  Search,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { cn } from "../lib/utils"
import { Loader } from "../app/components/ui/loader"

type UserRole = "producer" | "supplier" | "retailer" | "consumer" | "government" | "waste"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: UserRole
}

export function DashboardLayout({ children, userRole = "producer" }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Role-specific navigation items
  const getRoleNavItems = (role: UserRole) => {
    const commonItems: never[] = [
    ]

    const roleSpecificItems: Record<UserRole, Array<{ name: string; href: string; icon: any }>> = {
      producer: [
      { name: "Dashboard", href: "/dashboard/producer", icon: Home },
        { name: "My Crops", href: "/dashboard/producer/Products", icon: Leaf },
        { name: "Transport Status", href: "/dashboard/producer/transport", icon: Truck },
      ],
      supplier: [
      { name: "Dashboard", href: "/dashboard/supplier", icon: Home },
        { name: "Warehouse", href: "/dashboard/supplier/warehouse", icon: FileText },
        { name: "Distribution", href: "/dashboard/supplier/distribute", icon: Truck },
      ],
      retailer: [
      { name: "Dashboard", href: "/dashboard/retail", icon: Home },
        { name: "Inventory", href: "/dashboard/retail/inventory", icon: FileText },
        { name: "Sales", href: "/dashboard/retail/sales", icon: ShoppingBag },
      ],
      consumer: [
      { name: "Dashboard", href: "/dashboard/consumer", icon: Home },
        { name: "Scan & Buy", href: "/dashboard/consumer/scan", icon: ShoppingBag },
        { name: "Supply Journey", href: "/dashboard/consumer/journey", icon: Truck },
        { name: "My Airdrops", href: "/dashboard/consumer/airdrops", icon: Wallet },
      ],
      government: [
      { name: "Dashboard", href: "/dashboard/government", icon: Home },
        { name: "Monitor Chain", href: "/dashboard/government/monitor", icon: BarChart3 },
        { name: "Issue Airdrops", href: "/dashboard/government/issue", icon: Wallet },
        { name: "Fraud Detection", href: "/dashboard/government/fraud", icon: FileText },
      ],
      waste: [
      { name: "Dashboard", href: "/dashboard/waste", icon: Home },
        { name: "Waste Reports", href: "/dashboard/waste/reports", icon: FileText },
        { name: "Redistribution", href: "/dashboard/waste/redistribute", icon: Truck },
        { name: "Disposal", href: "/dashboard/waste/disposal", icon: Trash2 },
      ],
    }

    return [...commonItems, ...(roleSpecificItems[role] || [])]
  }

  const navItems = getRoleNavItems(userRole)

  const roleLabels = {
    producer: "Producer",
    supplier: "Supplier/Distributor",
    retailer: "Retailer",
    consumer: "Consumer",
    government: "Government",
    waste: "Waste Management",
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile top navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div className="container flex h-14 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4">
                <div className="px-2 py-4">
                  <h2 className="mb-2 text-lg font-semibold">SupplyChain</h2>
                  <p className="text-sm text-muted-foreground">{roleLabels[userRole]}</p>
                </div>
                <div className="px-2">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              SupplyChain
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/logout">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isSearchOpen && (
          <div className="container py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full bg-background pl-8" />
            </div>
          </div>
        )}
      </header>

      {/* Desktop layout */}
      <div className="flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="fixed top-0 z-30 hidden h-screen w-full shrink-0 border-r md:sticky md:block">
          <div className="flex h-full flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">User Name</span>
                  <span className="text-xs text-muted-foreground">{roleLabels[userRole]}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/auth/logout">Log out</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex flex-col">
          <div className="flex-1 p-4 md:p-6">{children}</div>
        </main>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}

