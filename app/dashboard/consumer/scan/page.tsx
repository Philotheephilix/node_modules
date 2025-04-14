"use client"

import { useState } from "react"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { ArrowRight, Calendar, Check, Clock, Leaf, MapPin, QrCode, Truck, User, Wallet } from "lucide-react"
import React from "react"

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<null | {
    id: string
    name: string
    origin: string
    farmer: string
    harvestDate: string
    journey: Array<{
      stage: string
      location: string
      timestamp: string
      verified: boolean
    }>
    price: number
    sustainabilityScore: number
  }>(null)

  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)

    // Simulate scanning a QR code
    setTimeout(() => {
      setScanning(false)
      setScanResult({
        id: "PROD-12345-RICE",
        name: "Organic Basmati Rice",
        origin: "Punjab, India",
        farmer: "Rajesh Kumar",
        harvestDate: "2025-03-15",
        journey: [
          {
            stage: "Harvested",
            location: "Kumar Farms, Punjab",
            timestamp: "2025-03-15T08:30:00",
            verified: true,
          },
          {
            stage: "Processed",
            location: "Punjab Rice Mill",
            timestamp: "2025-03-16T14:20:00",
            verified: true,
          },
          {
            stage: "Quality Check",
            location: "Supply Safety Lab, Delhi",
            timestamp: "2025-03-17T09:45:00",
            verified: true,
          },
          {
            stage: "Distributed",
            location: "National Distribution Center",
            timestamp: "2025-03-18T16:10:00",
            verified: true,
          },
          {
            stage: "Retailer Received",
            location: "FreshMart Store #42",
            timestamp: "2025-03-20T08:15:00",
            verified: true,
          },
        ],
        price: 120,
        sustainabilityScore: 92,
      })
    }, 2000)
  }

  const resetScan = () => {
    setScanResult(null)
  }

  return (
    <DashboardLayout userRole="consumer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Scan & Buy</h1>
          <p className="text-muted-foreground">
            Scan QR codes on Supply products to view their journey and make purchases
          </p>
        </div>

        {!scanResult ? (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Point your camera at a Supply product QR code</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-10">
              <div className="relative rounded-lg border-2 border-dashed p-12">
                <QrCode className="h-24 w-24 text-muted-foreground" />
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleScan} disabled={scanning} className="w-full">
                {scanning ? "Scanning..." : "Start Scanning"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{scanResult.name}</CardTitle>
                  <Badge className="bg-green-600">{scanResult.sustainabilityScore}/100</Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {scanResult.origin}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Farmer: {scanResult.farmer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Harvested: {new Date(scanResult.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Price: ₹{scanResult.price}</span>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 text-sm font-medium">Product Journey</h3>
                    <div className="space-y-3">
                      {scanResult.journey.map((step, index) => (
                        <div key={index} className="relative pl-6">
                          {index < scanResult.journey.length - 1 && (
                            <div className="absolute left-[9px] top-6 h-full w-[2px] bg-muted-foreground/20"></div>
                          )}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                              <span className="font-medium">{step.stage}</span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                {new Date(step.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {step.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={resetScan} variant="outline" className="w-full">
                  Scan Another Product
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Product</CardTitle>
                <CardDescription>Complete your purchase using blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="wallet">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="wallet">Blockchain Wallet</TabsTrigger>
                    <TabsTrigger value="airdrop">Use Airdrop</TabsTrigger>
                  </TabsList>

                  <TabsContent value="wallet" className="space-y-4 pt-4">
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Your Balance</span>
                          <span className="text-2xl font-bold">₹2,450</span>
                        </div>
                        <Wallet className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Product Price</span>
                        <span className="font-medium">₹{scanResult.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Transaction Fee</span>
                        <span className="font-medium">₹2</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total</span>
                        <span className="font-medium">₹{scanResult.price + 2}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="airdrop" className="space-y-4 pt-4">
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Airdrop Balance</span>
                          <span className="text-2xl font-bold">₹500</span>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" /> Expires in 15 days
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Product Price</span>
                        <span className="font-medium">₹{scanResult.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Transaction Fee</span>
                        <span className="font-medium">₹0</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total</span>
                        <span className="font-medium">₹{scanResult.price}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2">
                  Complete Purchase <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sustainability Information</CardTitle>
                <CardDescription>Environmental impact of this product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Farming Practices</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Organic farming with minimal pesticide use and sustainable water management.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Transportation</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Optimized logistics with 85% lower carbon footprint than conventional methods.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium">Local Impact</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Supports local farming communities and fair trade practices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

