"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Calendar, Check, ChevronRight, Clock, Leaf, QrCode, Truck, Wallet } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function HarvestPage() {
  const { toast } = useToast()
  const [isHarvesting, setIsHarvesting] = useState(false)
  const [isSelling, setIsSelling] = useState(false)

  const readyToHarvestCrops = [
    {
      id: "crop-3",
      name: "Organic Vegetables",
      type: "Mixed Vegetables",
      area: 2,
      plantingDate: "2025-03-01",
      expectedHarvest: "2025-04-30",
      status: "ready",
      healthScore: 95,
      expectedYield: 800,
      qrCode: "VEG-9012-IJKL",
    },
  ]

  const harvestedCrops = [
    {
      id: "crop-4",
      name: "Premium Rice",
      type: "Rice",
      harvestDate: "2025-03-25",
      quantity: 1200,
      quality: "A",
      qrCode: "RICE-5678-MNOP",
      status: "harvested",
    },
    {
      id: "crop-5",
      name: "Wheat Field East",
      type: "Wheat",
      harvestDate: "2025-03-20",
      quantity: 1800,
      quality: "A+",
      qrCode: "WHEAT-9012-QRST",
      status: "harvested",
    },
  ]

  const suppliers = [
    { id: "sup-1", name: "AgriDistributors Ltd.", rating: 4.8, distance: 12 },
    { id: "sup-2", name: "FreshChain Supplies", rating: 4.6, distance: 18 },
    { id: "sup-3", name: "Organic Supply Network", rating: 4.9, distance: 25 },
    { id: "sup-4", name: "Rural Distributors Co.", rating: 4.5, distance: 8 },
  ]

  const handleHarvest = (cropId: string) => {
    setIsHarvesting(true)

    // Simulate harvesting process
    setTimeout(() => {
      setIsHarvesting(false)
      toast({
        title: "Crop harvested successfully",
        description: "Your crop has been harvested and is now ready for sale.",
      })
    }, 2000)
  }

  const handleSell = (cropId: string) => {
    setIsSelling(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSelling(false)
      toast({
        title: "Sale completed",
        description: "Blockchain transaction confirmed. QR code updated with sale information.",
      })
    }, 3000)
  }

  return (
    <DashboardLayout userRole="farmer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Harvest & Sell</h1>
          <p className="text-muted-foreground">Harvest your crops and sell them to suppliers</p>
        </div>

        <Tabs defaultValue="ready">
          <TabsList>
            <TabsTrigger value="ready">Ready to Harvest</TabsTrigger>
            <TabsTrigger value="harvested">Harvested</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>

          <TabsContent value="ready" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {readyToHarvestCrops.length > 0 ? (
                readyToHarvestCrops.map((crop) => (
                  <Card key={crop.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{crop.name}</CardTitle>
                        <Badge>Ready to Harvest</Badge>
                      </div>
                      <CardDescription>
                        {crop.type} - {crop.area} hectares
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Planted: {new Date(crop.plantingDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Expected Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Health Score</span>
                          <Badge variant="outline" className="font-normal">
                            {crop.healthScore}/100
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Expected Yield</span>
                          <span className="text-sm font-medium">{crop.expectedYield} kg</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">QR Code</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{crop.qrCode}</span>
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full gap-2" onClick={() => handleHarvest(crop.id)} disabled={isHarvesting}>
                        {isHarvesting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                            Harvesting...
                          </>
                        ) : (
                          <>
                            <Leaf className="h-4 w-4" /> Harvest Crop
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Leaf className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No crops ready for harvest</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    When your crops are ready to harvest, they will appear here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="harvested" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {harvestedCrops.map((crop) => (
                <Card key={crop.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{crop.name}</CardTitle>
                      <Badge variant="secondary">Harvested</Badge>
                    </div>
                    <CardDescription>
                      {crop.type} - {crop.quantity} kg
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Harvested: {new Date(crop.harvestDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Quality Grade:</span>
                          <Badge variant="outline">{crop.quality}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">QR Code</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{crop.qrCode}</span>
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="mb-2 text-sm font-medium">Sell to Supplier</h4>
                        <Select defaultValue="">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name} ({supplier.rating}★) - {supplier.distance}km
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`price-${crop.id}`}>Price per kg (₹)</Label>
                          <Input
                            id={`price-${crop.id}`}
                            type="number"
                            defaultValue={crop.type === "Rice" ? "45" : "32"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${crop.id}`}>Quantity (kg)</Label>
                          <Input
                            id={`quantity-${crop.id}`}
                            type="number"
                            defaultValue={crop.quantity}
                            max={crop.quantity}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg bg-muted p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Value</span>
                          <span className="font-bold">
                            ₹
                            {crop.type === "Rice"
                              ? (45 * crop.quantity).toLocaleString()
                              : (32 * crop.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={() => handleSell(crop.id)} disabled={isSelling}>
                      {isSelling ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Processing Transaction...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-4 w-4" /> Sell Crop
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sold" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sold Crops</CardTitle>
                <CardDescription>History of your sold crops and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {i === 1 ? "Organic Rice" : i === 2 ? "Premium Wheat" : "Mixed Vegetables"}
                          </p>
                          <Badge variant="outline">{i === 1 ? "1,200" : i === 2 ? "1,800" : "750"} kg</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Sold: {i === 1 ? "March 15, 2025" : i === 2 ? "March 10, 2025" : "February 28, 2025"}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            <span>
                              To:{" "}
                              {i === 1
                                ? "AgriDistributors Ltd."
                                : i === 2
                                  ? "FreshChain Supplies"
                                  : "Organic Supply Network"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{i === 1 ? "54,000" : i === 2 ? "57,600" : "33,750"}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>Transaction confirmed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all sold crops
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

