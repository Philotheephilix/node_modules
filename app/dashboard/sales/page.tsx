"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import {
  BarChart,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Filter,
  LineChart,
  QrCode,
  Search,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function SalesPage() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const recentSales = [
    {
      id: "sale-1",
      productName: "Premium Rice",
      quantity: 5,
      price: 55,
      total: 275,
      customer: "Walk-in Customer",
      date: "2025-04-01T14:30:00",
      paymentMethod: "Cash",
      qrScanned: true,
    },
    {
      id: "sale-2",
      productName: "Organic Wheat",
      quantity: 3,
      price: 42,
      total: 126,
      customer: "Rahul Mehta",
      date: "2025-04-01T12:15:00",
      paymentMethod: "Blockchain Wallet",
      qrScanned: true,
    },
    {
      id: "sale-3",
      productName: "Mixed Vegetables",
      quantity: 2,
      price: 65,
      total: 130,
      customer: "Priya Sharma",
      date: "2025-04-01T10:45:00",
      paymentMethod: "Blockchain Wallet",
      qrScanned: true,
    },
  ]

  const pendingSales = [
    {
      id: "pending-1",
      productName: "Fresh Fruits",
      quantity: 4,
      price: 75,
      total: 300,
      customer: "Amit Patel",
      date: "2025-04-01T15:30:00",
      status: "awaiting-payment",
    },
  ]

  const handleProcessSale = () => {
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Sale completed",
        description: "The sale has been processed and recorded on the blockchain.",
      })
    }, 2000)
  }

  return (
    <DashboardLayout userRole="retailer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">Process sales and track transactions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{recentSales.reduce((total, sale) => total + sale.total, 0)}</div>
              <p className="text-xs text-muted-foreground">{recentSales.length} transactions today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Items Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recentSales.reduce((total, sale) => total + sale.quantity, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Blockchain Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {recentSales.filter((sale) => sale.paymentMethod === "Blockchain Wallet").length}
              </div>
              <p className="text-xs text-muted-foreground">Out of {recentSales.length} transactions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>New Sale</CardTitle>
                <CardDescription>Process a new sale transaction</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Scan QR Code
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Input placeholder="Search products..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input type="number" defaultValue="1" min="1" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer</label>
                  <Input placeholder="Walk-in Customer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <Input defaultValue="Blockchain Wallet" />
                </div>
              </div>

              <Separator />

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span>₹0.00</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Tax (5%)</span>
                  <span>₹0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold">₹0.00</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={handleProcessSale} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Process Sale
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent Sales</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Sales</CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search sales..." className="w-[200px]" />
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{sale.productName}</p>
                          <Badge variant="outline">
                            {sale.quantity} × ₹{sale.price}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(sale.date).toLocaleString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{sale.customer}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            <span>{sale.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{sale.total}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          {sale.qrScanned ? (
                            <>
                              <QrCode className="h-3 w-3" />
                              <span>QR Verified</span>
                            </>
                          ) : (
                            <>
                              <QrCode className="h-3 w-3" />
                              <span>No QR</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all sales
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Sales</CardTitle>
                <CardDescription>Sales awaiting payment or processing</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingSales.length > 0 ? (
                  <div className="space-y-4">
                    {pendingSales.map((sale) => (
                      <div key={sale.id} className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="rounded-full bg-yellow-500/10 p-2">
                          <Clock className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{sale.productName}</p>
                            <Badge>Awaiting Payment</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(sale.date).toLocaleString()}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{sale.customer}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{sale.total}</p>
                          <Button size="sm" className="mt-2">
                            Complete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Check className="mb-4 h-12 w-12 text-green-500" />
                    <h3 className="text-lg font-medium">No pending sales</h3>
                    <p className="mt-2 text-sm text-muted-foreground">All sales have been processed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>Overview of your sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Daily Sales</h3>
                </div>
                <div className="mt-4 h-[200px] w-full rounded-lg bg-muted/50 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Sales chart visualization</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Top Selling Products</h3>
                </div>
                <div className="mt-4 space-y-4">
                  {[
                    { name: "Premium Rice", sales: 45, percentage: 35 },
                    { name: "Organic Wheat", sales: 32, percentage: 25 },
                    { name: "Mixed Vegetables", sales: 28, percentage: 22 },
                    { name: "Fresh Fruits", sales: 23, percentage: 18 },
                  ].map((product, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{product.name}</span>
                        <span>{product.sales} sales</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${product.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

