"use client"

import { useState } from "react"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Separator } from "../../../../components/ui/separator"
import {
  Calendar,
  Check,
  ChevronRight,
  Filter,
  Leaf,
  MapPin,
  Search,
  ShoppingCart,
  Star,
  Truck,
  User,
  Wallet,
} from "lucide-react"
import { useToast } from "../../../../hooks/use-toast"
import React from "react"

export default function BuyPage() {
  const { toast } = useToast()
  const [isBuying, setIsBuying] = useState(false)

  const availableProduce = [
    {
      id: "prod-1",
      name: "Premium Rice",
      type: "Rice",
      quantity: 1200,
      price: 45,
      farmer: "Rajesh Kumar",
      location: "Punjab, India",
      distance: 120,
      harvestDate: "2025-03-25",
      organicCertified: true,
      sustainabilityScore: 92,
    },
    {
      id: "prod-2",
      name: "Organic Wheat",
      type: "Wheat",
      quantity: 1800,
      price: 32,
      farmer: "Amit Singh",
      location: "Haryana, India",
      distance: 85,
      harvestDate: "2025-03-20",
      organicCertified: true,
      sustainabilityScore: 88,
    },
    {
      id: "prod-3",
      name: "Mixed Vegetables",
      type: "Vegetables",
      quantity: 750,
      price: 45,
      farmer: "Priya Patel",
      location: "Gujarat, India",
      distance: 210,
      harvestDate: "2025-03-28",
      organicCertified: true,
      sustainabilityScore: 95,
    },
  ]

  const recentPurchases = [
    {
      id: "purchase-1",
      productName: "Organic Rice",
      quantity: 800,
      totalPrice: 36000,
      farmer: "Suresh Verma",
      purchaseDate: "2025-03-15",
      status: "delivered",
    },
    {
      id: "purchase-2",
      productName: "Premium Wheat",
      quantity: 1200,
      totalPrice: 38400,
      farmer: "Vikram Yadav",
      purchaseDate: "2025-03-10",
      status: "in-transit",
    },
    {
      id: "purchase-3",
      productName: "Fresh Vegetables",
      quantity: 500,
      totalPrice: 22500,
      farmer: "Meena Sharma",
      purchaseDate: "2025-03-05",
      status: "delivered",
    },
  ]

  const handleBuy = (productId: string) => {
    setIsBuying(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsBuying(false)
      toast({
        title: "Purchase successful",
        description: "Blockchain transaction confirmed. Your purchase has been recorded.",
      })
    }, 3000)
  }

  return (
    <DashboardLayout userRole="supplier">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Buy from Farmers</h1>
          <p className="text-muted-foreground">Purchase produce directly from farmers with blockchain transactions</p>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for produce..." className="flex-1" />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="available">Available Produce</TabsTrigger>
            <TabsTrigger value="purchases">Recent Purchases</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableProduce.map((product) => (
                <Card key={product.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{product.name}</CardTitle>
                      <Badge variant={product.organicCertified ? "default" : "secondary"}>
                        {product.organicCertified ? "Organic" : "Conventional"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {product.type} - {product.quantity} kg available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Farmer: {product.farmer}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {product.location} ({product.distance} km)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Leaf className="h-4 w-4 text-muted-foreground" />
                          <span>Sustainability Score:</span>
                        </div>
                        <Badge variant="outline" className="font-normal">
                          {product.sustainabilityScore}/100
                        </Badge>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Price per kg</span>
                          <p className="text-lg font-bold">₹{product.price}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Total Value</span>
                          <p className="text-lg font-bold">₹{(product.price * product.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={() => handleBuy(product.id)} disabled={isBuying}>
                      {isBuying ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" /> Purchase
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Purchases</CardTitle>
                <CardDescription>History of your purchases from farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div
                        className={`rounded-full p-2 ${purchase.status === "delivered" ? "bg-green-500/10" : "bg-blue-500/10"}`}
                      >
                        {purchase.status === "delivered" ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Truck className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{purchase.productName}</p>
                          <Badge variant="outline">{purchase.quantity} kg</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>From: {purchase.farmer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{purchase.totalPrice.toLocaleString()}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Wallet className="h-3 w-3" />
                          <span>Transaction confirmed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all purchases
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Top Rated Farmers</CardTitle>
            <CardDescription>Farmers with the highest quality produce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{i === 1 ? "Rajesh Kumar" : i === 2 ? "Priya Patel" : "Amit Singh"}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{i === 1 ? "Punjab" : i === 2 ? "Gujarat" : "Haryana"}, India</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        <span>{i === 1 ? "Rice" : i === 2 ? "Vegetables" : "Wheat"} Specialist</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{i === 1 ? "4.9" : i === 2 ? "4.8" : "4.7"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

