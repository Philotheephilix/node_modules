"use client"

import { useState } from "react"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  Package,
  QrCode,
  Search,
  ShoppingBag,
  Truck,
  Star,
} from "lucide-react"
import { useToast } from "../../../../hooks/use-toast"
import React from "react"

export default function DistributePage() {
  const { toast } = useToast()
  const [isAssigning, setIsAssigning] = useState(false)

  const inventory = [
    {
      id: "inv-1",
      name: "Premium Rice",
      type: "Rice",
      quantity: 12500,
      warehouse: "Central Warehouse",
      expiryDate: "2025-09-25",
      qrCode: "INV-1234-ABCD",
    },
    {
      id: "inv-2",
      name: "Organic Wheat",
      type: "Wheat",
      quantity: 8200,
      warehouse: "North Facility",
      expiryDate: "2025-09-20",
      qrCode: "INV-5678-EFGH",
    },
    {
      id: "inv-3",
      name: "Mixed Vegetables",
      type: "Vegetables",
      quantity: 4500,
      warehouse: "Cold Storage East",
      expiryDate: "2025-04-28",
      qrCode: "INV-9012-IJKL",
    },
  ]

  const retailers = [
    { id: "ret-1", name: "FreshMart", location: "Delhi", distance: 15, rating: 4.8 },
    { id: "ret-2", name: "GreenGrocer", location: "Mumbai", distance: 120, rating: 4.7 },
    { id: "ret-3", name: "SuperFresh", location: "Bangalore", distance: 210, rating: 4.9 },
    { id: "ret-4", name: "QuickMart", location: "Chennai", distance: 180, rating: 4.6 },
  ]

  const transporters = [
    { id: "trans-1", name: "SpeedLogistics", rating: 4.8, available: true },
    { id: "trans-2", name: "CoolChain Transport", rating: 4.9, available: true },
    { id: "trans-3", name: "EcoFreight", rating: 4.7, available: false },
    { id: "trans-4", name: "RapidDelivery", rating: 4.6, available: true },
  ]

  const activeShipments = [
    {
      id: "ship-1",
      productName: "Premium Rice",
      quantity: 2500,
      retailer: "FreshMart",
      departureDate: "2025-04-01T08:30:00",
      estimatedArrival: "2025-04-02T14:00:00",
      transporter: "SpeedLogistics",
      status: "in-transit",
      progress: 65,
    },
    {
      id: "ship-2",
      productName: "Organic Wheat",
      quantity: 1800,
      retailer: "GreenGrocer",
      departureDate: "2025-04-01T10:15:00",
      estimatedArrival: "2025-04-01T18:30:00",
      transporter: "CoolChain Transport",
      status: "arrived",
      progress: 100,
    },
  ]

  const handleAssignTransport = () => {
    setIsAssigning(true)

    // Simulate assignment process
    setTimeout(() => {
      setIsAssigning(false)
      toast({
        title: "Transport assigned",
        description: "The shipment has been assigned to the transporter and QR code updated.",
      })
    }, 2000)
  }

  return (
    <DashboardLayout userRole="supplier">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Distribute to Retailers</h1>
          <p className="text-muted-foreground">Assign transport and distribute products to retailers</p>
        </div>

        <Tabs defaultValue="assign">
          <TabsList>
            <TabsTrigger value="assign">Assign Transport</TabsTrigger>
            <TabsTrigger value="active">Active Shipments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="assign" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Inventory</CardTitle>
                    <CardDescription>Select products to distribute to retailers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search inventory..." className="flex-1" />
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {inventory.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{item.name}</p>
                              <Badge variant="outline">{item.quantity.toLocaleString()} kg</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span>Warehouse: {item.warehouse}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm">Select</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution Details</CardTitle>
                    <CardDescription>Configure shipment details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Selected Product</Label>
                      <Input id="product" value="Premium Rice" readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (kg)</Label>
                      <Input id="quantity" type="number" defaultValue="2500" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retailer">Retailer</Label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select retailer" />
                        </SelectTrigger>
                        <SelectContent>
                          {retailers.map((retailer) => (
                            <SelectItem key={retailer.id} value={retailer.id}>
                              {retailer.name} ({retailer.location})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transporter">Transporter</Label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select transporter" />
                        </SelectTrigger>
                        <SelectContent>
                          {transporters.map((transporter) => (
                            <SelectItem key={transporter.id} value={transporter.id} disabled={!transporter.available}>
                              {transporter.name} ({transporter.rating}★)
                              {!transporter.available && " - Unavailable"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Departure Date</Label>
                      <Input id="date" type="date" />
                    </div>

                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span>QR Code will be generated</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={handleAssignTransport} disabled={isAssigning}>
                      {isAssigning ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Assigning...
                        </>
                      ) : (
                        <>
                          <Truck className="h-4 w-4" /> Assign Transport
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {activeShipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{shipment.productName}</CardTitle>
                      <Badge variant={shipment.status === "in-transit" ? "default" : "secondary"}>
                        {shipment.status === "in-transit" ? "In Transit" : "Arrived"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {shipment.quantity.toLocaleString()} kg • To: {shipment.retailer}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Departed: {new Date(shipment.departureDate).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {shipment.status === "in-transit"
                              ? `ETA: ${new Date(shipment.estimatedArrival).toLocaleString()}`
                              : `Arrived: ${new Date(shipment.estimatedArrival).toLocaleString()}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>Transporter: {shipment.transporter}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2">
                      <Truck className="h-4 w-4" /> Track Shipment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Shipments</CardTitle>
                <CardDescription>History of completed deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {i === 1 ? "Premium Rice" : i === 2 ? "Organic Wheat" : "Mixed Vegetables"}
                          </p>
                          <Badge variant="outline">{i === 1 ? "2,000" : i === 2 ? "1,500" : "800"} kg</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Delivered: {i === 1 ? "March 28, 2025" : i === 2 ? "March 25, 2025" : "March 20, 2025"}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            <span>To: {i === 1 ? "FreshMart" : i === 2 ? "GreenGrocer" : "SuperFresh"}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Package className="h-4 w-4" /> Details
                      </Button>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all shipments
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Retailer Network</CardTitle>
            <CardDescription>Your connected retailers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {retailers.map((retailer) => (
                <div key={retailer.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{retailer.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {retailer.location} ({retailer.distance} km)
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{retailer.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Orders
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

