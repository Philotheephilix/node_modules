"use client"

import type React from "react"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { Loader } from "../app/components/ui/loader"

type UserRole = "farmer" | "supplier" | "retailer" | "consumer" | "government" | "waste"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: UserRole
}

export function DashboardLayout({ children, userRole = "farmer" }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Role-specific navigation items
  const getRoleNavItems = (role: UserRole) => {
    const commonItems = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    const roleSpecificItems = {
      farmer: [
        { name: "My Crops", href: "/dashboard/crops", icon: Leaf },
        { name: "Harvest & Sell", href: "/dashboard/harvest", icon: BarChart3 },
        { name: "Transport Status", href: "/dashboard/transport", icon: Truck },
      ],
      supplier: [
        { name: "Buy from Farmers", href: "/dashboard/buy", icon: ShoppingBag },
        { name: "Warehouse", href: "/dashboard/warehouse", icon: FileText },
        { name: "Distribution", href: "/dashboard/distribute", icon: Truck },
      ],
      retailer: [
        { name: "Inventory", href: "/dashboard/inventory", icon: FileText },
        { name: "Sales", href: "/dashboard/sales", icon: ShoppingBag },
        { name: "Waste Management", href: "/dashboard/waste", icon: Trash2 },
      ],
      consumer: [
        { name: "Scan & Buy", href: "/dashboard/scan", icon: ShoppingBag },
        { name: "Supply Journey", href: "/dashboard/journey", icon: Truck },
        { name: "My Airdrops", href: "/dashboard/airdrops", icon: Wallet },
      ],
      government: [
        { name: "Monitor Chain", href: "/dashboard/monitor", icon: BarChart3 },
        { name: "Issue Airdrops", href: "/dashboard/issue", icon: Wallet },
        { name: "Fraud Detection", href: "/dashboard/fraud", icon: FileText },
      ],
      waste: [
        { name: "Waste Reports", href: "/dashboard/reports", icon: FileText },
        { name: "Redistribution", href: "/dashboard/redistribute", icon: Truck },
        { name: "Disposal", href: "/dashboard/disposal", icon: Trash2 },
      ],
    }

    return [...commonItems, ...roleSpecificItems[role]]
  }

  const navItems = getRoleNavItems(userRole)

  const roleLabels = {
    farmer: "Farmer",
    supplier: "Supplier/Distributor",
    retailer: "Retailer",
    consumer: "Consumer",
    government: "Government",
    waste: "Waste Management",
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile top navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
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
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                SupplyChain
              </Link>
            </div>
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
          <header className="sticky top-0 z-20 hidden h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex lg:h-[60px]">
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-background pl-8 md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
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
          </header>

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

