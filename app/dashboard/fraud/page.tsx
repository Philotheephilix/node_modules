"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AlertCircle, Calendar, Check, ChevronRight, Eye, Filter, MapPin, Package, Search } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function FraudPage() {
  const { toast } = useToast()
  const [isInvestigating, setIsInvestigating] = useState(false)
  
  const fraudStats = {
    activeAlerts: 8,
    resolvedCases: 24,
    detectionRate: 98.5,
    averageResolutionTime: 2.3
  }
  
  const fraudAlerts = [
    {
      id: "fraud-1",
      type: "Suspicious Transaction",
      product: "Premium Rice",
      severity: "high",
      location: "Delhi, India",
      timestamp: "2025-04-01T08:30:00",
      details: "Unusual quantity change between supplier and retailer",
      status: "open"
    },
    {
      id: "fraud-2",
      type: "QR Code Tampering",
      product: "Organic Wheat",
      severity: "high",
      location: "Mumbai, India",
      timestamp: "2025-04-01T10:15:00",
      details: "QR code verification failed - possible counterfeit",
      status: "open"
    },
    {
      id: "fraud-3",
      type: "Certification Mismatch",
      product: "Mixed Vegetables",
      severity: "medium",
      location: "Bangalore, India",
      timestamp: "2025-04-01T09:45:00",
      details: "Organic certification not matching blockchain records",
      status: "open"
    }
  ]
  
  const resolvedCases = [
    {
      id: "case-1",
      type: "Counterfeit Product",
      product: "Basmati Rice",
      location: "Chennai, India",
      detectedDate: "2025-03-25",
      resolvedDate: "2025-03-27",
      resolution: "Product removed from supply chain, retailer warned"
    },
    {
      id: "case-2",
      type: "Data Manipulation",
      product: "Fresh Fruits",
      location: "Hyderabad, India",
      detectedDate: "2025-03-20",
      resolvedDate: "2025-03-22",
      resolution: "Blockchain records corrected, supplier fined"
    }
  ]
  
  const handleInvestigate = (alertId: string) => {
    setIsInvestigating(true)
    
    // Simulate investigation process
    setTimeout(() => {
      setIsInvestigating(false)
      toast({
        title: "Investigation initiated",
        description: "The case has been assigned to an investigator.",
      })
    }, 2000)
  }
  
  return (
    <DashboardLayout userRole="government">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Fraud Detection</h1>
          <p className="text-muted-foreground">
            Monitor and investigate potential fraud in the supply chain
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{fraudStats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">
                Requiring investigation
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Resolved Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{fraudStats.resolvedCases}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Detection Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{fraudStats.detectionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Accuracy of detection
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{fraudStats.averageResolutionTime} days</div>
              <p className="text-xs text-muted-foreground">
                Average time to resolve
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search alerts, cases, or products..." className="flex-1" />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs defaultValue="alerts">
          <TabsList>
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Cases</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Alerts</CardTitle>
                <CardDescription>
                  Potential fraud cases requiring investigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fraudAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className={`rounded-full p-2 ${alert.severity === 'high' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                        <AlertCircle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{alert.type}</p>
                          <Badge variant={alert.severity === 'high' ? "destructive" : "default"}>
                            {alert.severity === 'high' ? "High" : "Medium"} Priority
                          </Badge>
                        </div>
                        <p className="text-sm">{alert.details}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{alert.product}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{alert.location}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleInvestigate(alert.id)}
                        disabled={isInvestigating}
                      >
                        {isInvestigating ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                            Processing...
                          </>
                        ) : (
                          "Investigate"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all alerts
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Cases</CardTitle>
                <CardDescription>
                  Fraud cases that have been investigated and resolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resolvedCases.map((caseItem) => (
                    <div key={caseItem.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{caseItem.type}</p>
                          <Badge variant="outline">Resolved</Badge>
                        </div>
                        <p className="text-sm">{caseItem.resolution}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{caseItem.product}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{caseItem.location}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Detected: {new Date(caseItem.detectedDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Resolved: {new Date(caseItem.resolvedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" /> Details
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="mt-4 w-full" size="sm">
                  View all cases
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div>
  Analytics content goes here. You can add charts, graphs, and other visualizations to provide insights into fraud trends and patterns.
  </div>
</TabsContent>
  </Tabs>
</div>
  </DashboardLayout>
)
  }
