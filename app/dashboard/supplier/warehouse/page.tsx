"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { useToast } from "../../../../hooks/use-toast"
import { Wallet, Send } from "lucide-react"
import TokenFactoryABI from "../../../../contracts/TokenFactory.json"
import SupplyTokenABI from "../../../../contracts/SupplyToken.json"
import React from "react"

const TOKEN_FACTORY_ADDRESS = "0xf88C501cBA1DB713c080F886c74DB87ffd616FB2"

// Add Ethereum window type
declare global {
  interface Window {
    ethereum?: any
  }
}

interface Token {
  address: string
  name: string
  symbol: string
  balance: string
}

export default function BuyPage() {
  const { toast } = useToast()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  useEffect(() => {
    const loadTokens = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          await provider.send("eth_requestAccounts", [])
          const signer = await provider.getSigner()
          const address = await signer.getAddress()

          // Initialize token factory contract
          const tokenFactory = new ethers.Contract(
            TOKEN_FACTORY_ADDRESS,
            TokenFactoryABI.output.abi,
            signer
          )

          // Get all tokens
          const allTokens = await tokenFactory.getAllTokens()
          const userTokens: Token[] = []

          // Get details for each token
          for (const tokenAddress of allTokens) {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              SupplyTokenABI.output.abi,
              signer
            )

            const name = await tokenContract.name()
            const symbol = await tokenContract.symbol()
            const balance = await tokenContract.balanceOf(address)
            
            userTokens.push({
              address: tokenAddress,
              name,
              symbol,
              balance: ethers.formatUnits(balance, 18)
            })
          }

          setTokens(userTokens)
          if (userTokens.length > 0) {
            setSelectedToken(userTokens[0].address)
          }
        } catch (error) {
          console.error("Error loading tokens:", error)
          toast({
            title: "Error",
            description: "Failed to load tokens",
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
    }

    loadTokens()
  }, [toast])


  return (
    <DashboardLayout userRole="supplier">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Token Management</h1>
          <p className="text-muted-foreground">View your tokens and transfer them to other addresses</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : tokens.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tokens.map((token) => (
              <Card key={token.address}>
                <CardHeader>
                  <CardTitle>{token.name}</CardTitle>
                  <CardDescription>{token.symbol}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">{token.balance}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No tokens found</p>
              <p className="text-sm text-muted-foreground">You don't have any tokens in your account</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}