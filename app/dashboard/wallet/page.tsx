"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Copy, Download, ExternalLink, Eye, EyeOff, Lock, RefreshCw, Shield } from "lucide-react"

export default function WalletPage() {
  const [hideBalance, setHideBalance] = useState(false)
  const [walletAddress, setWalletAddress] = useState("0x7F5EB5bB5cF88cfcEe9613368636f458800e62CB")
  
  const transactions = [
    {
      id: "tx-1",
      type: "received",
      amount: 500,
      from: "0x3a8d...1f9c",
      to: "You",
      date: "2025-04-01T10:30:00",
      status: "completed",
      description: "Airdrop from Government"
    },
    {
      id: "tx-2",
      type: "sent",
      amount: 120,
      from: "You",
      to: "0x7b2c...9e4d",
      date: "2025-03-28T14:15:00",
      status: "completed",
      description: "Purchase: Organic Rice"
    },
    {
      id: "tx-3",
      type: "received",
      amount: 1500,
      from: "0x5f1a...8c3b",
      to: "You",
      date: "2025-03-25T09:45:00",
      status: "completed",
      description: "Payment for Crop Sale"
    },
    {
      id: "tx-4",
      type: "sent",
      amount: 85,
      from: "You",
      to: "0x2d9e...6b7a",
      date: "2025-03-20T16:20:00",
      status: "completed",
      description: "Purchase: Vegetables"
    }
  ]
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  
  return (
    <DashboardLayout userRole="consumer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Wallet</h1>
          <p className="text-muted-foreground">
            Manage your blockchain wallet and transactions
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Wallet Balance</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setHideBalance(!hideBalance)}>
                  {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">
                    {hideBalance ? "••••••" : "₹2,450"}
                  </span>
                  <Badge variant="outline" className="mb-1">
                    +₹500 this month
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Wallet Address:</span>
                  <span className="font-mono text-xs">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(walletAddress)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="w-full gap-2">
                <ArrowDown className="h-4 w-4" /> Receive
              </Button>
              <Button className="w-full gap-2">
                <ArrowUp className="h-4 w-4" /> Send
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Airdrop Funds</CardTitle>
              <CardDescription>
                Government subsidies and bonuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Food Subsidy</p>
                      <p className="text-xs text-muted-foreground">Expires in 15 days</p>
                    </div>
                    <p className="text-lg font-bold">₹500</p>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <Lock className="mr-1 inline-block h-3 w-3" />
                    Can only be used for food purchases
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sustainability Bonus</p>
                      <p className="text-xs text-muted-foreground">No expiration</p>
                    </div>
                    <p className="text-lg font-bold">₹0</p>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <Shield className="mr-1 inline-block h-3 w-3" />
                    Earned by making sustainable food choices
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Your recent blockchain transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 rounded-lg border p-4">
                    <div className={`rounded-full p-2 ${tx.type === 'received' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'received' ? <ArrowDown className="h-5 w-5" /> : <ArrowUp className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{tx.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>From: {tx.from}</span>
                        <span>•</span>
                        <span>To: {tx.to}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${tx.type === 'received' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'received' ? '+' : '-'}₹{tx.amount}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 flex justify-center">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Load More
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your wallet security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="biometric">Biometric Authentication</Label>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Enable Biometric Login</p>
                      <p className="text-xs text-muted-foreground">Use fingerprint or face recognition</p>
                    </div>
                    <div className="ml-auto flex h-5 w-9 shrink-0 items-center rounded-full border bg-primary p-0.5">
                      <div className="h-4 w-4 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Enable 2FA</p>
                      <p className="text-xs text-muted-foreground">Additional security for transactions</p>
                    </div>
                    <div className="ml-auto flex h-5 w-9 shrink-0 items-center rounded-full border bg-muted p-0.5">
                      <div className="h-4 w-4 translate-x-0 rounded-full bg-muted-foreground"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recovery-phrase">Backup Recovery Phrase</Label>
                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-sm">Your recovery phrase is the only way to restore your wallet if you lose access.</p>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Download Backup
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction-limit">Transaction Limit</Label>
                <div className="flex items-center gap-4">
                  <Input id="transaction-limit" type="number" defaultValue="1000" />
                  <Button variant="outline">Save</Button>
                </div>
                <p className="text-xs text-muted-foreground">Maximum amount per transaction in ₹</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full gap-2">
              <ExternalLink className="h-4 w-4" /> View on Blockchain Explorer
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

