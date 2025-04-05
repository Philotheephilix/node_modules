"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Leaf, Plus } from "lucide-react"
import React from "react"
import TokenFactoryABI from "../../../../contracts/TokenFactory.json"
import SupplyTokenABI from "../../../../contracts/SupplyToken.json"

const TOKEN_FACTORY_ADDRESS = "0x8B27D610897208ad9A7b5A531bb90b5726ab8337"
declare global {
  interface Window {
    ethereum?: any;
  }
}
interface ProductToken {
  quantity: number;
  id: string;
  name: string;
  symbol: string;
  expectedYield: number;
}

export default function ProductsPage() {
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [ProductTokens, setProductTokens] = useState<ProductToken[]>([])
  const [loading, setLoading] = useState(true)
  const [tokenFactory, setTokenFactory] = useState<ethers.Contract | null>(null)
  
  // Form state
  const [ProductName, setProductName] = useState("")
  const [Productsymbol, setProductsymbol] = useState("")
  const [ProductYield, setProductYield] = useState("")
  const [farmingPractice, setFarmingPractice] = useState("organic")
  
  // Connect to blockchain
  useEffect(() => {
    const connectBlockchain = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);          

          // Get signer
          const signer = await provider.getSigner();

          const address = await signer.getAddress();

          // Create contract instance
          const factory = new ethers.Contract(
            TOKEN_FACTORY_ADDRESS,
            TokenFactoryABI.output.abi, 
            signer
          )
          setTokenFactory(factory)
          if (!factory) {
            throw new Error("Token factory not initialized");
          }
          const allTokens = await factory.getAllTokens()
          const userTokens = allTokens // We'll filter by owner when getting token details
          console.log("All tokens:", userTokens)

          const userTokenAddresses = userTokens.map((token: string) => token.toLowerCase())
          const userTokenCount = userTokenAddresses.length
          console.log(userTokens)
          if (userTokenCount === 0) {
            setProductTokens([])
            return
          }      
          const tokens: ProductToken[] = []
          
          // Fetch details for each token
          for (let i = 0; i < userTokenAddresses.length; i++) {
            const tokenAddress = userTokenAddresses[i]
            const signer = provider ? await provider.getSigner() : null
            const tokenContract = new ethers.Contract(
              tokenAddress,
              SupplyTokenABI.output.abi,
              signer
            )
            
            // Get token details
            const name = await tokenContract.name()
            const symbol = await tokenContract.symbol()
            tokens.push({
              name,
              symbol,
              expectedYield: parseFloat(ProductYield) || 0,
              id: tokenAddress,
              quantity: Number(ethers.formatUnits(await tokenContract.balanceOf(address), 18)) // Convert from wei (18 decimals)
            })
          }
          
          setProductTokens(tokens)
        } catch (error) {
          console.error("Error loading tokens:", error)
        } finally {
          setLoading(false)
        }
      } else {
        console.log("Please install MetaMask")
        setLoading(false)
      }
    }
    
    connectBlockchain()
  }, [])
  
  // Register a new Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tokenFactory || !ProductName || !Productsymbol || !ProductYield) {
      alert("Please fill in all required fields")
      return
    }
    
    setLoading(true)
    try {
      // Register Product using the token factory
      const tx = await tokenFactory.registerProduct(
        ProductName,
        Productsymbol,
        ethers.parseUnits(ProductYield, 18) // Convert to wei
      )
      
      await tx.wait()
      setProductName("")
      setProductsymbol("")
      setProductYield("")
      // Close form
      setIsAddingProduct(false)
    } catch (error) {
      console.error("Error registering Product:", error)
      alert("Failed to register Product. See console for details.")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <DashboardLayout userRole="producer">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
            <p className="text-muted-foreground">Manage your registered Products as tokenized real-world assets</p>
          </div>
          <Button onClick={() => setIsAddingProduct(true)} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" /> Register New Product Token
          </Button>
        </div>

        {isAddingProduct ? (
          <Card>
            <CardHeader>
              <CardTitle>Register New Product Token</CardTitle>
              <CardDescription>Create a new ERC-20 token representing your Product as a real-world asset</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddProduct}>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="Product-name">Product Name</Label>
                    <Input 
                      id="Product-name" 
                      placeholder="e.g., North Field Rice" 
                      value={ProductName}
                      onChange={(e) => setProductName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Product-symbol">Token Symbol</Label>
                    <Input 
                      id="Product-symbol" 
                      placeholder="e.g., RICE" 
                      maxLength={8}
                      value={Productsymbol}
                      onChange={(e) => setProductsymbol(e.target.value.toUpperCase())}
                      required 
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expected-yield">Supply Quantity (Tokens)</Label>
                    <Input 
                      id="expected-yield" 
                      type="number" 
                      placeholder="e.g., 2500" 
                      value={ProductYield}
                      onChange={(e) => setProductYield(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farming-practices">Farming Practices</Label>
                  <Select 
                    value={farmingPractice}
                    onValueChange={setFarmingPractice}
                  >
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
                <Button variant="outline" type="button" onClick={() => setIsAddingProduct(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Product Token'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="harvested">Harvested</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : ProductTokens.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ProductTokens.map((Product) => (
                      <Card key={Product.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle>{Product.name}</CardTitle>
                          </div>
                          <CardDescription>
                            {Product.symbol}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">

                            <div className="flex items-center justify-between">
                                <span className="text-sm">Supply</span>
                                <div className="flex items-center gap-1">
                                <span className="font-medium">{Product.quantity}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Token Address</span>
                                  <div className="flex items-center gap-1">
                                  <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${Product.id}`}
                                    alt={`QR Code for ${Product.id}`}
                                    className="h-20 w-20"
                                  />
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-2 mt-4">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="text"
                                      placeholder="Supplier Address"
                                      className="flex-1"
                                      id={`supplier-${Product.id}`}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Amount"
                                      className="flex-1"
                                      id={`amount-${Product.id}`}
                                    />
                                    <Button
                                      onClick={async () => {
                                    try {
                                    const supplierAddress = (document.getElementById(`supplier-${Product.id}`) as HTMLInputElement).value;
                                    const amount = (document.getElementById(`amount-${Product.id}`) as HTMLInputElement).value;
                                    
                                    if (!supplierAddress || !amount) {
                                      alert('Please enter supplier address and amount');
                                      return;
                                    }

                                    const tokenContract = new ethers.Contract(
                                      Product.id,
                                      SupplyTokenABI.output.abi,
                                      await new ethers.BrowserProvider(window.ethereum).getSigner()
                                    );

                                    const tx = await tokenContract.transfer(
                                      supplierAddress,
                                      ethers.parseUnits(amount, 18)
                                    );
                                    await tx.wait();
                                    alert('Transfer successful!');
                                    } catch (error) {
                                    console.error('Transfer failed:', error);
                                    alert('Transfer failed. Check console for details.');
                                    }
                                  }}
                                  size="sm"
                                  >
                                  Sell
                                  </Button> 
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-6">
                      <Leaf className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No Product tokens found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Register your first Product token to get started</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="harvested" className="mt-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6">
                    <Leaf className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No harvested Products yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Your harvested Products will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

