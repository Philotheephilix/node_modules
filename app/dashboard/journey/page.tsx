"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Filter,
  Leaf,
  MapPin,
  Package,
  QrCode,
  Search,
  ThermometerSnowflake,
  Truck,
  User,
} from "lucide-react"

export default function JourneyPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const recentPurchases = [
    {
      id: "purchase-1",
      name: "Organic Rice",
      type: "Rice",
      quantity: 5,
      purchaseDate: "2025-04-01",
      retailer: "FreshMart",
      qrCode: "RICE-1234-ABCD",
      sustainabilityScore: 92,
    },
    {
      id: "purchase-2",
      name: "Whole Wheat",
      type: "Wheat",
      quantity: 3,
      purchaseDate: "2025-03-28",
      retailer: "GreenGrocer",
      qrCode: "WHEAT-5678-EFGH",
      sustainabilityScore: 88,
    },
    {
      id: "purchase-3",
      name: "Mixed Vegetables",
      type: "Vegetables",
      quantity: 2,
      purchaseDate: "2025-03-25",
      retailer: "SuperFresh",
      qrCode: "VEG-9012-IJKL",
      sustainabilityScore: 95,
    },
  ]

  const selectedJourney = {
    id: "journey-1",
    productName: "Organic Rice",
    qrCode: "RICE-1234-ABCD",
    journey: [
      {
        stage: "Harvested",
        location: "Kumar Farms, Punjab",
        timestamp: "2025-03-15T08:30:00",
        actor: "Rajesh Kumar (Farmer)",
        verified: true,
        details: {
          farmingPractice: "Organic",
          pesticidesUsed: "None",
          waterUsage: "Rainwater harvesting",
        },
      },
      {
        stage: "Processed",
        location: "Punjab Rice Mill",
        timestamp: "2025-03-16T14:20:00",
        actor: "Punjab Rice Mill",
        verified: true,
        details: {
          processingMethod: "Traditional",
          qualityGrade: "A+",
          additives: "None",
        },
      },
      {
        stage: "Quality Check",
        location: "Supply Safety Lab, Delhi",
        timestamp: "2025-03-17T09:45:00",
        actor: "Supply Safety Authority",
        verified: true,
        details: {
          testResults: "Passed all tests",
          contaminants: "None detected",
          nutritionalAnalysis: "High protein content",
        },
      },
      {
        stage: "Distributed",
        location: "AgriDistributors Ltd.",
        timestamp: "2025-03-18T16:10:00",
        actor: "AgriDistributors Ltd.",
        verified: true,
        details: {
          transportConditions: "Temperature controlled",
          distance: "120 km",
          carbonFootprint: "Low - Electric vehicle used",
        },
      },
      {
        stage: "Retailer Received",
        location: "FreshMart Store #42",
        timestamp: "2025-03-20T08:15:00",
        actor: "FreshMart",
        verified: true,
        details: {
          storageConditions: "Optimal humidity and temperature",
          shelfLife: "6 months",
          packaging: "Eco-friendly",
        },
      },
      {
        stage: "Purchased",
        location: "FreshMart Store #42",
        timestamp: "2025-04-01T14:30:00",
        actor: "You (Consumer)",
        verified: true,
        details: {
          paymentMethod: "Blockchain Wallet",
          price: "₹55 per kg",
          quantity: "5 kg",
        },
      },
    ],
    sustainabilityMetrics: {
      waterUsage: "Low",
      carbonFootprint: "Very Low",
      chemicalUse: "None",
      packaging: "Biodegradable",
      transportEfficiency: "High",
      overallScore: 92,
    },
  }

  return (
    <DashboardLayout userRole="consumer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Supply Journey Tracker</h1>
          <p className="text-muted-foreground">Track where your Supply comes from and how it reached your plate</p>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or QR code..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent Purchases</TabsTrigger>
            <TabsTrigger value="journey">Supply Journey</TabsTrigger>
            <TabsTrigger value="scan">Scan QR</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPurchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{purchase.name}</CardTitle>
                      <Badge className="bg-green-600">{purchase.sustainabilityScore}/100</Badge>
                    </div>
                    <CardDescription>
                      {purchase.type} - {purchase.quantity} kg
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>Retailer: {purchase.retailer}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">QR Code</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{purchase.qrCode}</span>
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2">
                      <Truck className="h-4 w-4" /> View Journey
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="journey" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedJourney.productName}</CardTitle>
                        <CardDescription>QR Code: {selectedJourney.qrCode}</CardDescription>
                      </div>
                      <Badge className="bg-green-600">{selectedJourney.sustainabilityMetrics.overallScore}/100</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="relative pl-8">
                        {selectedJourney.journey.map((step, index) => (
                          <div key={index} className="relative mb-8">
                            {index < selectedJourney.journey.length - 1 && (
                              <div className="absolute left-[9px] top-6 h-full w-[2px] bg-muted-foreground/20"></div>
                            )}
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium">{step.stage}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(step.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {step.location}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3" /> {step.actor}
                              </div>
                              <div className="mt-2 rounded-lg bg-muted p-3 text-sm">
                                <h4 className="font-medium mb-1">Details:</h4>
                                <ul className="space-y-1">
                                  {Object.entries(step.details).map(([key, value]) => (
                                    <li key={key} className="flex items-center justify-between">
                                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                                      <span>{value as string}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" /> View on Blockchain
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sustainability Metrics</CardTitle>
                    <CardDescription>Environmental impact of this product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(selectedJourney.sustainabilityMetrics).map(
                        ([key, value]) =>
                          key !== "overallScore" && (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                              <Badge variant="outline">{value as string}</Badge>
                            </div>
                          ),
                      )}

                      <Separator />

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-green-500" />
                          <h3 className="font-medium">Overall Impact</h3>
                        </div>
                        <p className="mt-2 text-sm">
                          This product has a significantly lower environmental impact than conventional alternatives. It
                          uses sustainable farming practices, minimal water, and efficient transportation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transport Conditions</CardTitle>
                    <CardDescription>How your Supply was transported</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <ThermometerSnowflake className="h-4 w-4 text-muted-foreground" />
                            <span>Temperature</span>
                          </div>
                          <p className="mt-1 text-lg font-medium">22°C</p>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Transit Time</span>
                          </div>
                          <p className="mt-1 text-lg font-medium">3 days</p>
                        </div>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>Transport Method</span>
                        </div>
                        <p className="mt-1 text-sm">
                          Electric vehicle for local transport, energy-efficient refrigerated truck for long distance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scan" className="mt-6">
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Scan a QR code on a Supply product to view its journey</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4 py-10">
                <div className="relative rounded-lg border-2 border-dashed p-12">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Scanning</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Supply Transparency</CardTitle>
            <CardDescription>Benefits of blockchain-verified Supply tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Supply Safety</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Verify that your Supply has passed all safety checks and inspections.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Sustainability</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Make informed choices based on environmental impact and farming practices.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Fair Trade</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ensure farmers receive fair compensation for their produce.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

