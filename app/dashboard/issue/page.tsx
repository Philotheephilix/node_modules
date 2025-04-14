"use client"

import { Separator } from "../components/ui/separator"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Checkbox } from "../components/ui/checkbox"
import { Calendar, ChevronRight, Clock, Filter, Search, Users, Wallet } from "lucide-react"

export default function IssuePage() {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [amount, setAmount] = useState("500")
  const [expiryDays, setExpiryDays] = useState("30")
  const [issuingAirdrop, setIssuingAirdrop] = useState(false)

  const recipientGroups = [
    {
      id: "farmers-small",
      name: "Small-Scale Farmers",
      count: 1245,
      description: "Farmers with less than 2 hectares of land",
      criteria: "Land size < 2 hectares, Annual income < ₹200,000",
    },
    {
      id: "farmers-organic",
      name: "Organic Farmers",
      count: 568,
      description: "Farmers practicing certified organic farming",
      criteria: "Organic certification, Sustainable practices score > 80%",
    },
    {
      id: "consumers-bpl",
      name: "BPL Consumers",
      count: 3450,
      description: "Consumers below poverty line",
      criteria: "Income < ₹150,000 per annum, Family size > 3",
    },
    {
      id: "consumers-rural",
      name: "Rural Consumers",
      count: 2780,
      description: "Consumers in rural areas",
      criteria: "Rural address, Distance from urban center > 25km",
    },
    {
      id: "retailers-small",
      name: "Small Retailers",
      count: 890,
      description: "Small-scale Supply retailers",
      criteria: "Annual turnover < ₹1,000,000, Employee count < 5",
    },
  ]

  const toggleRecipient = (id: string) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(selectedRecipients.filter((r) => r !== id))
    } else {
      setSelectedRecipients([...selectedRecipients, id])
    }
  }

  const handleIssueAirdrop = () => {
    setIssuingAirdrop(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIssuingAirdrop(false)
      // Reset selection
      setSelectedRecipients([])
    }, 3000)
  }

  const totalRecipients = selectedRecipients.reduce((total, id) => {
    const group = recipientGroups.find((g) => g.id === id)
    return total + (group?.count || 0)
  }, 0)

  const totalAmount = totalRecipients * Number.parseInt(amount)

  return (
    <DashboardLayout userRole="government">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Issue Airdrops</h1>
          <p className="text-muted-foreground">Distribute subsidies and funds via blockchain smart contracts</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
              <CardDescription>Choose recipient groups for your airdrop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search recipient groups..." className="flex-1" />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {recipientGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                      selectedRecipients.includes(group.id) ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <Checkbox
                      id={group.id}
                      checked={selectedRecipients.includes(group.id)}
                      onCheckedChange={() => toggleRecipient(group.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor={group.id} className="font-medium cursor-pointer">
                          {group.name}
                        </label>
                        <Badge variant="outline">{group.count.toLocaleString()} recipients</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">Criteria:</span> {group.criteria}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Airdrop Details</CardTitle>
                <CardDescription>Configure your airdrop parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount per Recipient (₹)</Label>
                  <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select defaultValue="Supply">
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supply">Supply Subsidy</SelectItem>
                      <SelectItem value="farming">Farming Support</SelectItem>
                      <SelectItem value="emergency">Emergency Relief</SelectItem>
                      <SelectItem value="sustainability">Sustainability Bonus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Period (Days)</Label>
                  <Input id="expiry" type="number" value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Funds will expire after this many days if unused</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restrictions">Usage Restrictions</Label>
                  <Select defaultValue="Supply-only">
                    <SelectTrigger>
                      <SelectValue placeholder="Select restrictions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supply-only">Supply Purchases Only</SelectItem>
                      <SelectItem value="farming-supplies">Farming Supplies Only</SelectItem>
                      <SelectItem value="no-restrictions">No Restrictions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Selected Groups:</span>
                  <span className="font-medium">{selectedRecipients.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Recipients:</span>
                  <span className="font-medium">{totalRecipients.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Amount per Recipient:</span>
                  <span className="font-medium">₹{Number.parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expiry Period:</span>
                  <span className="font-medium">{expiryDays} days</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="text-lg font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={selectedRecipients.length === 0 || issuingAirdrop}
                  onClick={handleIssueAirdrop}
                >
                  {issuingAirdrop ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>Issue Airdrop</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Airdrops</CardTitle>
            <CardDescription>History of recently issued airdrops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {i === 1 ? "Supply Subsidy" : i === 2 ? "Farming Support" : "Emergency Relief"}
                      </p>
                      <Badge variant="outline">{i === 1 ? "3,450" : i === 2 ? "1,245" : "2,780"} recipients</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Issued: {i === 1 ? "April 1, 2025" : i === 2 ? "March 15, 2025" : "February 28, 2025"}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Expires: {i === 1 ? "May 1, 2025" : i === 2 ? "April 15, 2025" : "March 28, 2025"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{i === 1 ? "1,725,000" : i === 2 ? "622,500" : "1,390,000"}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>₹{i === 1 ? "500" : i === 2 ? "500" : "500"} per recipient</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="mt-4 w-full" size="sm">
              View all airdrops
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

