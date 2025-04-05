"use client"

import { useState } from "react"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Progress } from "../../../../components/ui/progress"
import {
  AlertCircle,
  BarChart,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  Filter,
  LineChart,
  MapPin,
  Package,
  Search,
  Shield,
  User,
} from "lucide-react"
import React from "react"

export default function MonitorPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const StockR00tStats = {
    activeTransactions: 1245,
    registeredFarmers: 2450,
    totalProducts: 156,
    averageJourneyTime: 5.2,
  }

  const activeTransactions = [
    {
      id: "tx-1",
      type: "Harvest",
      product: "Premium Rice",
      quantity: 1200,
      actor: "Rajesh Kumar (Farmer)",
      location: "Punjab, India",
      timestamp: "2025-04-01T08:30:00",
      status: "completed",
      blockchainId: "0x7F5EB5bB5cF88cfcEe9613368636f458800e62CB",
    },
    {
      id: "tx-2",
      type: "Purchase",
      product: "Organic Wheat",
      quantity: 800,
      actor: "AgriDistributors Ltd. (Supplier)",
      location: "Haryana, India",
      timestamp: "2025-04-01T10:15:00",
      status: "in-progress",
      blockchainId: "0x3a8d...1f9c",
    },
    {
      id: "tx-3",
      type: "Distribution",
      product: "Mixed Vegetables",
      quantity: 450,
      actor: "FreshChain Supplies (Supplier)",
      location: "Delhi, India",
      timestamp: "2025-04-01T09:45:00",
      status: "completed",
      blockchainId: "0x5f1a...8c3b",
    },
  ]

  const alerts = [
    {
      id: "alert-1",
      type: "Temperature Deviation",
      product: "Dairy Products",
      severity: "high",
      location: "Cold Storage East",
      timestamp: "2025-04-01T11:30:00",
      details: "Temperature exceeded safe threshold by 4°C for 30 minutes",
    },
    {
      id: "alert-2",
      type: "Delayed Shipment",
      product: "Fresh Fruits",
      severity: "medium",
      location: "Highway NH-48, Kilometer 120",
      timestamp: "2025-04-01T10:45:00",
      details: "Shipment delayed by 3 hours due to traffic congestion",
    },
  ]

  return (
    <DashboardLayout userRole="government">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Supply Chain Monitor</h1>
          <p className="text-muted-foreground">Real-time monitoring of the Supply supply chain</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{StockR00tStats.activeTransactions}</div>
              <p className="text-xs text-muted-foreground">Across the supply chain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Registered Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{StockR00tStats.registeredFarmers}</div>
              <p className="text-xs text-muted-foreground">+120 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{StockR00tStats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Being tracked on blockchain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Avg. Journey Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{StockR00tStats.averageJourneyTime} days</div>
              <p className="text-xs text-muted-foreground">Farm to retailer</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, products, or actors..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Transactions</CardTitle>
                <CardDescription>Real-time blockchain transactions in the supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div
                        className={`rounded-full p-2 ${tx.status === "completed" ? "bg-green-500/10" : "bg-blue-500/10"}`}
                      >
                        {tx.status === "completed" ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Package className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {tx.type}: {tx.product}
                          </p>
                          <Badge variant={tx.status === "completed" ? "outline" : "default"}>
                            {tx.status === "completed" ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{tx.actor}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{tx.location}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(tx.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{tx.quantity} kg</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <span className="font-mono">
                            {tx.blockchainId.length > 10
                              ? `${tx.blockchainId.substring(0, 6)}...${tx.blockchainId.substring(tx.blockchainId.length - 4)}`
                              : tx.blockchainId}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all transactions
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Issues requiring attention in the supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div
                        className={`rounded-full p-2 ${alert.severity === "high" ? "bg-red-500/10" : "bg-yellow-500/10"}`}
                      >
                        <AlertCircle
                          className={`h-5 w-5 ${alert.severity === "high" ? "text-red-500" : "text-yellow-500"}`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{alert.type}</p>
                          <Badge variant={alert.severity === "high" ? "destructive" : "default"}>
                            {alert.severity === "high" ? "High" : "Medium"} Severity
                          </Badge>
                        </div>
                        <p className="text-sm">{alert.details}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{alert.product}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{alert.location}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Investigate</Button>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all alerts
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Performance</CardTitle>
                  <CardDescription>Key metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Transaction Volume</span>
                        <span>+12% from last month</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[75%] rounded-full bg-primary"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Average Processing Time</span>
                        <span>-8% from last month</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[65%] rounded-full bg-primary"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Supply Waste Reduction</span>
                        <span>+15% from last month</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[85%] rounded-full bg-primary"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Blockchain Verification Rate</span>
                        <span>+5% from last month</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full w-[92%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-[200px] w-full rounded-lg bg-muted/50 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Performance chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Distribution</CardTitle>
                  <CardDescription>Current distribution of products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Rice", percentage: 35, quantity: "12,500 kg" },
                      { name: "Wheat", percentage: 25, quantity: "8,200 kg" },
                      { name: "Vegetables", percentage: 20, quantity: "6,800 kg" },
                      { name: "Fruits", percentage: 15, quantity: "5,200 kg" },
                      { name: "Dairy", percentage: 5, quantity: "1,800 kg" },
                    ].map((product, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{product.name}</span>
                          <span>
                            {product.quantity} ({product.percentage}%)
                          </span>
                        </div>
                        <Progress value={product.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 h-[200px] w-full rounded-lg bg-muted/50 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Distribution chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Map</CardTitle>
            <CardDescription>Geographic visualization of the supply chain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-lg border flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Interactive supply chain map visualization</p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Full Map
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full gap-2">
              <ExternalLink className="h-4 w-4" /> View Blockchain Explorer
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Overview</CardTitle>
            <CardDescription>Blockchain security and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Blockchain Integrity</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  All transactions are verified and secured on the blockchain.
                </p>
                <Badge variant="outline" className="mt-1">
                  100% Verified
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Smart Contract Status</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  All smart contracts are functioning correctly with no issues.
                </p>
                <Badge variant="outline" className="mt-1">
                  Operational
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">System Health</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  All systems are operating normally with no detected anomalies.
                </p>
                <Badge variant="outline" className="mt-1">
                  Healthy
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

