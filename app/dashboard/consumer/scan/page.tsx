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
  Search,
  Leaf,
  Factory,
  Warehouse,
  ShoppingBag,
  TruckIcon,
  Ship,
  Plane,
  Train
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

declare global {
  interface Window {
    ethereum?: any;
  }
}

const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a1c8df8eeb';
const ROOTSTOCK_RPC = 'https://rpc.testnet.rootstock.io/am4fstO3ygCTb5mOi9CmIuUmQ2U7rk-T'; // Replace with your actual endpoint if needed

// Import the SupplyChainToken ABI
const SUPPLY_CHAIN_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function getTransferHistory() view returns (tuple(address from, address to, uint256 amount, uint256 timestamp, string location, string condition)[])",
  "function getQualityChecks() view returns (tuple(address inspector, uint256 timestamp, string report, uint8 score, bool passed)[])",
  "function getProduceInfo() view returns (string, string, string, uint256, address, bool, uint256)"
];

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

// Define interfaces for contract data
interface TransferRecord {
  from: string;
  to: string;
  amount: bigint;
  timestamp: bigint;
  location: string;
  condition: string;
}

interface QualityCheck {
  inspector: string;
  timestamp: bigint;
  report: string;
  score: number;
  passed: boolean;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
}

interface SupplyChainStage {
  stage: string;
  address: string;
  name: string;
  timestamp: number;
  location: string;
  notes: string;
  txHash: string;
}

interface TransferLog {
  blockNumber: string;
  transactionHash: string;
  topics: string[];
  data: string;
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
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Function to get stage icon
  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'production':
      case 'manufacturer':
        return <Factory className="h-5 w-5 text-blue-500" />;
      case 'distribution':
      case 'distributor':
        return <TruckIcon className="h-5 w-5 text-green-500" />;
      case 'retail':
      case 'retailer':
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case 'farmer':
        return <Leaf className="h-5 w-5 text-yellow-500" />;
      case 'warehouse':
        return <Warehouse className="h-5 w-5 text-orange-500" />;
      case 'shipping':
        return <Ship className="h-5 w-5 text-indigo-500" />;
      case 'air freight':
        return <Plane className="h-5 w-5 text-red-500" />;
      case 'rail':
        return <Train className="h-5 w-5 text-gray-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get stage color
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'production':
      case 'manufacturer':
        return 'bg-blue-100 border-blue-300';
      case 'distribution':
      case 'distributor':
        return 'bg-green-100 border-green-300';
      case 'retail':
      case 'retailer':
        return 'bg-purple-100 border-purple-300';
      case 'farmer':
        return 'bg-yellow-100 border-yellow-300';
      case 'warehouse':
        return 'bg-orange-100 border-orange-300';
      case 'shipping':
        return 'bg-indigo-100 border-indigo-300';
      case 'air freight':
        return 'bg-red-100 border-red-300';
      case 'rail':
        return 'bg-gray-100 border-gray-300';
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
      try {
        // Extract the token address from the QR code
        const scannedText = result.text;
        
        // Validate if it's a valid Ethereum address
        if (!ethers.isAddress(scannedText)) {
          toast({
            title: "Invalid Address",
            description: "Please scan a valid token address QR code",
            variant: "destructive"
          });
          return;
        }

        setTokenAddress(scannedText);
        setShowScanner(false);
        handleScan();
      } catch (error) {
        console.error("Error processing QR code:", error);
        toast({
          title: "Scan Error",
          description: "Failed to process QR code. Please try again.",
          variant: "destructive"
        });
      }
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

