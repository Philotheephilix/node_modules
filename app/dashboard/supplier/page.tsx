"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"
import {
  BarChart,
  ChevronRight,
  Eye,
  Leaf,
  Package,
  TrendingUp,
  Target,
  Shield,
  Activity
} from "lucide-react"
import TokenFactoryABI from "../../../contracts/TokenFactory.json"
import SupplyTokenABI from "../../../contracts/SupplyToken.json"
import React from "react"
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const TOKEN_FACTORY_ADDRESS = "0xf88C501cBA1DB713c080F886c74DB87ffd616FB2"

interface TokenTransaction {
  title: string
  transactionId: string
  amount: string
  timestamp: number
}

interface TokenData {
  name: string
  address: string
  totalSupply: string
  currentSupply: string
  transfers: {
    timestamp: number
    amount: string
    from: string
    to: string
  }[]
  authenticityScore: number
  salesTarget: number
  salesProgress: number
}

interface DashboardData {
  totalTokens: number
  totalSupply: string
  activeTransactions: number
  recentTransactions: TokenTransaction[]
  tokens: TokenData[]
  dailyVolume: { date: string; volume: number }[]
  authenticityDistribution: { score: number; count: number }[]
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTokens: 0,
    totalSupply: "0",
    activeTransactions: 0,
    recentTransactions: [],
    tokens: [],
    dailyVolume: [],
    authenticityDistribution: []
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
          const tokenDetails: TokenData[] = []
          const dailyVolumeMap = new Map<string, number>()
          const authenticityScores = new Map<number, number>()

          // Process each token
          for (const tokenAddress of allTokens) {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              SupplyTokenABI.output.abi,
              signer
            )

            const name = await tokenContract.name()
            const totalSupply = await tokenContract.totalSupply()
            const currentSupply = await tokenContract.balanceOf(tokenAddress)
            totalSupplyValue = totalSupplyValue + totalSupply

            // Get transfer history with limited block range
            const transferFilter = tokenContract.filters.Transfer()
            let transfers: Array<{
              timestamp: number
              amount: string
              from: string
              to: string
              transactionHash?: string
            }> = []
            try {
              // Get the Transfer event signature hash
              const transferEvent = tokenContract.interface.getEvent("Transfer")
              if (!transferEvent) {
                throw new Error("Transfer event not found in contract interface")
              }
              const transferTopic = transferEvent.topicHash
              
              // Try to get logs using "latest" block tag first
              let logs = await provider.send("eth_getLogs", [{
                address: tokenAddress,
                fromBlock: "latest",
                toBlock: "latest",
                topics: [transferTopic]
              }])

              // If no logs found with "latest", try a small range
              if (!logs || logs.length === 0) {
                const currentBlock = await provider.getBlockNumber()
                const fromBlock = Math.max(0, currentBlock - 100) // Try a smaller range
                const fromBlockHex = `0x${fromBlock.toString(16)}`
                const toBlockHex = "latest"
                
                const rangeLogs = await provider.send("eth_getLogs", [{
                  address: tokenAddress,
                  fromBlock: fromBlockHex,
                  toBlock: toBlockHex,
                  topics: [transferTopic]
                }])
                
                if (rangeLogs && rangeLogs.length > 0) {
                  logs = rangeLogs
                }
              }

              // Process logs if we have any
              if (logs && logs.length > 0) {
                transfers = await Promise.all(logs.map(async (log: { blockNumber: number; data: ethers.BytesLike; topics: readonly string[] | undefined; transactionHash: any }) => {
                  const block = await provider.getBlock(log.blockNumber)
                  // Decode the log data
                  const decodedLog = tokenContract.interface.decodeEventLog(
                    "Transfer",
                    log.data,
                    log.topics
                  )
                  return {
                    timestamp: block?.timestamp || 0,
                    amount: ethers.formatUnits(decodedLog.value, 18),
                    from: decodedLog.from,
                    to: decodedLog.to,
                    transactionHash: log.transactionHash
                  }
                }))
              }
            } catch (error) {
              console.error(`Error fetching transfers for token ${name}:`, error)
              // Continue with empty transfers array
            }

