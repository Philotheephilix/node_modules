"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  LineChart,
  Leaf,
  Package,
  Truck,
  Users,
  Trash2,
  CheckCircle2,
} from "lucide-react"

interface CardData {
  title: string
  icon: any
  value: string
  subtitle: string
  progress?: number
}

const roleCards: Record<string, CardData[]> = {
  farmer: [
    {
      title: "Registered Crops",
      icon: Leaf,
      value: "12",
      subtitle: "4 ready for harvest",
      progress: 75
    },
    {
      title: "Expected Yield",
      icon: BarChart,
      value: "2,450 kg",
      subtitle: "+18% from last season"
    },
    {
      title: "Active Shipments",
      icon: Truck,
      value: "3",
      subtitle: "2 arriving today"
    }
  ],
  supplier: [
    {
      title: "Inventory Status",
      icon: Package,
      value: "24,680 kg",
      subtitle: "Across 8 warehouses"
    },
    {
      title: "Pending Orders",
      icon: Clock,
      value: "18",
      subtitle: "5 require immediate attention"
    },
    {
      title: "Active Shipments",
      icon: Truck,
      value: "7",
      subtitle: "3 arriving today"
    }
  ],
  retailer: [
    {
      title: "Today's Sales",
      icon: LineChart,
      value: "₹45,680",
      subtitle: "+12% from yesterday"
    },
    {
      title: "Inventory Status",
      icon: Package,
      value: "1,245 items",
      subtitle: "Low stock: 12 items"
    },
    {
      title: "Active Orders",
      icon: Clock,
      value: "8",
      subtitle: "3 pending delivery"
    }
  ],
  consumer: [
    {
      title: "Recent Purchases",
      icon: Package,
      value: "12",
      subtitle: "Last 30 days"
    },
    {
      title: "Tracked Items",
      icon: Eye,
      value: "8",
      subtitle: "Currently tracking"
    },
    {
      title: "Saved Items",
      icon: Calendar,
      value: "24",
      subtitle: "In your wishlist"
    }
  ],
  government: [
    {
      title: "Active Subsidies",
      icon: BarChart,
      value: "₹2.4M",
      subtitle: "Distributed this month"
    },
    {
      title: "Registered Farmers",
      icon: Users,
      value: "1,245",
      subtitle: "Active this month"
    },
    {
      title: "Compliance Rate",
      icon: CheckCircle2,
      value: "98%",
      subtitle: "Above target"
    }
  ],
  waste: [
    {
      title: "Waste Collected",
      icon: Trash2,
      value: "2,450 kg",
      subtitle: "This month"
    },
    {
      title: "Recycling Rate",
      icon: BarChart,
      value: "85%",
      subtitle: "Above target"
    },
    {
      title: "Active Collections",
      icon: Truck,
      value: "12",
      subtitle: "In progress"
    }
  ]
}

const transactions = [
  {
    id: 1,
    title: "Sold 500kg Rice to Supplier #1",
    transactionId: "0x3a8d...1f9c",
    amount: "+₹15,100"
  },
  {
    id: 2,
    title: "Sold 500kg Rice to Supplier #2",
    transactionId: "0x3a8d...2f9c",
    amount: "+₹15,200"
  },
  {
    id: 3,
    title: "Sold 500kg Rice to Supplier #3",
    transactionId: "0x3a8d...3f9c",
    amount: "+₹15,300"
  }
]

const qrCodes = [
  {
    id: 1,
    title: "Wheat Batch #1",
    date: "Created on April 1, 2025"
  },
  {
    id: 2,
    title: "Wheat Batch #2",
    date: "Created on April 2, 2025"
  }
]

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<"farmer" | "supplier" | "retailer" | "consumer" | "government" | "waste">(
    "farmer",
  )

  return (
    <DashboardLayout userRole={userRole}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your SupplyChain dashboard</p>
        </div>

        {/* Role selector for demo purposes */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Mode: Select User Role</CardTitle>
            <CardDescription>Switch between different user interfaces to explore the application</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={userRole} onValueChange={(value) => setUserRole(value as any)}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6">
                <TabsTrigger value="farmer">Farmer</TabsTrigger>
                <TabsTrigger value="supplier">Supplier</TabsTrigger>
                <TabsTrigger value="retailer">Retailer</TabsTrigger>
                <TabsTrigger value="consumer">Consumer</TabsTrigger>
                <TabsTrigger value="government">Government</TabsTrigger>
                <TabsTrigger value="waste">Waste Mgmt</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roleCards[userRole].map((card) => (
            <Card key={card.title} className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                {card.progress !== undefined && (
                  <div className="mt-4">
                    <Progress value={card.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Transactions Card */}
          <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent blockchain transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{transaction.title}</p>
                      <p className="text-xs text-muted-foreground">Transaction ID: {transaction.transactionId}</p>
                    </div>
                    <div className="text-sm font-medium">{transaction.amount}</div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="mt-4 w-full" size="sm">
                View all transactions
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* QR Codes Card */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>QR Codes</CardTitle>
              <CardDescription>Your active tracking codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qrCodes.map((code) => (
                  <div key={code.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Eye className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{code.title}</p>
                      <p className="text-xs text-muted-foreground">{code.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

