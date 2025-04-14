"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Progress } from "../../../../components/ui/progress"
import {
  Calendar,
  Filter,
  Package,
  Search,
  Tag,
  Truck,
  TrendingUp,
  Bell,
  Package2,
  DollarSign,
  Cpu,
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Monitor,
  Printer,
} from "lucide-react"
import { useToast } from "../../../../hooks/use-toast"
import TokenFactory from "../../../../contracts/TokenFactory.json"
import SupplyChainToken from "../../../../contracts/SupplyToken.json"
import React from "react"
import { ethers } from "ethers"

interface TokenData {
  address: string;
  name: string;
  symbol: string;
  productName: string;
  category: string;
  brand: string;
  model: string;
  manufacturer: string;
  releaseDate: number;
  warrantyPeriod: number;
  isRefurbished: boolean;
  conditionScore: number;
  quantity: number;
  qualityChecks: {
    inspector: string;
    timestamp: number;
    report: string;
    score: number;
    passed: boolean;
  }[];
}

export default function InventoryPage() {
  const { toast } = useToast()
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: "all", name: "All Products", icon: Package },
    { id: "smartphones", name: "Smartphones", icon: Smartphone },
    { id: "laptops", name: "Laptops", icon: Laptop },
    { id: "tablets", name: "Tablets", icon: Tablet },
    { id: "accessories", name: "Accessories", icon: Headphones },
    { id: "monitors", name: "Monitors", icon: Monitor },
    { id: "printers", name: "Printers", icon: Printer },
  ]

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
    const fetchTokens = async () => {
      if (!contract || !signer) return

      try {
        setLoading(true)
        const tokenFactory = contract
        
        // Get all token addresses
        const tokenAddresses = await tokenFactory.getAllTokens()
        
        // Fetch details for each token
        const tokenPromises = tokenAddresses.map(async (address: string) => {
          const tokenContract = new ethers.Contract(
            address,
            SupplyChainToken.output.abi,
            signer
          )
          
          // Get basic token details
          const [
            name,
            symbol,
            balance
          ] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.balanceOf(await signer.getAddress())
          ])

          // Parse token name to extract product information
          // Example format: "TechCorp Laptop Pro" or "SmartPhone Elite"
          const nameParts = name.split(' ')
          const brand = nameParts[0]
          const model = nameParts.slice(1).join(' ')
          
          // Determine category based on token name
          const categoryMap: Record<string, string> = {
            'phone': 'smartphones',
            'laptop': 'laptops',
            'tablet': 'tablets',
            'monitor': 'monitors',
            'printer': 'printers',
            'accessory': 'accessories'
          }
          
          let category = 'accessories' // default category
          for (const [key, value] of Object.entries(categoryMap)) {
            if (name.toLowerCase().includes(key)) {
              category = value
              break
            }
          }

          return {
            address,
            name,
            symbol,
            productName: name,
            category,
            brand,
            model,
            manufacturer: brand,
            releaseDate: Math.floor(Date.now() / 1000), // Current timestamp
            warrantyPeriod: 12,
            isRefurbished: symbol.toLowerCase().includes('ref'),
            conditionScore: 100, // Default score
            quantity: Number(ethers.formatUnits(balance, 0)),
            qualityChecks: [{
              inspector: "Quality Control",
              timestamp: Math.floor(Date.now() / 1000),
              report: "Passed quality inspection",
              score: 100,
              passed: true
            }]
          }
        })

        const tokenData = await Promise.all(tokenPromises)
        setTokens(tokenData)
      } catch (error) {
        console.error("Error fetching tokens:", error)
        toast({
          title: "Error",
          description: "Failed to fetch inventory data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [contract, signer, toast])

  // Helper function to map produce types to electronics categories
  const mapProduceTypeToCategory = (produceType: string): string => {
    const categoryMap: Record<string, string> = {
      'rice': 'laptops',
      'wheat': 'tablets',
      'vegetables': 'smartphones',
      'fruits': 'accessories',
      'default': 'monitors'
    }
    return categoryMap[produceType.toLowerCase()] || categoryMap.default
  }

  const handleOrder = () => {
    setIsOrdering(true)
    setTimeout(() => {
      setIsOrdering(false)
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and will be delivered soon.",
      })
    }, 2000)
  }

  const filteredTokens = selectedCategory === "all" 
    ? tokens 
    : tokens.filter(token => token.category.toLowerCase() === selectedCategory)

  const totalRevenue = tokens.reduce((total, token) => {
    // Base price varies by category
    const basePrices: Record<string, number> = {
      smartphones: 500,
      laptops: 1000,
      tablets: 400,
      accessories: 100,
      monitors: 300,
      printers: 200
    }
    const basePrice = basePrices[token.category.toLowerCase()] || 200
    const priceMultiplier = token.conditionScore / 100
    return total + (token.quantity * basePrice * priceMultiplier)
  }, 0)

  const totalSales = tokens.reduce((total, token) => {
    // Assuming initial stock was 100 and current quantity shows remaining
    return total + (100 - token.quantity)
  }, 0)

  // Helper function to format large numbers
  const formatLargeNumber = (num: number): string => {
    const isNegative = num < 0
    const absNum = Math.abs(num)
    
    // Handle very large numbers (trillions and above)
    if (absNum >= 1e12) {
      return `${isNegative ? '-' : ''}${(absNum / 1e12).toFixed(1)}T`
    }
    // Handle billions
    if (absNum >= 1e9) {
      return `${isNegative ? '-' : ''}${(absNum / 1e9).toFixed(1)}B`
    }
    // Handle millions
    if (absNum >= 1e6) {
      return `${isNegative ? '-' : ''}${(absNum / 1e6).toFixed(1)}M`
    }
    // Handle thousands
    if (absNum >= 1e3) {
      return `${isNegative ? '-' : ''}${(absNum / 1e3).toFixed(1)}K`
    }
    // For small numbers, limit decimal places to 2
    return `${isNegative ? '-' : ''}${absNum.toFixed(2)}`
  }

  const lowStock = tokens.filter(token => token.quantity < 10)

  return (
    <DashboardLayout userRole="retailer">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Electronics Inventory</h1>
            <p className="text-muted-foreground">Manage your electronics store inventory and track sales</p>
        </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary">
                <DollarSign className="h-5 w-5" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{formatLargeNumber(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-500">
                <Package2 className="h-5 w-5" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatLargeNumber(totalSales)}</div>
              <p className="text-xs text-muted-foreground">Units sold</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <Bell className="h-5 w-5" />
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lowStock.length}</div>
              <p className="text-xs text-muted-foreground">Items need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-500">
                <Cpu className="h-5 w-5" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tokens.length}</div>
              <p className="text-xs text-muted-foreground">Unique products</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="flex-1" />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTokens.map((token) => {
              const stockLevel = (token.quantity / 100) * 100 // Assuming initial stock was 100
              const basePrices: Record<string, number> = {
                smartphones: 500,
                laptops: 1000,
                tablets: 400,
                accessories: 100,
                monitors: 300,
                printers: 200
              }
              const basePrice = basePrices[token.category.toLowerCase()] || 200
              const priceMultiplier = token.conditionScore / 100
              const price = basePrice * priceMultiplier
              const revenue = (100 - token.quantity) * price

              return (
                <Card key={token.address} className="relative overflow-hidden">
                  {stockLevel < 40 && (
                    <div className="absolute right-0 top-0 bg-destructive px-2 py-1 text-xs font-medium text-white">
                      Low Stock
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{token.productName}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {token.category}
                      </Badge>
                    </div>
                    <CardDescription>
                      {token.brand} {token.model} - {token.quantity} units
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{token.manufacturer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Released: {new Date(token.releaseDate * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Stock Level</span>
                          <span>{stockLevel.toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={stockLevel}
                          className={`h-2 ${stockLevel < 40 ? "bg-destructive/20" : ""}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-muted p-3">
                          <div className="text-sm font-medium">Sales</div>
                          <div className="text-2xl font-bold">{formatLargeNumber(100 - token.quantity)}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            <span>Last 30 days</span>
                          </div>
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                          <div className="text-sm font-medium">Revenue</div>
                          <div className="text-2xl font-bold">₹{formatLargeNumber(revenue)}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            <span>Per unit: ₹{price.toFixed(2)}</span>
                          </div>
                        </div>
                        </div>

                      {token.qualityChecks.length > 0 && (
                        <div className="rounded-lg border p-3">
                          <div className="text-sm font-medium mb-2">Quality Check</div>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${token.qualityChecks[token.qualityChecks.length - 1].passed ? "bg-green-500" : "bg-red-500"}`} />
                            <span className="text-sm">
                              Score: {token.qualityChecks[token.qualityChecks.length - 1].score}/100
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
              </CardContent>
            </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