            // Calculate daily volume
            transfers.forEach(transfer => {
              const date = new Date(transfer.timestamp * 1000).toISOString().split('T')[0]
              const currentVolume = dailyVolumeMap.get(date) || 0
              dailyVolumeMap.set(date, currentVolume + Number(transfer.amount))
            })

            // Calculate authenticity score (example: based on number of transfers)
            const authenticityScore = Math.min(100, Math.floor(transfers.length * 10))
            const scoreCount = authenticityScores.get(authenticityScore) || 0
            authenticityScores.set(authenticityScore, scoreCount + 1)

            // Calculate sales target and progress
            const salesTarget = Number(ethers.formatUnits(totalSupply, 18)) * 0.8 // 80% of total supply
            const salesProgress = (Number(ethers.formatUnits(totalSupply - currentSupply, 18)) / salesTarget) * 100

            tokenDetails.push({
              name,
              address: tokenAddress,
              totalSupply: ethers.formatUnits(totalSupply, 18),
              currentSupply: ethers.formatUnits(currentSupply, 18),
              transfers,
              authenticityScore,
              salesTarget,
              salesProgress: Math.min(100, salesProgress)
            })

            // Add recent transactions (only if we have transfers)
            if (transfers.length > 0) {
              transfers.slice(-5).forEach(transfer => {
                transactions.push({
                  title: `Transfer of ${name}`,
                  transactionId: transfer.transactionHash || '',
                  amount: transfer.amount,
                  timestamp: transfer.timestamp
                })
              })
            }
          }

          // Convert daily volume map to array
          const dailyVolume = Array.from(dailyVolumeMap.entries())
            .map(([date, volume]) => ({ date, volume }))
            .sort((a, b) => a.date.localeCompare(b.date))

          // Convert authenticity scores to distribution
          const authenticityDistribution = Array.from(authenticityScores.entries())
            .map(([score, count]) => ({ score, count }))
            .sort((a, b) => a.score - b.score)

          setDashboardData({
            totalTokens: allTokens.length,
            totalSupply: ethers.formatUnits(totalSupplyValue, 18),
            activeTransactions: transactions.length,
            recentTransactions: transactions.slice(0, 5),
            tokens: tokenDetails,
            dailyVolume,
            authenticityDistribution
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
        title: "Sales Target Progress",
        icon: Target,
        value: `${Math.round(dashboardData.tokens.reduce((acc, token) => acc + token.salesProgress, 0) / dashboardData.tokens.length)}%`,
        subtitle: "Average across all tokens"
      },
      {
        title: "Average Authenticity",
        icon: Shield,
        value: `${Math.round(dashboardData.tokens.reduce((acc, token) => acc + token.authenticityScore, 0) / dashboardData.tokens.length)}%`,
        subtitle: "Based on transfer history"
      }
    ]
  }

  return (
    <DashboardLayout userRole="supplier">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your StockR00t dashboard</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Daily Volume Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Trading Volume</CardTitle>
                  <CardDescription>Token transfer volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.dailyVolume}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="volume" stroke="#8884d8" name="Volume" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Authenticity Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Authenticity Score Distribution</CardTitle>
                  <CardDescription>Distribution of token authenticity scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={dashboardData.authenticityDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="score" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" name="Token Count" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Token List with Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Token Performance</CardTitle>
                <CardDescription>Sales progress and authenticity scores for each token</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.tokens.map((token, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{token.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{token.currentSupply} / {token.totalSupply}</p>
                          <p className="text-sm text-muted-foreground">Current Supply</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Sales Progress</span>
                          <span>{Math.round(token.salesProgress)}%</span>
                        </div>
                        <Progress value={token.salesProgress} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Authenticity Score</span>
                          <span>{token.authenticityScore}%</span>
                        </div>
                        <Progress value={token.authenticityScore} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

