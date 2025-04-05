"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Filter,
  Leaf,
  Package,
  Recycle,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WastePage() {
  const { toast } = useToast()
  const [isReporting, setIsReporting] = useState(false)

  const expiringItems = [
    {
      id: "exp-1",
      name: "Mixed Vegetables",
      type: "Vegetables",
      quantity: 45,
      expiryDate: "2025-04-03",
      daysLeft: 2,
      condition: "good",
      qrCode: "EXP-1234-ABCD",
    },
    {
      id: "exp-2",
      name: "Fresh Fruits",
      type: "Fruits",
      quantity: 30,
      expiryDate: "2025-04-04",
      daysLeft: 3,
      condition: "fair",
      qrCode: "EXP-5678-EFGH",
    },
    {
      id: "exp-3",
      name: "Dairy Products",
      type: "Dairy",
      quantity: 15,
      expiryDate: "2025-04-02",
      daysLeft: 1,
      condition: "poor",
      qrCode: "EXP-9012-IJKL",
    },
  ]

  const reportedWaste = [
    {
      id: "waste-1",
      name: "Expired Bread",
      type: "Bakery",
      quantity: 10,
      reportDate: "2025-03-30",
      disposalMethod: "Composting",
      status: "processed",
    },
    {
      id: "waste-2",
      name: "Damaged Fruits",
      type: "Fruits",
      quantity: 15,
      reportDate: "2025-03-28",
      disposalMethod: "Animal Feed",
      status: "processed",
    },
  ]

  const ngos = [
    { id: "ngo-1", name: "Food For All", distance: 5, accepts: "All food types" },
    { id: "ngo-2", name: "Hunger Relief", distance: 12, accepts: "Non-perishables" },
    { id: "ngo-3", name: "Community Kitchen", distance: 8, accepts: "Fresh produce" },
  ]

  const handleReportWaste = () => {
    setIsReporting(true)

    // Simulate reporting process
    setTimeout(() => {
      setIsReporting(false)
      toast({
        title: "Waste reported successfully",
        description: "The waste has been reported and will be processed accordingly.",
      })
    }, 2000)
  }

  return (
    <DashboardLayout userRole="retailer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Waste Management</h1>
          <p className="text-muted-foreground">Manage expiring items and food waste</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{expiringItems.length}</div>
              <p className="text-xs text-muted-foreground">Items expiring within 3 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Waste Reported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reportedWaste.reduce((total, item) => total + item.quantity, 0)} kg
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Sustainability Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85/100</div>
              <p className="text-xs text-muted-foreground">Based on waste management practices</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="expiring">
          <TabsList>
            <TabsTrigger value="expiring">Expiring Items</TabsTrigger>
            <TabsTrigger value="report">Report Waste</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="expiring" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {expiringItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{item.name}</CardTitle>
                      <Badge
                        variant={item.daysLeft <= 1 ? "destructive" : item.daysLeft <= 2 ? "default" : "secondary"}
                      >
                        {item.daysLeft} {item.daysLeft === 1 ? "day" : "days"} left
                      </Badge>
                    </div>
                    <CardDescription>
                      {item.type} - {item.quantity} kg
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Condition:</span>
                        <Badge variant="outline" className="capitalize">
                          {item.condition}
                        </Badge>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Recommended Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Leaf className="h-3 w-3" /> Discount
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Users className="h-3 w-3" /> Donate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2">
                      <Recycle className="h-4 w-4" /> Manage Item
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Food Waste</CardTitle>
                    <CardDescription>Report food items that need to be disposed of or redistributed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="product">Product Name</Label>
                          <Input id="product" placeholder="Enter product name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Product Type</Label>
                          <Select defaultValue="vegetables">
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vegetables">Vegetables</SelectItem>
                              <SelectItem value="fruits">Fruits</SelectItem>
                              <SelectItem value="dairy">Dairy</SelectItem>
                              <SelectItem value="bakery">Bakery</SelectItem>
                              <SelectItem value="grains">Grains</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity (kg)</Label>
                          <Input id="quantity" type="number" defaultValue="10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition</Label>
                          <Select defaultValue="good">
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="good">Good (Edible)</SelectItem>
                              <SelectItem value="fair">Fair (Slightly Damaged)</SelectItem>
                              <SelectItem value="poor">Poor (Not Edible)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Disposal</Label>
                        <Input id="reason" placeholder="e.g., Approaching expiry date" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="disposal">Preferred Disposal Method</Label>
                        <Select defaultValue="ngo">
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ngo">Donate to NGO</SelectItem>
                            <SelectItem value="animal">Animal Feed</SelectItem>
                            <SelectItem value="compost">Composting</SelectItem>
                            <SelectItem value="biogas">Biogas Generation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={handleReportWaste} disabled={isReporting}>
                      {isReporting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" /> Report Waste
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Nearby NGOs</CardTitle>
                    <CardDescription>Organizations that accept food donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ngos.map((ngo) => (
                        <div key={ngo.id} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{ngo.name}</h3>
                            <Badge variant="outline">{ngo.distance} km</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">Accepts: {ngo.accepts}</p>
                          <Button variant="outline" size="sm" className="mt-2 w-full">
                            Contact
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Waste History</CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search history..." className="w-[200px]" />
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportedWaste.map((waste) => (
                    <div key={waste.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{waste.name}</p>
                          <Badge variant="outline">{waste.quantity} kg</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Reported: {new Date(waste.reportDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Recycle className="h-3 w-3" />
                            <span>Method: {waste.disposalMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="capitalize">
                          {waste.status}
                        </Badge>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Processed on blockchain</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all history
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Waste Analytics</CardTitle>
            <CardDescription>Overview of your waste management performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Waste by Category</h3>
                </div>
                <div className="mt-4 space-y-4">
                  {[
                    { name: "Vegetables", amount: 45, percentage: 35 },
                    { name: "Fruits", amount: 32, percentage: 25 },
                    { name: "Dairy", amount: 28, percentage: 22 },
                    { name: "Bakery", amount: 23, percentage: 18 },
                  ].map((category, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{category.name}</span>
                        <span>{category.amount} kg</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Disposal Methods</h3>
                </div>
                <div className="mt-4 space-y-4">
                  {[
                    { method: "NGO Donation", amount: 65, percentage: 45 },
                    { method: "Animal Feed", amount: 42, percentage: 30 },
                    { method: "Composting", amount: 25, percentage: 18 },
                    { method: "Biogas", amount: 10, percentage: 7 },
                  ].map((method, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{method.method}</span>
                        <span>{method.amount} kg</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

