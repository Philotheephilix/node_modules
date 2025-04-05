"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { DashboardLayout } from "../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
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

  const handleTransfer = async () => {
    if (!selectedToken || !recipientAddress || !transferAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    setIsTransferring(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const tokenContract = new ethers.Contract(
        selectedToken,
        SupplyTokenABI.output.abi,
        signer
      )

      const amount = ethers.parseUnits(transferAmount, 18)
      const tx = await tokenContract.transfer(recipientAddress, amount)
      await tx.wait()

      toast({
        title: "Success",
        description: "Tokens transferred successfully"
      })

      // Refresh balances
      const balance = await tokenContract.balanceOf(await signer.getAddress())
      setTokens(tokens.map(token => 
        token.address === selectedToken 
          ? { ...token, balance: ethers.formatUnits(balance, 18) }
          : token
      ))

      // Reset form
      setRecipientAddress("")
      setTransferAmount("")
    } catch (error) {
      console.error("Transfer failed:", error)
      toast({
        title: "Error",
        description: "Failed to transfer tokens",
        variant: "destructive"
      })
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <DashboardLayout userRole="supplier">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Token Management</h1>
          <p className="text-muted-foreground">View your tokens and transfer them to other addresses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transfer Tokens</CardTitle>
            <CardDescription>Send tokens to another address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Select Token</Label>
              <select
                id="token"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                <option value="">Select a token</option>
                {tokens.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full gap-2" 
              onClick={handleTransfer}
              disabled={isTransferring || !selectedToken || !recipientAddress || !transferAmount}
            >
              {isTransferring ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Transferring...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Transfer
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}