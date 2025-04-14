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

export default function ProductsPage() {
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

          const tokenAddresses = await factory.getAllTokens()
          const tokens: CropToken[] = []

          for (const tokenAddress of tokenAddresses) {
            // Create token contract instance
            const tokenContract = new ethers.Contract(
              tokenAddress,
              SupplyTokenABI.output.abi,
              signer
            )

            // Get token details
            const [name, symbol, totalSupply, owner] = await Promise.all([
              tokenContract.name(),
              tokenContract.symbol(),
              tokenContract.totalSupply(),
              tokenContract.owner()
            ])

            // Get token balance for current user
            const balance = await tokenContract.balanceOf(address)

            // Fetch transfer events using Alchemy
            const url = "https://rootstock-testnet.g.alchemy.com/v2/oJTjnNCsJEOqYv3MMtrtT6LUFhwcW9pR"
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
            
            const response = await fetch(url, {
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
            const transactions: TokenTransaction[] = transferEvents.map((event: any) => {
              const [from, to] = event.topics.slice(1).map((topic: string) => 
                ethers.getAddress("0x" + topic.slice(26))
              )
              const amount = ethers.formatUnits(event.data, 0)
              
              return {
                from,
                to, 
                amount,
                timestamp: 0, // We'll fetch timestamps separately if needed
                transactionHash: event.transactionHash
              }
            })

            tokens.push({
              id: tokenAddress,
              name,
              symbol,
              tokenAddress,
              supply: totalSupply.toString(),
              owner,
              transactions,
              balance: balance.toString()
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
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">View your registered Products and their transaction history</p>
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
                               className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  From
                                </Badge>
                                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {tx.from.substring(0, 6)}...{tx.from.substring(tx.from.length - 4)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  To
                                </Badge>
                                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {tx.to.substring(0, 6)}...{tx.to.substring(tx.to.length - 4)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge variant="outline" className="text-lg">
                                {tx.amount} {crop.symbol}
                              </Badge>
                              <a 
                                href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                              >
                                <span>View on Etherscan</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <div className="flex flex-col items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history"><path d="M12 8v4l3 3"></path><path d="M3.05 11a9 9 0 1 1 .5 4"></path><path d="M2 2v5h5"></path></svg>
                            <p>No transactions found for this token</p>
                          </div>
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