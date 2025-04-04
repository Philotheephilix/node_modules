"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  ExternalLink,
  MapPin,
  Package,
  QrCode,
  ThermometerSnowflake,
  Truck,
} from "lucide-react"

export default function TransportPage() {
  const activeShipments = [
    {
      id: "ship-1",
      cropName: "Premium Rice",
      quantity: 1200,
      supplier: "AgriDistributors Ltd.",
      departureDate: "2025-04-01T08:30:00",
      estimatedArrival: "2025-04-02T14:00:00",
      currentLocation: "Highway NH-48, Kilometer 120",
      status: "in-transit",
      progress: 65,
      temperature: 22,
      humidity: 45,
      qrCode: "SHIP-1234-ABCD",
    },
    {
      id: "ship-2",
      cropName: "Organic Wheat",
      quantity: 800,
      supplier: "FreshChain Supplies",
      departureDate: "2025-04-01T10:15:00",
      estimatedArrival: "2025-04-01T18:30:00",
      currentLocation: "City Distribution Center",
      status: "arrived",
      progress: 100,
      temperature: 21,
      humidity: 40,
      qrCode: "SHIP-5678-EFGH",
    },
  ]

  const completedShipments = [
    {
      id: "ship-3",
      cropName: "Mixed Vegetables",
      quantity: 750,
      supplier: "Organic Food Network",
      departureDate: "2025-03-28T09:00:00",
      arrivalDate: "2025-03-28T16:45:00",
      status: "delivered",
      qrCode: "SHIP-9012-IJKL",
    },
    {
      id: "ship-4",
      cropName: "Premium Wheat",
      quantity: 1800,
      supplier: "Rural Distributors Co.",
      departureDate: "2025-03-25T07:30:00",
      arrivalDate: "2025-03-25T14:15:00",
      status: "delivered",
      qrCode: "SHIP-3456-MNOP",
    },
  ]

  return (
    <DashboardLayout userRole="farmer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Transport Status</h1>
          <p className="text-muted-foreground">Track your produce through the supply chain</p>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Shipments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {activeShipments.map((shipment) => (
                <Card key={shipment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{shipment.cropName}</CardTitle>
                      <Badge variant={shipment.status === "in-transit" ? "default" : "secondary"}>
                        {shipment.status === "in-transit" ? "In Transit" : "Arrived"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {shipment.quantity} kg • To: {shipment.supplier}
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

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Current Location: {shipment.currentLocation}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <ThermometerSnowflake className="h-4 w-4 text-muted-foreground" />
                            <span>Temperature</span>
                          </div>
                          <p className="mt-1 text-lg font-medium">{shipment.temperature}°C</p>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Humidity</span>
                          </div>
                          <p className="mt-1 text-lg font-medium">{shipment.humidity}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">QR Code</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{shipment.qrCode}</span>
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2">
                      <Truck className="h-4 w-4" /> Track Live
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
                <CardDescription>History of your delivered produce</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{shipment.cropName}</p>
                          <Badge variant="outline">{shipment.quantity} kg</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Delivered: {new Date(shipment.arrivalDate).toLocaleString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            <span>To: {shipment.supplier}</span>
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
            <CardTitle>Blockchain Verification</CardTitle>
            <CardDescription>All shipments are verified on the blockchain for transparency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium">Shipment Ledger</h3>
                  <p className="text-sm text-muted-foreground">View the immutable record of all your shipments</p>
                </div>
                <Button variant="outline" className="gap-2 sm:mt-0">
                  <ExternalLink className="h-4 w-4" /> View on Blockchain
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

