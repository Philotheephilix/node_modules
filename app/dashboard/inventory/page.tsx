"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Filter,
  Package,
  QrCode,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function InventoryPage() {
  const { toast } = useToast()
  const [isOrdering, setIsOrdering] = useState(false)

  const inventory = [
    {
      id: "inv-1",
      name: "Premium Rice",
      type: "Rice",
      quantity: 450,
      supplier: "AgriDistributors Ltd.",
      purchaseDate: "2025-03-25",
      expiryDate: "2025-09-25",
      stockLevel: 75,
      price: 55,
      qrCode: "INV-1234-ABCD",
    },
    {
      id: "inv-2",
      name: "Organic Wheat",
      type: "Wheat",
      quantity: 320,
      supplier: "FreshChain Supplies",
      purchaseDate: "2025-03-20",
      expiryDate: "2025-09-20",
      stockLevel: 60,
      price: 42,
      qrCode: "INV-5678-EFGH",
    },
    {
      id: "inv-3",
      name: "Mixed Vegetables",
      type: "Vegetables",
      quantity: 180,
      supplier: "Organic Food Network",
      purchaseDate: "2025-03-28",
      expiryDate: "2025-04-28",
      stockLevel: 30,
      price: 65,
      qrCode: "INV-9012-IJKL",
    },
  ]

  const lowStock = inventory.filter((item) => item.stockLevel < 40)

  const incomingOrders = [
    {
      id: "order-1",
      productName: "Premium Rice",
      quantity: 200,
      supplier: "AgriDistributors Ltd.",
      orderDate: "2025-04-01",
      expectedDelivery: "2025-04-03",
      status: "in-transit",
    },
    {
      id: "order-2",
      productName: "Fresh Fruits",
      quantity: 150,
      supplier: "FreshChain Supplies",
      orderDate: "2025-03-30",
      expectedDelivery: "2025-04-02",
      status: "processing",
    },
  ]

  const handleOrder = () => {
    setIsOrdering(true)

    // Simulate order process
    setTimeout(() => {
      setIsOrdering(false)
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and will be delivered soon.",
      })
    }, 2000)
  }

  return (
    <DashboardLayout userRole="retailer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your store inventory and stock levels</p>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="flex-1" />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground">{lowStock.length} items low in stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inventory.reduce((total, item) => total + item.quantity, 0)} kg</div>
              <p className="text-xs text-muted-foreground">Across all products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Incoming Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{incomingOrders.length}</div>
              <p className="text-xs text-muted-foreground">Expected within 3 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="low">Low Stock</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{item.name}</CardTitle>
                      <Badge variant={item.stockLevel < 40 ? "destructive" : "secondary"}>
                        {item.stockLevel < 40 ? "Low Stock" : "In Stock"}
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
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>Supplier: {item.supplier}</span>
                        </div>
                      </div>

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

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Stock Level</span>
                          <span>{item.stockLevel}%</span>
                        </div>
                        <Progress
                          value={item.stockLevel}
                          className={`h-2 ${item.stockLevel < 40 ? "bg-destructive/20" : ""}`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Price per kg</span>
                        <span className="font-medium">₹{item.price}</span>
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
                      <ShoppingBag className="h-4 w-4" /> Order More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="low" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lowStock.length > 0 ? (
                lowStock.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{item.name}</CardTitle>
                        <Badge variant="destructive">Low Stock</Badge>
                      </div>
                      <CardDescription>
                        {item.type} - {item.quantity} kg
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>Supplier: {item.supplier}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Stock Level</span>
                            <span>{item.stockLevel}%</span>
                          </div>
                          <Progress value={item.stockLevel} className="h-2 bg-destructive/20" />
                        </div>

                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-destructive">
                              Recommended: Order at least {200 - item.quantity} kg more
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full gap-2" onClick={handleOrder} disabled={isOrdering}>
                        {isOrdering ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" /> Order Now
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Check className="mb-4 h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-medium">All products well stocked</h3>
                  <p className="mt-2 text-sm text-muted-foreground">You have no products with low stock levels</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="incoming" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
                <CardDescription>Orders that are on their way to your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomingOrders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div
                        className={`rounded-full p-2 ${order.status === "in-transit" ? "bg-blue-500/10" : "bg-yellow-500/10"}`}
                      >
                        {order.status === "in-transit" ? (
                          <Truck className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Package className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{order.productName}</p>
                          <Badge variant={order.status === "in-transit" ? "default" : "outline"}>
                            {order.status === "in-transit" ? "In Transit" : "Processing"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            <span>From: {order.supplier}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.quantity} kg</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>ETA: {new Date(order.expectedDelivery).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all orders
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

