"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, Eye, Leaf, Plus, QrCode } from "lucide-react"

export default function CropsPage() {
  const [crops, setCrops] = useState([
    {
      id: "crop-1",
      name: "Basmati Rice",
      type: "Rice",
      area: 5,
      plantingDate: "2025-01-15",
      expectedHarvest: "2025-04-15",
      status: "growing",
      healthScore: 92,
      expectedYield: 2500,
      qrCode: "RICE-1234-ABCD",
    },
    {
      id: "crop-2",
      name: "Wheat Field North",
      type: "Wheat",
      area: 8,
      plantingDate: "2025-02-10",
      expectedHarvest: "2025-05-20",
      status: "growing",
      healthScore: 88,
      expectedYield: 3600,
      qrCode: "WHEAT-5678-EFGH",
    },
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
  ])

  const [isAddingCrop, setIsAddingCrop] = useState(false)

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would add the crop to the database
    setIsAddingCrop(false)
  }

  return (
    <DashboardLayout userRole="farmer">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Crops</h1>
            <p className="text-muted-foreground">Manage your registered crops and livestock</p>
          </div>
          <Button onClick={() => setIsAddingCrop(true)}>
            <Plus className="mr-2 h-4 w-4" /> Register New Crop
          </Button>
        </div>

        {isAddingCrop ? (
          <Card>
            <CardHeader>
              <CardTitle>Register New Crop</CardTitle>
              <CardDescription>Enter details about your new crop or livestock</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddCrop}>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="crop-name">Crop Name</Label>
                    <Input id="crop-name" placeholder="e.g., North Field Rice" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop-type">Crop Type</Label>
                    <Select defaultValue="rice">
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="pulses">Pulses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (Hectares)</Label>
                    <Input id="area" type="number" min="0.1" step="0.1" placeholder="e.g., 5.0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected-yield">Expected Yield (kg)</Label>
                    <Input id="expected-yield" type="number" placeholder="e.g., 2500" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="planting-date">Planting Date</Label>
                    <Input id="planting-date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected-harvest">Expected Harvest Date</Label>
                    <Input id="expected-harvest" type="date" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farming-practices">Farming Practices</Label>
                  <Select defaultValue="organic">
                    <SelectTrigger>
                      <SelectValue placeholder="Select farming practice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="conventional">Conventional</SelectItem>
                      <SelectItem value="sustainable">Sustainable</SelectItem>
                      <SelectItem value="regenerative">Regenerative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setIsAddingCrop(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register Crop</Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Crops</TabsTrigger>
                  <TabsTrigger value="growing">Growing</TabsTrigger>
                  <TabsTrigger value="ready">Ready to Harvest</TabsTrigger>
                  <TabsTrigger value="harvested">Harvested</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {crops.map((crop) => (
                    <Card key={crop.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{crop.name}</CardTitle>
                          <Badge variant={crop.status === "ready" ? "default" : "secondary"}>
                            {crop.status === "growing"
                              ? "Growing"
                              : crop.status === "ready"
                                ? "Ready to Harvest"
                                : "Harvested"}
                          </Badge>
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
                              <span>Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}</span>
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
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        {crop.status === "ready" ? (
                          <Button size="sm">
                            <Leaf className="mr-2 h-4 w-4" /> Harvest
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" /> Details
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="growing" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {crops
                    .filter((crop) => crop.status === "growing")
                    .map((crop) => (
                      <Card key={crop.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle>{crop.name}</CardTitle>
                            <Badge variant="secondary">Growing</Badge>
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
                                <span>Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}</span>
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
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" /> Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="ready" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {crops
                    .filter((crop) => crop.status === "ready")
                    .map((crop) => (
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
                                <span>Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}</span>
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
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button size="sm">
                            <Leaf className="mr-2 h-4 w-4" /> Harvest
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="harvested" className="mt-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6">
                    <Leaf className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No harvested crops yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Your harvested crops will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

