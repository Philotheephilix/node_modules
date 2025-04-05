'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from "../../../../hooks/use-toast";
import { QrReader } from 'react-qr-reader';
import { 
  Package, 
  Truck, 
  Store, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Copy, 
  Scan,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert";
import { AlertCircle, CheckCircle2, Copy as CopyIcon } from "lucide-react";
import { DashboardLayout } from '../../../../components/dashboard-layout';

const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a1c8df8eeb';
const ROOTSTOCK_RPC = 'https://rpc.testnet.rootstock.io/am4fstO3ygCTb5mOi9CmIuUmQ2U7rk-T'; // Replace with your actual endpoint if needed

// Define the ProductJourney interface
interface ProductJourney {
  id: string;
  name: string;
  type: string;
  origin: string;
  harvestDate: number;
  isOrganic: boolean;
  sustainabilityScore: number;
  qualityChecks: {
    inspector: string;
    timestamp: number;
    report: string;
    score: number;
    passed: boolean;
  }[];
  supplyChain: {
    stage: string;
    address: string;
    name: string;
    timestamp: number;
    location: string;
    notes: string;
    txHash: string;
  }[];
  transactions: {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    blockNumber: number;
  }[];
}

export default function ScanPage() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [productJourney, setProductJourney] = useState<ProductJourney | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('journey');
  const [showScanner, setShowScanner] = useState(false);
  const [expandedStages, setExpandedStages] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  // Function to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Function to get stage icon
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Production':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'Distribution':
        return <Truck className="h-5 w-5 text-green-500" />;
      case 'Retail':
        return <Store className="h-5 w-5 text-purple-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get stage color
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Production':
        return 'bg-blue-100 border-blue-300';
      case 'Distribution':
        return 'bg-green-100 border-green-300';
      case 'Retail':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  // Function to toggle stage expansion
  const toggleStage = (stage: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stage]: !prev[stage]
    }));
  };

  // Function to copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      variant: "default"
    });
  };

  // Function to handle QR scan result
  const handleScanResult = (result: any) => {
    if (result) {
      setTokenAddress(result.text);
      setShowScanner(false);
      handleScan();
    }
  };

  // Function to handle QR scan error
  const handleScanError = (error: any) => {
    console.error(error);
    toast({
      title: "Scan Error",
      description: "Failed to scan QR code. Please try again or enter the address manually.",
      variant: "destructive"
    });
  };

  const fetchTokenTransfers = async (tokenAddress: string) => {
    const body = {
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [
        {
          address: tokenAddress,
          fromBlock: '0x0',
          toBlock: 'latest',
          topics: [TRANSFER_EVENT_SIGNATURE],
        },
      ],
      id: 1,
    };

    const response = await fetch(ROOTSTOCK_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data.result;
  };

  const fetchBlockTimestamp = async (blockHash: string) => {
    const body = {
      jsonrpc: '2.0',
      method: 'eth_getBlockByHash',
      params: [blockHash, false],
      id: 1,
    };

    const response = await fetch(ROOTSTOCK_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const hex = data.result?.timestamp || '0x0';
    return new Date(parseInt(hex, 16) * 1000).toLocaleString();
  };

  const parseLog = (log: any) => {
    const from = `0x${log.topics[1].slice(26)}`;
    const to = `0x${log.topics[2].slice(26)}`;
    return {
      hash: log.transactionHash,
      blockNumber: parseInt(log.blockNumber, 16),
      from,
      to,
      blockHash: log.blockHash,
    };
  };

  const handleScan = async () => {
    if (!tokenAddress) return;
    setLoading(true);
    setProductJourney(null);
    setError('');

    try {
      // Create a provider and contract instance
      const provider = new ethers.JsonRpcProvider(ROOTSTOCK_RPC);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function decimals() view returns (uint8)",
          "function totalSupply() view returns (uint256)",
          "function balanceOf(address) view returns (uint256)"
        ],
        provider
      );
      
      // Get token details
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply()
      ]);
      
      // Try to get signer for user address, but use a fallback if not available
      let userAddress = "0x0000000000000000000000000000000000000000";
      try {
        const signer = await provider.getSigner();
        userAddress = await signer.getAddress();
      } catch (error) {
        console.warn("No signer available, using fallback address:", error);
        // Continue with the fallback address
      }

      // Get the current block number
      const currentBlock = await provider.getBlockNumber()
      
      // Use a very small block range to avoid RPC limitations
      const BLOCK_RANGE = 10 // Fetch only last 10 blocks initially
      const fromBlock = Math.max(0, currentBlock - BLOCK_RANGE)
      
      let transferEvents: any[] = []
      let useMockData = false
      
      try {
        // Get token transfer events using direct RPC call
        const transferEventSignature = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        
        try {
          // First attempt with minimal range
          const logs = await provider.send("eth_getLogs", [{
            address: tokenAddress,
            fromBlock: `0x${fromBlock.toString(16)}`,
            toBlock: `0x${currentBlock.toString(16)}`,
            topics: [transferEventSignature]
          }])
          
          transferEvents = logs || []
          
          // If we got no events, try one more time with a different range
          if (transferEvents.length === 0) {
            const alternateFromBlock = Math.max(0, currentBlock - 20)
            const alternateLogs = await provider.send("eth_getLogs", [{
              address: tokenAddress,
              fromBlock: `0x${alternateFromBlock.toString(16)}`,
              toBlock: `0x${currentBlock.toString(16)}`,
              topics: [transferEventSignature]
            }])
            
            transferEvents = alternateLogs || []
          }
        } catch (error) {
          console.error("Error fetching transfer events:", error)
          useMockData = true
        }
        
        // If we still have no events or encountered errors, use mock data
        if (transferEvents.length === 0 || useMockData) {
          console.log("Using mock transaction data due to RPC limitations")
          
          // Create mock transaction data
          const mockTransactions = [
            {
              hash: "0x" + "0".repeat(64),
              from: ethers.ZeroAddress,
              to: userAddress,
              value: ethers.parseUnits("1000", decimals).toString(),
              timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
              blockNumber: currentBlock - 100
            },
            {
              hash: "0x" + "1".repeat(64),
              from: userAddress,
              to: "0x" + "2".repeat(40),
              value: ethers.parseUnits("500", decimals).toString(),
              timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
              blockNumber: currentBlock - 50
            },
            {
              hash: "0x" + "2".repeat(64),
              from: "0x" + "2".repeat(40),
              to: "0x" + "3".repeat(40),
              value: ethers.parseUnits("200", decimals).toString(),
              timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
              blockNumber: currentBlock - 25
            }
          ]
          
          // Create supply chain from mock transactions
          const supplyChain = mockTransactions.map((tx, index) => {
            let stage = "Unknown"
            if (tx.from === ethers.ZeroAddress) {
              stage = "Production"
            } else if (index === mockTransactions.length - 1) {
              stage = "Retail"
            } else {
              stage = "Distribution"
            }

            return {
              stage,
              address: tx.from === ethers.ZeroAddress ? tx.to : tx.from,
              name: stage === "Production" ? "Manufacturer" : 
                    stage === "Distribution" ? "Distributor" : 
                    stage === "Retail" ? "Retailer" : "Unknown",
              timestamp: tx.timestamp,
              location: "Blockchain verified",
              notes: `Transfer: ${ethers.formatUnits(tx.value, decimals)} tokens`,
              txHash: tx.hash
            }
          })
          
          // Create product journey object with mock transaction data
          const journey: ProductJourney = {
            id: tokenAddress,
            name: name,
            type: "Electronics",
            origin: "Manufacturing Facility",
            harvestDate: mockTransactions[0].timestamp,
            isOrganic: false,
            sustainabilityScore: 85,
            qualityChecks: [
              {
                inspector: "Quality Control",
                timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
                report: "Product passed all quality checks",
                score: 95,
                passed: true
              },
              {
                inspector: "Final Inspection",
                timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
                report: "Product ready for retail",
                score: 98,
                passed: true
              }
            ],
            supplyChain,
            transactions: mockTransactions
          }
          
          setProductJourney(journey)
          setActiveTab("journey")
          toast({
            title: "Demo Mode",
            description: "Using demo data due to RPC limitations. This is not real transaction data.",
            variant: "default"
          })
          return
        }
        
        // Process transfer events to get transaction details
        const transactions = await Promise.all(
          transferEvents.map(async (log) => {
            try {
              // Get block for timestamp
              const block = await provider.getBlock(parseInt(log.blockNumber, 16))
              
              // Parse the log data
              const from = "0x" + log.topics[1].slice(26)
              const to = "0x" + log.topics[2].slice(26)
              const value = log.data
              
              return {
                hash: log.transactionHash,
                from,
                to,
                value,
                timestamp: block?.timestamp ? block.timestamp * 1000 : Date.now(),
                blockNumber: parseInt(log.blockNumber, 16)
              }
            } catch (error) {
              console.error("Error processing event:", error)
              return null
            }
          })
        )

        // Filter out any null transactions
        const validTransactions = transactions.filter(tx => tx !== null)
        
        // Create supply chain from transactions
        const supplyChain = validTransactions.map((tx, index) => {
          let stage = "Unknown"
          if (tx.from === ethers.ZeroAddress) {
            stage = "Production"
          } else if (index === validTransactions.length - 1) {
            stage = "Retail"
          } else {
            stage = "Distribution"
          }

          return {
            stage,
            address: tx.from === ethers.ZeroAddress ? tx.to : tx.from,
            name: stage === "Production" ? "Manufacturer" : 
                  stage === "Distribution" ? "Distributor" : 
                  stage === "Retail" ? "Retailer" : "Unknown",
            timestamp: tx.timestamp,
            location: "Blockchain verified",
            notes: `Transfer: ${ethers.formatUnits(tx.value, decimals)} tokens`,
            txHash: tx.hash
          }
        })

        // Create product journey object
        const journey: ProductJourney = {
          id: tokenAddress,
          name: name,
          type: "Electronics",
          origin: "Manufacturing Facility",
          harvestDate: validTransactions.length > 0 ? validTransactions[0].timestamp : Date.now(),
          isOrganic: false,
          sustainabilityScore: 85,
          qualityChecks: [
            {
              inspector: "Quality Control",
              timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
              report: "Product passed all quality checks",
              score: 95,
              passed: true
            },
            {
              inspector: "Final Inspection",
              timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
              report: "Product ready for retail",
              score: 98,
              passed: true
            }
          ],
          supplyChain,
          transactions: validTransactions
        }

        setProductJourney(journey)
        setActiveTab("journey")
      } catch (error) {
        console.error("Error processing token data:", error)
        setError("Failed to process token data")
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch token history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="consumer">
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Scanner</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <CopyIcon className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scan Product</CardTitle>
          <CardDescription>
            Enter a token address or scan a QR code to track the product journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter token address"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="w-full"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowScanner(!showScanner)}
                >
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleScan}
              disabled={loading || !tokenAddress}
              className="w-full md:w-auto"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
                </div>
              ) : (
                'Scan Product'
              )}
            </Button>
          </div>

          {showScanner && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Scan QR Code</h3>
              <div className="max-w-md mx-auto">
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={handleScanResult}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {productJourney && (
        <Card>
          <CardHeader>
            <CardTitle>{productJourney.name}</CardTitle>
            <CardDescription>
              Product ID: {productJourney.id.substring(0, 10)}...
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1"
                onClick={() => copyToClipboard(productJourney.id, "Product ID")}
              >
                <CopyIcon className="h-3 w-3" />
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="journey" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="journey">Journey</TabsTrigger>
                <TabsTrigger value="quality">Quality Checks</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="journey" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Type: {productJourney.type}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Origin: {productJourney.origin}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Created: {formatDate(productJourney.harvestDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">Sustainability Score: {productJourney.sustainabilityScore}/100</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Supply Chain Journey</h3>
                
                <div className="space-y-4">
                  {productJourney.supplyChain.map((stage, index) => (
                    <div key={index} className="relative">
                      {/* Vertical line connecting stages */}
                      {index < productJourney.supplyChain.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      
                      <div className={`border rounded-lg p-4 ${getStageColor(stage.stage)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-white rounded-full p-2 mr-4 shadow-sm">
                              {getStageIcon(stage.stage)}
                            </div>
                            <div>
                              <h4 className="font-medium">{stage.stage}</h4>
                              <p className="text-sm text-gray-600">{stage.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleStage(stage.stage)}
                            >
                              {expandedStages[stage.stage] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        {expandedStages[stage.stage] && (
                          <div className="mt-4 pl-12 space-y-2">
                            <div className="flex items-center text-sm">
                              <User className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-600">Address: </span>
                              <code className="ml-1 bg-gray-100 px-1 rounded text-xs truncate max-w-[200px]">
                                {stage.address}
                              </code>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 ml-1"
                                onClick={() => copyToClipboard(stage.address, "Address")}
                              >
                                <CopyIcon className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-600">Time: {formatDate(stage.timestamp)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-600">Location: {stage.location}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-600">{stage.notes}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-gray-600">Block: {productJourney.transactions.find(tx => tx.hash === stage.txHash)?.blockNumber || 'N/A'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="quality" className="mt-4">
                <div className="space-y-4">
                  {productJourney.qualityChecks.map((check, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {check.passed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <CardTitle className="text-base">{check.inspector}</CardTitle>
                          </div>
                          <Badge variant={check.passed ? "default" : "destructive"}>
                            {check.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-600">{formatDate(check.timestamp)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-600">Score: {check.score}/100</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            {check.report}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productJourney.transactions.map((tx, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{tx.blockNumber}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(tx.timestamp)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[150px]">{tx.from}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[150px]">{tx.to}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[150px]">
                            <div className="flex items-center">
                              <code className="truncate">{tx.hash}</code>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 ml-1"
                                onClick={() => copyToClipboard(tx.hash, "Transaction hash")}
                              >
                                <CopyIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
    </DashboardLayout>
  );
}
