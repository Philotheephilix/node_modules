"use client"

import React from "react"

import { useState, useEffect } from "react"
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
  Copy,
  Check,
  ArrowRight,
  User,
  Building2,
  Store,
  Users,
  Shield,
  Recycle,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { cn } from "../lib/utils"
import { Loader } from "../app/components/ui/loader"
import { toast } from "../components/ui/use-toast"

type UserRole = "producer" | "supplier" | "retailer" | "consumer" | "government"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: UserRole
}

export function DashboardLayout({ children, userRole = "producer" }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  // Function to get wallet address from Ethereum provider
  const getWalletAddress = async () => {
    try {
      // Check if window.ethereum exists (MetaMask or other Web3 wallet)
      if (typeof window !== 'undefined' && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } else {
        console.log("No Ethereum provider found");
      }
    } catch (error) {
      console.error("Error getting wallet address:", error);
    }
  };

  // Function to copy wallet address to clipboard
  const copyWalletAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Get wallet address on component mount
  useEffect(() => {
    getWalletAddress();
  }, []);

  // Role-specific navigation items
  const getRoleNavItems = (role: UserRole) => {
    const commonItems: never[] = [
    ]

    const roleSpecificItems: Record<UserRole, Array<{ name: string; href: string; icon: any }>> = {
      producer: [
      { name: "Dashboard", href: "/dashboard/producer", icon: Home },
        { name: "My Products", href: "/dashboard/producer/Products", icon: Leaf },
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
        { name: "Verify Authenticity", href: "/dashboard/consumer/scan", icon: ShoppingBag },
      ],
      government: [
      { name: "Dashboard", href: "/dashboard/government", icon: Home },
        { name: "Issue Airdrops", href: "/dashboard/government/issue", icon: Wallet },
        { name: "Fraud Detection", href: "/dashboard/government/fraud", icon: FileText },
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

  // Format wallet address to show first and last few characters
  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get first letter of wallet address for avatar
  const getAvatarLetter = (address: string | null) => {
    if (!address) return "U";
    return address.substring(2, 3).toUpperCase(); // Skip '0x' prefix
  };

  // All dashboard routes for the Go To button
  const allDashboardRoutes = [
    { name: "Producer Dashboard", href: "/dashboard/producer", icon: Leaf, role: "producer" },
    { name: "Supplier Dashboard", href: "/dashboard/supplier", icon: Building2, role: "supplier" },
    { name: "Retailer Dashboard", href: "/dashboard/retail", icon: Store, role: "retailer" },
    { name: "Consumer Dashboard", href: "/dashboard/consumer/scan", icon: Users, role: "consumer" },
    { name: "Government Dashboard", href: "/dashboard/government", icon: Shield, role: "government" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile top navigation */}
      <header className="sticky top-0  z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
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
                  <h2 className="mb-2 text-lg font-semibold">StockR00t</h2>
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
            <Link href="/" className="flex items-center gap-2 font-semibold">
              StockR00t
            </Link>
          </div>

          {/* Go To Button in the center */}
          <div className="flex-1 flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Go To
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="center">
                <div className="p-4">
                  <h4 className="mb-2 font-medium">All Dashboards</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a dashboard to navigate to
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {allDashboardRoutes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                          pathname === route.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        <route.icon className="h-4 w-4" />
                        <span>{route.name}</span>
                        {userRole === route.role && (
                          <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 font-bold text-black">
                    <AvatarFallback>{getAvatarLetter(walletAddress)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {walletAddress && (
                  <div className="px-2 py-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Wallet:</span>
                      <span className="text-muted-foreground">{formatWalletAddress(walletAddress)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={copyWalletAddress}
                      >
                        {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                )}
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
                  <AvatarFallback>{getAvatarLetter(walletAddress)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {walletAddress ? formatWalletAddress(walletAddress) : "Connect Wallet"}
                  </span>
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
                    {walletAddress && (
                      <div className="px-2 py-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Wallet:</span>
                          <span className="text-muted-foreground">{formatWalletAddress(walletAddress)}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={copyWalletAddress}
                          >
                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    )}
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

