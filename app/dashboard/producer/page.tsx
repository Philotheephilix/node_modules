"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: any;
  }
}
import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import {
  BarChart,
  ChevronRight,
  Eye,
  Leaf,
  Package,
} from "lucide-react"
import TokenFactoryABI from "../../../contracts/TokenFactory.json"
import SupplyTokenABI from "../../../contracts/SupplyToken.json"
import React from "react"

const TOKEN_FACTORY_ADDRESS = "0x8B27D610897208ad9A7b5A531bb90b5726ab8337"

interface TokenTransaction {
  title: string;
  transactionId: string;
  amount: string;
  timestamp: number;
}

interface DashboardData {
  totalTokens: number;
  totalSupply: string;
  activeTransactions: number;
  recentTransactions: TokenTransaction[];
  tokens: {
    name: string;
    address: string;
    created: Date;
  }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTokens: 0,
    totalSupply: "0",
    activeTransactions: 0,
    recentTransactions: [],
    tokens: []
  })

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          await provider.send("eth_requestAccounts", [])
          const signer = await provider.getSigner()
          
          const factory = new ethers.Contract(
            TOKEN_FACTORY_ADDRESS,
            TokenFactoryABI.output.abi,
            signer
          )

          // Get all tokens
          const allTokens = await factory.getAllTokens()
          let totalSupplyValue = ethers.parseUnits("0", 18)
          const transactions: TokenTransaction[] = []
          const tokenDetails: Array<{ name: string; address: string; created: Date }> = []

          // Process each token
          for (const tokenAddress of allTokens) {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              SupplyTokenABI.output.abi,
              signer
            )

            const name = await tokenContract.name()
            const supply = await tokenContract.totalSupply()
            totalSupplyValue = totalSupplyValue + supply

            // Get recent transfers
            const transferFilter = tokenContract.filters.Transfer()
            const events = await tokenContract.queryFilter(transferFilter)
            
            // Add token details
            tokenDetails.push({
              name: name,
              address: tokenAddress,
              created: new Date() // You might want to get this from the contract creation event
            } as const)

            // Process transfer events
            for (const event of events.slice(-5)) {
              const args = (event as ethers.EventLog).args
              transactions.push({
                title: `Transfer of ${name}`,
                transactionId: event.transactionHash,
                amount: ethers.formatUnits(args?.[2], 18),
                timestamp: event.blockNumber
              })
            }
          }

          // Sort transactions by timestamp (most recent first)
          transactions.sort((a, b) => b.timestamp - a.timestamp)

          setDashboardData({
            totalTokens: allTokens.length,
            totalSupply: ethers.formatUnits(totalSupplyValue, 18),
            activeTransactions: transactions.length,
            recentTransactions: transactions.slice(0, 5),
            tokens: tokenDetails
          })

        } catch (error) {
          console.error("Error loading blockchain data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadBlockchainData()
  }, [])

  const roleCards = {
    producer: [
      {
        title: "Registered Products",
        icon: Leaf,
        value: dashboardData.totalTokens.toString(),
        subtitle: `Total supply: ${dashboardData.totalSupply} tokens`,
        progress: 75
      },
      {
        title: "Active Transactions",
        icon: BarChart,
        value: dashboardData.activeTransactions.toString(),
        subtitle: "Recent transfers"
      },
      {
        title: "Active Tokens",
        icon: Package,
        value: dashboardData.tokens.length.toString(),
        subtitle: "Tracked on blockchain"
      }
    ]
  }

  return (
    <DashboardLayout userRole="producer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your SupplyChain dashboard</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Content */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {roleCards.producer.map((card) => (
                <Card key={card.title} className="bg-card/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                    {card.progress !== undefined && (
                      <div className="mt-4">
                        <Progress value={card.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Transactions Card */}
              <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent blockchain transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{transaction.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Transaction ID: {transaction.transactionId.substring(0, 6)}...
                            {transaction.transactionId.substring(transaction.transactionId.length - 4)}
                          </p>
                        </div>
                        <div className="text-sm font-medium">{transaction.amount} tokens</div>
                      </div>
                    ))}
                  </div>
                  <a 
                    href={`https://sepolia.etherscan.io/address/${TOKEN_FACTORY_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" className="mt-4 w-full" size="sm">
                      View all transactions
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Tokens Card */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Registered Tokens</CardTitle>
                  <CardDescription>Your active tokens on the blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.tokens.map((token, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Eye className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{token.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                          </p>
                        </div>
                        <a 
                          href={`https://sepolia.etherscan.io/address/${token.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

