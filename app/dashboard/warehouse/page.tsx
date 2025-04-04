"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Droplets,
  Filter,
  Leaf,
  Package,
  QrCode,
  Search,
  ThermometerSnowflake,
  Truck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WarehousePage() {
  const { toast } = useToast()
  const [isLogging, setIsLogging] = useState(false)

  const inventory = [
    {
      id: "inv-1",
      name: "Premium Rice",
      type: "Rice",
      quantity: 12500,
      farmer: "Rajesh Kumar",
      purchaseDate: "2025-03-25",
      expiryDate: "2025-09-25",
      warehouse: "Central Warehouse",
      temperature: 22,
      humidity: 45,
      qualityScore: 92,
      qrCode: "INV-1234-ABCD",
    },
    {
      id: "inv-2",
      name: "Organic Wheat",
      type: "Wheat",
      quantity: 8200,
      farmer: "Amit Singh",
      purchaseDate: "2025-03-20",
      expiryDate: "2025-09-20",
      warehouse: "North Facility",
      temperature: 21,
      humidity: 40,
      qualityScore: 88,
      qrCode: "INV-5678-EFGH",
    },
    {
      id: "inv-3",
      name: "Mixed Vegetables",
      type: "Vegetables",
      quantity: 4500,
      farmer: "Priya Patel",
      purchaseDate: "2025-03-28",
      expiryDate: "2025-04-28",
      warehouse: "Cold Storage East",
      temperature: 4,
      humidity: 85,
      qualityScore: 95,
      qrCode: "INV-9012-IJKL",
    },
  ]

  const qualityChecks = [
    {
      id: "qc-1",
      productName: "Premium Rice",
      checkDate: "2025-04-01",
      inspector: "Rahul Sharma",
      result: "passed",
      notes: "Meets all quality standards. Moisture content within acceptable range.",
    },
    {
      id: "qc-2",
      productName: "Organic Wheat",
      checkDate: "2025-03-30",
      inspector: "Neha Gupta",
      result: "passed",
      notes: "Excellent quality. No signs of contamination or pests.",
    },
    {
      id: "qc-3",
      productName: "Mixed Vegetables",
      checkDate: "2025-03-29",
      inspector: "Vikram Yadav",
      result: "attention",
      notes: "Some items showing early signs of ripening. Recommend expedited distribution.",
    },
  ]

  const handleLogQualityCheck = () => {
    setIsLogging(true)

    // Simulate logging process
    setTimeout(() => {
      setIsLogging(false)
      toast({
        title: "Quality check logged",
        description: "The quality check has been recorded on the blockchain.",
      })
    }, 2000)
  }

  return (
    <DashboardLayout userRole="supplier">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Warehouse & Processing</h1>
          <p className="text-muted-foreground">Manage inventory and quality checks in your warehouses</p>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="flex-1" />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="inventory">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="quality">Quality Checks</TabsTrigger>
            <TabsTrigger value="conditions">Storage Conditions</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{item.name}</CardTitle>
                      <Badge>{item.type}</Badge>
                    </div>
                    <CardDescription>{item.quantity.toLocaleString()} kg in stock</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>Warehouse: {item.warehouse}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Quality Score</span>
                          <span>{item.qualityScore}/100</span>
                        </div>
                        <Progress value={item.qualityScore} className="h-2" />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <ThermometerSnowflake className="h-4 w-4 text-muted-foreground" />
                            <span>Temperature</span>
                          </div>
                          <p className="mt-1 text-lg font-medium">{item.temperature}°C</p>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                            <span>Humidity</span>
                          </div>
                          <p className="mt-1 text-lg font-medium">{item.humidity}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">QR Code</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{item.qrCode}</span>
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button variant="outline" className="w-full gap-2">
                      <Package className="h-4 w-4" /> Details
                    </Button>
                    <Button className="w-full gap-2">
                      <Truck className="h-4 w-4" /> Distribute
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quality" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Quality Checks</CardTitle>
                    <CardDescription>History of quality inspections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {qualityChecks.map((check) => (
                        <div key={check.id} className="flex items-center gap-4 rounded-lg border p-4">
                          <div
                            className={`rounded-full p-2 ${check.result === "passed" ? "bg-green-500/10" : "bg-yellow-500/10"}`}
                          >
                            {check.result === "passed" ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{check.productName}</p>
                              <Badge variant={check.result === "passed" ? "outline" : "default"}>
                                {check.result === "passed" ? "Passed" : "Needs Attention"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Date: {new Date(check.checkDate).toLocaleDateString()}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                <span>Inspector: {check.inspector}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{check.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button variant="ghost" className="mt-4 w-full" size="sm">
                      View all quality checks
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Log New Check</CardTitle>
                    <CardDescription>Record a new quality inspection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <Input id="product" placeholder="Select product" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inspector">Inspector Name</Label>
                      <Input id="inspector" placeholder="Enter name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="result">Result</Label>
                      <Input id="result" placeholder="Passed/Failed" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input id="notes" placeholder="Enter inspection notes" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleLogQualityCheck} disabled={isLogging}>
                      {isLogging ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Logging...
                        </>
                      ) : (
                        "Log Quality Check"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Warehouse Conditions</CardTitle>
                  <CardDescription>Current storage environment metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Central Warehouse", temp: 22, humidity: 45, capacity: 75 },
                      { name: "North Facility", temp: 21, humidity: 40, capacity: 60 },
                      { name: "Cold Storage East", temp: 4, humidity: 85, capacity: 90 },
                    ].map((warehouse, i) => (
                      <div key={i} className="rounded-lg border p-4">
                        <h3 className="font-medium">{warehouse.name}</h3>
                        <div className="mt-2 grid grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ThermometerSnowflake className="h-4 w-4" />
                              <span>Temperature</span>
                            </div>
                            <p className="text-lg font-medium">{warehouse.temp}°C</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Droplets className="h-4 w-4" />
                              <span>Humidity</span>
                            </div>
                            <p className="text-lg font-medium">{warehouse.humidity}%</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Package className="h-4 w-4" />
                              <span>Capacity</span>
                            </div>
                            <p className="text-lg font-medium">{warehouse.capacity}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimal Storage Conditions</CardTitle>
                  <CardDescription>Recommended storage parameters by product type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "Rice",
                        temp: "20-25°C",
                        humidity: "40-60%",
                        notes: "Keep dry and away from direct sunlight",
                      },
                      { type: "Wheat", temp: "15-25°C", humidity: "35-60%", notes: "Monitor for pests regularly" },
                      {
                        type: "Vegetables",
                        temp: "2-8°C",
                        humidity: "80-95%",
                        notes: "Separate ethylene-producing items",
                      },
                      { type: "Fruits", temp: "8-12°C", humidity: "85-95%", notes: "Check ripeness daily" },
                    ].map((product, i) => (
                      <div key={i} className="rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{product.type}</h3>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Temperature:</span>
                            <span>{product.temp}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Humidity:</span>
                            <span>{product.humidity}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Notes:</span>
                            <p className="mt-1">{product.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

