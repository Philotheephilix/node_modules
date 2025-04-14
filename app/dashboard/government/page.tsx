"use client"

import { useState, useEffect } from "react"
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
import React from "react"

// Alchemy API configuration
const ALCHEMY_API_KEY = "oJTjnNCsJEOqYv3MMtrtT6LUFhwcW9pR";
const ALCHEMY_URL = `https://rootstock-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const TOKEN_FACTORY_ADDRESS = "0xf88C501cBA1DB713c080F886c74DB87ffd616FB2";

// Declare global window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

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

interface TransferLog {
  blockNumber: string;
  transactionHash: string;
  topics: string[];
  data: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTokens: 0,
    totalSupply: "0",
    activeTransactions: 0,
    recentTransactions: [],
    tokens: []
  })

  // Get wallet address from Ethereum provider
  useEffect(() => {
    const getWalletAddress = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get the connected account
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error getting wallet address:", error);
        }
      }
    };

    getWalletAddress();
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!walletAddress) {
        console.log("No wallet address available");
        setLoading(false);
        return;
      }

      try {
        // Get all tokens from the factory contract
        const allTokens = await getAllTokens();
        
        let totalSupplyValue = 0;
        const transactions: TokenTransaction[] = [];
        const tokenDetails: Array<{ name: string; address: string; created: Date }> = [];

        // Process each token
        for (const tokenAddress of allTokens) {
          // Get token details
          const tokenData = await getTokenDetails(tokenAddress);
          const name = tokenData.name;
          const supply = tokenData.totalSupply;
          totalSupplyValue += parseFloat(supply);

          // Get recent transfers
          const transferEvents = await getTransferEvents(tokenAddress);
          
          // Add token details
          tokenDetails.push({
            name: name,
            address: tokenAddress,
            created: new Date() // You might want to get this from the contract creation event
          });

          // Process transfer events
          for (const event of transferEvents.slice(-5)) {
            transactions.push({
              title: `Transfer of ${name}`,
              transactionId: event.transactionHash,
              amount: formatTokenAmount(event.data, tokenData.decimals),
              timestamp: parseInt(event.blockNumber, 16)
            });
          }
        }

        // Sort transactions by timestamp (most recent first)
        transactions.sort((a, b) => b.timestamp - a.timestamp);

        setDashboardData({
          totalTokens: allTokens.length,
          totalSupply: totalSupplyValue.toLocaleString(),
          activeTransactions: transactions.length,
          recentTransactions: transactions.slice(0, 5),
          tokens: tokenDetails
        });

      } catch (error) {
        console.error("Error loading blockchain data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      loadBlockchainData();
    }
  }, [walletAddress]);

  // Helper function to get all tokens from the factory contract
  const getAllTokens = async (): Promise<string[]> => {
    try {
      // Get token creation events from the factory contract
      const tokenCreatedEventSignature = "0x0d0b9391970d9a25552f37d436d2a08ed5c814a430a4b1081d201eacf399688b";
      
      const requestBody = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getLogs",
        params: [{
          address: TOKEN_FACTORY_ADDRESS,
          fromBlock: "0x0", // Start from genesis
          toBlock: "latest",
          topics: [tokenCreatedEventSignature]
        }]
      };
      
      const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch token creation events");
      }

      // Extract token addresses from the event logs
      // The token address is typically in the second topic of the event
      const tokenAddresses = data.result.map((log: any) => {
        // The token address is in the second topic (index 1)
        // Remove the '0x' prefix and take the last 40 characters (20 bytes = 40 hex chars)
        const topic = log.topics[1];
        return "0x" + topic.slice(-40);
      });

      return tokenAddresses;
    } catch (error) {
      console.error("Error getting all tokens:", error);
      return [];
    }
  };

  // Helper function to get token details
  const getTokenDetails = async (tokenAddress: string): Promise<{ name: string; totalSupply: string; decimals: number }> => {
    try {
      // Get token name
      const nameResponse = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "eth_call",
          params: [{
            to: tokenAddress,
            data: "0x06fdde03" // name() function selector
          }, "latest"]
        }),
      });

      const nameData = await nameResponse.json();
      
      // Get token decimals
      const decimalsResponse = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 2,
          jsonrpc: "2.0",
          method: "eth_call",
          params: [{
            to: tokenAddress,
            data: "0x313ce567" // decimals() function selector
          }, "latest"]
        }),
      });

      const decimalsData = await decimalsResponse.json();
      const decimals = parseInt(decimalsData.result, 16);
      
      // Get total supply
      const supplyResponse = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 3,
          jsonrpc: "2.0",
          method: "eth_call",
          params: [{
            to: tokenAddress,
            data: "0x18160ddd" // totalSupply() function selector
          }, "latest"]
        }),
      });

      const supplyData = await supplyResponse.json();
      
      if (nameData.error || decimalsData.error || supplyData.error) {
        throw new Error(nameData.error?.message || decimalsData.error?.message || supplyData.error?.message);
      }

      return {
        name: decodeString(nameData.result),
        totalSupply: formatTokenAmount(supplyData.result, decimals),
        decimals
      };
    } catch (error) {
      console.error("Error getting token details:", error);
      return { name: "Unknown Token", totalSupply: "0", decimals: 18 };
    }
  };

  // Helper function to get transfer events
  const getTransferEvents = async (tokenAddress: string): Promise<TransferLog[]> => {
    try {
      const transferEventSignature = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
      
      const requestBody = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getLogs",
        params: [{
          address: tokenAddress,
          fromBlock: "0x0", // Start from genesis
          toBlock: "latest",
          topics: [transferEventSignature]
        }]
      };
      
      const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch transfer events");
      }

      return data.result || [];
    } catch (error) {
      console.error("Error getting transfer events:", error);
      return [];
    }
  };

  // Helper function to decode string from hex
  const decodeString = (hex: string): string => {
    if (!hex || hex === '0x') return '';
    
    // Remove '0x' prefix if present
    hex = hex.startsWith('0x') ? hex.slice(2) : hex;
    
    // Convert hex to bytes
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    
    // Convert bytes to string
    return new TextDecoder().decode(bytes).replace(/\0/g, '');
  };

  // Helper function to format token amount
  const formatTokenAmount = (hexAmount: string, decimals: number): string => {
    if (!hexAmount || hexAmount === '0x') return '0';
    
    // Remove '0x' prefix if present
    hexAmount = hexAmount.startsWith('0x') ? hexAmount.slice(2) : hexAmount;
    
    // Convert hex to decimal
    const decimal = parseInt(hexAmount, 16);
    
    // Format with the correct number of decimals
    return (decimal / Math.pow(10, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

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
    <DashboardLayout userRole="government">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your StockR00t dashboard</p>
        </div>

        {!walletAddress && (
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Please connect your wallet to view blockchain data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={async () => {
                  if (typeof window !== 'undefined' && window.ethereum) {
                    try {
                      await window.ethereum.request({ method: 'eth_requestAccounts' });
                      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                      if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                      }
                    } catch (error) {
                      console.error("Error connecting wallet:", error);
                    }
                  }
                }}
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

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