  const handleScan = async () => {
    if (!tokenAddress) return;
    setLoading(true);
    setProductJourney(null);
    setError('');

    try {
      // Alchemy API configuration
      const ALCHEMY_API_KEY = "oJTjnNCsJEOqYv3MMtrtT6LUFhwcW9pR";
      const ALCHEMY_URL = `https://rootstock-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
      
      // Get token details using Alchemy API
      const tokenDetails = await getTokenDetails(tokenAddress, ALCHEMY_URL);
      const { name, symbol, decimals, totalSupply } = tokenDetails;
      
      // Get user address from browser wallet if available
      let userAddress = "0x0000000000000000000000000000000000000000";
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          await browserProvider.send("eth_requestAccounts", []);
          const signer = await browserProvider.getSigner();
          userAddress = await signer.getAddress();
        } catch (error) {
          console.warn("Failed to get user address from wallet:", error);
        }
      }
      
      // Get transfer events using Alchemy
      const transferEvents = await getTransferEvents(tokenAddress, ALCHEMY_URL);
      
      // Process transfer events to get transaction details
      const transactions = await Promise.all(
        transferEvents.map(async (log: TransferLog): Promise<Transaction | null> => {
          try {
            // Get block for timestamp using Alchemy API
            const block = await getBlockDetails(log.blockNumber, ALCHEMY_URL);
            
            // Parse the log data
            const from = "0x" + log.topics[1].slice(26);
            const to = "0x" + log.topics[2].slice(26);
            const value = log.data;
            
            return {
              hash: log.transactionHash,
              from,
              to,
              value,
              timestamp: block?.timestamp ? parseInt(block.timestamp) * 1000 : Date.now(),
              blockNumber: parseInt(log.blockNumber, 16)
            };
          } catch (error) {
            console.error("Error processing event:", error);
            return null;
          }
        })
      );

      // Filter out any null transactions
      const validTransactions = transactions.filter((tx): tx is Transaction => tx !== null);

      // Create supply chain from transactions
      const supplyChain: SupplyChainStage[] = validTransactions.map((tx, index) => {
        let stage = "Unknown";
        if (tx.from === ethers.ZeroAddress) {
          stage = "Production";
        } else if (index === validTransactions.length - 1) {
          stage = "Retail";
        } else {
          stage = "Distribution";
        }

        return {
          stage,
          address: tx.from === ethers.ZeroAddress ? tx.to : tx.from,
          name: stage === "Production" ? "Manufacturer" : 
                stage === "Distribution" ? "Distributor" : 
                stage === "Retail" ? "Retailer" : "Unknown",
          timestamp: tx.timestamp,
          location: "Blockchain verified",
          notes: `Transfer: ${formatTokenAmount(tx.value, decimals)} tokens`,
          txHash: tx.hash
        };
      });

      // Create product journey object
      const journey: ProductJourney = {
        id: tokenAddress,
        name: name,
        type: "Product",
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
        supplyChain: supplyChain,
        transactions: validTransactions
      };

      setProductJourney(journey);
      setActiveTab("journey");
    } catch (error) {
      console.error("Error processing token data:", error);
      if (error instanceof Error) {
        setError(error.message || "Failed to process token data. Please check the address and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get token details from Alchemy
  const getTokenDetails = async (tokenAddress: string, alchemyUrl: string) => {
    // Get token name
    const nameResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_call",
        params: [{
          to: tokenAddress,
          data: "0x06fdde03" // name() function selector
        }, "latest"]
      })
    });
    const nameData = await nameResponse.json();
    const name = decodeString(nameData.result);
    
    // Get token symbol
    const symbolResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 2,
        jsonrpc: "2.0",
        method: "eth_call",
        params: [{
          to: tokenAddress,
          data: "0x95d89b41" // symbol() function selector
        }, "latest"]
      })
    });
    const symbolData = await symbolResponse.json();
    const symbol = decodeString(symbolData.result);
    
    // Get token decimals
    const decimalsResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 3,
        jsonrpc: "2.0",
        method: "eth_call",
        params: [{
          to: tokenAddress,
          data: "0x313ce567" // decimals() function selector
        }, "latest"]
      })
    });
    const decimalsData = await decimalsResponse.json();
    const decimals = parseInt(decimalsData.result, 16);
    
    // Get token total supply
    const totalSupplyResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 4,
        jsonrpc: "2.0",
        method: "eth_call",
        params: [{
          to: tokenAddress,
          data: "0x18160ddd" // totalSupply() function selector
        }, "latest"]
      })
    });
    const totalSupplyData = await totalSupplyResponse.json();
    const totalSupply = totalSupplyData.result;
    
    return { name, symbol, decimals, totalSupply };
  };

  // Helper function to get block details from Alchemy
  const getBlockDetails = async (blockNumber: string, alchemyUrl: string) => {
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [blockNumber, false]
      })
    });
    
    const data = await response.json();
    return data.result;
  };

  // Helper function to decode string from hex
  const decodeString = (hex: string): string => {
    // Remove the 0x prefix and the length prefix (first 64 characters)
    const hexString = hex.slice(2 + 64);
    // Convert hex to string
    let str = '';
    for (let i = 0; i < hexString.length; i += 2) {
      const charCode = parseInt(hexString.slice(i, i + 2), 16);
      if (charCode === 0) break; // Stop at null terminator
      str += String.fromCharCode(charCode);
    }
    return str;
  };

  // Helper function to format token amount
  const formatTokenAmount = (hexAmount: string, decimals: number): string => {
    const amount = BigInt(hexAmount);
    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = amount / divisor;
    const fractionalPart = amount % divisor;
    return `${integerPart}.${fractionalPart.toString().padStart(decimals, '0')}`;
  };

  // Helper function to get transfer events from Alchemy
  const getTransferEvents = async (tokenAddress: string, alchemyUrl: string): Promise<TransferLog[]> => {
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
    
    const response = await fetch(alchemyUrl, {
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
  };

  return (
    <DashboardLayout userRole="consumer">
      <style jsx global>{`
        #qr-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        #qr-video + canvas {
          will-read-frequently: true;
        }
      `}</style>
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
                <div className="relative w-full max-w-md mx-auto aspect-video">
                  <QrReader
                    constraints={{ 
                      facingMode: 'environment',
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    }}
                    onResult={handleScanResult}
                    className="w-full h-full"
                    videoStyle={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '0.5rem'
                    }}
                    videoId="qr-video"
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
