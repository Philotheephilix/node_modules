"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: any
  }
}
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { QrCode } from "lucide-react"
import React from "react"
import TokenFactoryABI from "../../../../contracts/TokenFactory.json"
import SupplyTokenABI from "../../../../contracts/SupplyToken.json"

const TOKEN_FACTORY_ADDRESS = "0xf88C501cBA1DB713c080F886c74DB87ffd616FB2"

interface TokenTransaction {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
}

interface CropToken {
  id: string;
  name: string;
  symbol: string;
  tokenAddress: string;
  supply: string;
  owner: string;
  transactions: TokenTransaction[];
  balance: string;
}

export default function CropsPage() {
  const [cropTokens, setCropTokens] = useState<CropToken[]>([])
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState("")
  
  // Connect to blockchain and load tokens
  useEffect(() => {
    const connectBlockchain = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          const provider = new ethers.BrowserProvider(window.ethereum)
          await provider.send("eth_requestAccounts", [])
          
          // Get signer
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setAccount(address)

          // Create contract instance
          const factory = new ethers.Contract(
            TOKEN_FACTORY_ADDRESS,
            TokenFactoryABI.output.abi,
            signer
          )

          // Load tokens
          const allTokens = await factory.getAllTokens()
          const tokens: CropToken[] = []

          for (const tokenAddress of allTokens) {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              SupplyTokenABI.output.abi,
              signer
            )

            // Get token details
            const name = await tokenContract.name()
            const symbol = await tokenContract.symbol()
            const supply = ethers.formatUnits(await tokenContract.totalSupply(), 18)
            const owner = await tokenContract.owner()
            const balance = ethers.formatUnits(await tokenContract.balanceOf(address), 18)

            // Get transfer events for transaction history
            const transferFilter = tokenContract.filters.Transfer()
            const events = await tokenContract.queryFilter(transferFilter)
            
            const transactions: TokenTransaction[] = events.map(event => ({
              from: (event as ethers.EventLog).args?.[0],
              to: (event as ethers.EventLog).args?.[1],
              amount: ethers.formatUnits((event as ethers.EventLog).args?.[2], 18),
              timestamp: event.blockNumber,
              transactionHash: event.transactionHash
            }))

            tokens.push({
              id: tokenAddress,
              name,
              symbol,
              tokenAddress,
              supply,
              owner,
              transactions,
              balance
            })
          }
          
          setCropTokens(tokens)
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
  
  return (
    <DashboardLayout userRole="producer">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Crops</h1>
          <p className="text-muted-foreground">View your registered crops and their transaction history</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : cropTokens.length > 0 ? (
          <div className="space-y-6">
            {cropTokens.map((crop) => (
              <Card key={crop.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{crop.name}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{crop.symbol}</Badge>
                          <span>Supply: {crop.supply} tokens</span>
                          <span>Balance: {crop.balance} tokens</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">Token Address:</span>
                          <span className="text-sm font-mono">
                            {crop.tokenAddress.substring(0, 6)}...{crop.tokenAddress.substring(crop.tokenAddress.length - 4)}
                          </span>
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <div className="space-y-3">
                      {crop.transactions.length > 0 ? (
                        crop.transactions.map((tx, index) => (
                          <div key={`${crop.id}-${index}`} 
                               className="flex items-center justify-between p-3 rounded-lg border bg-card">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">From:</span>
                                <span className="text-sm font-mono">
                                  {tx.from.substring(0, 6)}...{tx.from.substring(tx.from.length - 4)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">To:</span>
                                <span className="text-sm font-mono">
                                  {tx.to.substring(0, 6)}...{tx.to.substring(tx.to.length - 4)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{tx.amount} tokens</span>
                              <a 
                                href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:text-blue-600"
                              >
                                View on Etherscan
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          No transactions found for this token
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium">No crop tokens found</h3>
              <p className="text-sm text-muted-foreground mt-2">No tokens have been registered yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}