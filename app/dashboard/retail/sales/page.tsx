"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Separator } from "../../../../components/ui/separator"
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
import { useToast } from "../../../../hooks/use-toast"
import React from "react"
import { ethers } from "ethers"
import TokenFactory from "../../../../contracts/TokenFactory.json"
import StockR00tToken from "../../../../contracts/SupplyToken.json"

interface Transaction {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  customer: string;
  date: string;
  paymentMethod: string;
  qrScanned: boolean;
  status?: string;
}

export default function SalesPage() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [recentSales, setRecentSales] = useState<Transaction[]>([])
  const [pendingSales, setPendingSales] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<{
    address: string;
    name: string;
    price: number;
    quantity: number;
  } | null>(null)
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [customerName, setCustomerName] = useState("")

  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)
          
          const signer = await provider.getSigner()
          setSigner(signer)
          
          const contractAddress = process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS
          if (!contractAddress) {
            throw new Error("Token Factory contract address not configured")
          }

          const tokenFactory = new ethers.Contract(
            contractAddress,
            TokenFactory.output.abi,
            signer
          )
          setContract(tokenFactory)
        } catch (error) {
          console.error("Error initializing provider:", error)
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to connect to wallet",
            variant: "destructive"
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Please install MetaMask or another Web3 wallet",
          variant: "destructive"
        })
      }
    }

    initializeProvider()
  }, [toast])

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!contract || !signer) return

      try {
        setLoading(true)
        const tokenFactory = contract
        
        // Get all token addresses using getAllTokens
        const tokenAddresses = await tokenFactory.getAllTokens()
        
        // Process tokens
        const processedSales: Transaction[] = []
        const processedPending: Transaction[] = []
        
        for (const address of tokenAddresses) {
          // Get token details
          const tokenContract = new ethers.Contract(
            address,
            StockR00tToken.output.abi,
            signer
          )
          
          const [name, symbol, balance] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.balanceOf(await signer.getAddress())
          ])
          
          // Parse token name to get product details
          const nameParts = name.split(' ')
          const brand = nameParts[0]
          const model = nameParts.slice(1).join(' ')
          
          // Calculate price based on token type
          const basePrices: Record<string, number> = {
            'phone': 500,
            'laptop': 1000,
            'tablet': 400,
            'monitor': 300,
            'printer': 200,
            'default': 200
          }
          
          let basePrice = basePrices.default
          for (const [key, price] of Object.entries(basePrices)) {
            if (name.toLowerCase().includes(key)) {
              basePrice = price
              break
            }
          }
          
          const quantity = Number(ethers.formatUnits(balance, 0))
          const total = quantity * basePrice
          
          // Create a transaction for each token
          const transaction: Transaction = {
            id: `${address}-${Date.now()}`,
            productName: name,
            quantity,
            price: basePrice,
            total,
            customer: "Inventory Item",
            date: new Date().toISOString(),
            paymentMethod: "Blockchain Wallet",
            qrScanned: true,
            status: "completed"
          }
          
          processedSales.push(transaction)
        }
        
        // Sort by date, most recent first
        processedSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        setRecentSales(processedSales)
        setPendingSales([]) // No pending sales with this approach
      } catch (error) {
        console.error("Error fetching tokens:", error)
        toast({
          title: "Error",
          description: "Failed to fetch token data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [contract, signer, toast])

  // Filter products based on search query
  const filteredProducts = recentSales.filter(sale => 
    sale.productName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate total for purchase
  const calculateTotal = () => {
    if (!selectedProduct) return 0
    return selectedProduct.price * purchaseQuantity
  }

  // Handle product selection
  const handleProductSelect = (product: Transaction) => {
    setSelectedProduct({
      address: product.id.split('-')[0], // Extract token address from ID
      name: product.productName,
      price: product.price,
      quantity: product.quantity
    })
    setPurchaseQuantity(1)
  }

  // Handle purchase completion
  const handleProcessSale = async () => {
    if (!selectedProduct || !contract || !signer) {
      toast({
        title: "Error",
        description: "Please select a product and ensure wallet is connected",
        variant: "destructive"
      })
      return
    }

    if (purchaseQuantity > selectedProduct.quantity) {
      toast({
        title: "Error",
        description: "Purchase quantity exceeds available stock",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      // Get token contract
      const tokenContract = new ethers.Contract(
        selectedProduct.address,
        StockR00tToken.output.abi,
        signer
      )

      // Burn the tokens using the burn function with 18 decimals
      const burnAmount = ethers.parseUnits(purchaseQuantity.toString(), 18)
      const burnTx = await tokenContract.burn(burnAmount)
      
      // Wait for transaction to be mined
      await burnTx.wait()

      // Create a new sale record
      const newSale: Transaction = {
        id: `${selectedProduct.address}-${Date.now()}`,
        productName: selectedProduct.name,
        quantity: purchaseQuantity,
        price: selectedProduct.price,
        total: selectedProduct.price * purchaseQuantity,
        customer: customerName || "Walk-in Customer",
        date: new Date().toISOString(),
        paymentMethod: "Blockchain Wallet",
        qrScanned: true,
        status: "completed"
      }

      // Update sales list
      setRecentSales(prev => [newSale, ...prev])
      
      // Reset form
      setSelectedProduct(null)
      setPurchaseQuantity(1)
      setCustomerName("")

      toast({
        title: "Sale completed",
        description: "The product has been purchased and tokens burned.",
      })
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Error",
        description: "Failed to process sale. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
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
                  <label className="text-sm font-medium">Search Products</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {searchQuery && (
                    <div className="mt-2 max-h-60 overflow-y-auto rounded-md border">
                      {filteredProducts.length > 0 ? (
                        <div className="divide-y">
                          {filteredProducts.map((product) => (
                            <div 
                              key={product.id}
                              className={`p-2 cursor-pointer hover:bg-muted ${selectedProduct?.address === product.id.split('-')[0] ? 'bg-muted' : ''}`}
                              onClick={() => handleProductSelect(product)}
                            >
                              <div className="font-medium">{product.productName}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">No products found</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input 
                    type="number" 
                    value={purchaseQuantity} 
                    onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                    min="1" 
                    max={selectedProduct?.quantity || 1}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer</label>
                  <Input 
                    placeholder="Walk-in Customer" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full gap-2" 
              onClick={handleProcessSale} 
              disabled={isProcessing || !selectedProduct}
            >
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
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : recentSales.length > 0 ? (
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
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Check className="mb-4 h-12 w-12 text-green-500" />
                    <h3 className="text-lg font-medium">No recent sales</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Start processing sales to see them here</p>
                  </div>
                )}

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
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : pendingSales.length > 0 ? (
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
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
                    </div>
                  ) : recentSales.length > 0 ? (
                    // Group sales by product and calculate totals
                    Object.entries(
                      recentSales.reduce((acc, sale) => {
                        if (!acc[sale.productName]) {
                          acc[sale.productName] = { sales: 0, total: 0 };
                        }
                        acc[sale.productName].sales += sale.quantity;
                        acc[sale.productName].total += sale.total;
                        return acc;
                      }, {} as Record<string, { sales: number; total: number }>)
                    )
                      .sort((a, b) => b[1].sales - a[1].sales)
                      .slice(0, 4)
                      .map(([name, data], i, arr) => {
                        const totalSales = arr.reduce((sum, item) => sum + item[1].sales, 0);
                        const percentage = Math.round((data.sales / totalSales) * 100);
                        
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{name}</span>
                              <span>{data.sales} sales</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">No sales data available</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

