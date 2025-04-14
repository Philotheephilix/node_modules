"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
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
  TrendingUp,
  Users,
  Wallet
} from "lucide-react"
import TokenFactoryABI from "../../../contracts/TokenFactory.json"
import SupplyTokenABI from "../../../contracts/SupplyToken.json"
import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts'

const TOKEN_FACTORY_ADDRESS = "0xf88C501cBA1DB713c080F886c74DB87ffd616FB2"
const ALCHEMY_URL = "https://rootstock-testnet.g.alchemy.com/v2/oJTjnNCsJEOqYv3MMtrtT6LUFhwcW9pR"

interface TokenTransaction {
  title: string;
  transactionId: string;
  amount: string;
  timestamp: number;
  tokenName: string;
  tokenSymbol: string;
}

interface TokenData {
  name: string;
  symbol: string;
  address: string;
  totalSupply: string;
  owner: string;
  transferCount: number;
  recentTransfers: TokenTransaction[];
}

interface DashboardData {
  totalTokens: number;
  totalSupply: string;
  activeTransactions: number;
  recentTransactions: TokenTransaction[];
  tokens: TokenData[];
  transferHistory: {
    date: string;
    transfers: number;
    volume: number;
  }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTokens: 0,
    totalSupply: "0",
    activeTransactions: 0,
    recentTransactions: [],
    tokens: [],
    transferHistory: []
  })

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          await provider.send("eth_requestAccounts", [])
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          
          const factory = new ethers.Contract(
            TOKEN_FACTORY_ADDRESS,
            TokenFactoryABI.output.abi,
            signer
          )

          // Get all tokens
          const allTokens = await factory.getAllTokens()
          let totalSupplyValue = ethers.parseUnits("0", 18)
          const tokens: TokenData[] = []
          const allTransactions: TokenTransaction[] = []
          const transferHistory: { [key: string]: { transfers: number; volume: number } } = {}

          // Process each token
          for (const tokenAddress of allTokens) {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              SupplyTokenABI.output.abi,
              signer
            )

            const [name, symbol, totalSupply] = await Promise.all([
              tokenContract.name(),
              tokenContract.symbol(),
              tokenContract.totalSupply()
            ])

            totalSupplyValue = totalSupplyValue + totalSupply

            // Fetch transfer events using Alchemy
            const transferTopic = ethers.id("Transfer(address,address,uint256)")
            const body = JSON.stringify({
              id: 1,
              jsonrpc: "2.0",
              method: "eth_getLogs",
              params: [{
                address: tokenAddress,
                fromBlock: "0x0",
                toBlock: "latest",
                topics: [transferTopic]
              }]
            })

            const response = await fetch(ALCHEMY_URL, {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
              },
              body
            })

            const data = await response.json()
            const transferEvents = data.result || []

            // Process transfer events
            const tokenTransactions: TokenTransaction[] = transferEvents.map((event: any) => {
              const [from, to] = event.topics.slice(1).map((topic: string) => 
                ethers.getAddress("0x" + topic.slice(26))
              )
              const amount = ethers.formatUnits(event.data, 0)
              const timestamp = parseInt(event.timeStamp || "0") * 1000
              const date = new Date(timestamp).toISOString().split('T')[0]

              // Update transfer history
              if (!transferHistory[date]) {
                transferHistory[date] = { transfers: 0, volume: 0 }
              }
              transferHistory[date].transfers++
              transferHistory[date].volume += parseFloat(amount)

              return {
                title: `Transfer of ${name}`,
                transactionId: event.transactionHash,
                amount,
                timestamp,
                tokenName: name,
                tokenSymbol: symbol
              }
            })

            tokens.push({
              name,
              symbol,
              address: tokenAddress,
              totalSupply: totalSupply.toString(),
              owner: await tokenContract.owner(),
              transferCount: transferEvents.length,
              recentTransfers: tokenTransactions.slice(-5)
            })

            allTransactions.push(...tokenTransactions)
          }

          // Sort transactions by timestamp
          allTransactions.sort((a, b) => b.timestamp - a.timestamp)

          // Convert transfer history to array and sort by date
          const transferHistoryArray = Object.entries(transferHistory)
            .map(([date, data]) => ({
              date,
              ...data
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

          setDashboardData({
            totalTokens: allTokens.length,
            totalSupply: ethers.formatUnits(totalSupplyValue, 18),
            activeTransactions: allTransactions.length,
            recentTransactions: allTransactions.slice(0, 5),
            tokens,
            transferHistory: transferHistoryArray
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

              {/* Transfer Volume Chart */}
              <Card className="md:col-span-2 lg:col-span-2 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Transfer Volume</CardTitle>
                  <CardDescription>Daily token transfer volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.transferHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(2)} tokens`, 'Volume']}
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Transfer Count Chart */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Transfer Count</CardTitle>
                  <CardDescription>Daily number of transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={dashboardData.transferHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value} transfers`, 'Count']}
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Bar dataKey="transfers" fill="#2563eb" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="md:col-span-2 lg:col-span-2 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest token transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {transaction.tokenName} ({transaction.tokenSymbol})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm font-medium">{transaction.amount} tokens</div>
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${transaction.transactionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Token List */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Active Tokens</CardTitle>
                  <CardDescription>Your registered tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.tokens.map((token, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Wallet className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{token.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {token.symbol} • {token.transferCount} transfers
                          </p>
                        </div>
                        <div className="text-sm font-medium">{token.totalSupply}</div>
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

