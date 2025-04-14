'use client';
import Link from "next/link"
import { Button } from "../components/ui/button"
import { ArrowRight, Leaf, ShieldCheck, BarChart3, Truck, CheckCircle2, Eye, ExternalLink, Factory, Settings, ShoppingBag, Terminal, TruckIcon, User, Warehouse } from "lucide-react"
import { Loader } from "./components/ui/loader"
import { useState } from "react"
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

const features = [
  {
    icon: Leaf,
    title: "End-to-End Tracking",
    description: "Track products from production to consumption with immutable blockchain records"
  },
  {
    icon: ShieldCheck,
    title: "Blockchain Verified",
    description: "Every transaction is secured and verified on the blockchain for maximum trust"
  },
  {
    icon: BarChart3,
    title: "Government Integration",
    description: "Direct subsidies and monitoring for supply security and regulatory compliance"
  },
  {
    icon: Truck,
    title: "Logistics Optimization",
    description: "Streamline transportation and reduce waste with real-time tracking"
  },
  {
    icon: CheckCircle2,
    title: "Quality Assurance",
    description: "Verify quality standards and certifications at every step of the supply chain"
  },
  {
    icon: Eye,
    title: "Consumer Transparency",
    description: "Empower consumers with complete visibility into their product's journey and origin"
  }
]

const processSteps = [
  {
    step: 1,
    title: "Producer Registration",
    description: "Producers register their products with detailed information about manufacturing, quality standards, and specifications"
  },
  {
    step: 2,
    title: "Supplier Distribution",
    description: "Suppliers purchase from producers and distribute to retailers with blockchain verification at each step"
  },
  {
    step: 3,
    title: "Retail Sales",
    description: "Retailers receive products with complete history and make them available to consumers"
  },
  {
    step: 4,
    title: "Consumer Access",
    description: "Consumers scan QR codes to view the complete journey of their product from production to purchase"
  },
  {
    step: 5,
    title: "Government Oversight",
    description: "Government agencies monitor the supply chain and distribute subsidies directly through the platform"
  }
]

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [devMode, setDevMode] = useState(true);
  const [showDevDialog, setShowDevDialog] = useState(false);
  return (
    <div className="flex  flex-col bg-gradient-to-br from-background via-accent/20 to-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img src="/StockR00t.png" className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StockR00t</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center border-4 border-primary rounded-full gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/self">Log in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 animate-fade-in">
              <div className="flex justify-center mt-4 px-8 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 p-6 bg-gradient-to-r from-red-500 to-blue-50 border-yellow-700 hover:bg-gradient-to-r hover:from-red-400 hover:to-red-100"
                onClick={() => setShowDevDialog(true)}
              >
                <Terminal className="h-4 w-4 text-black-600" />
                Developer Mode
              </Button>
            </div>
                <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm text-accent-foreground mb-2">
                  Transparent Supply Chain
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Production to Purchase <span className="text-primary">Transparency</span>
                </h1>
                <p className="text-muted-foreground md:text-xl max-w-[600px]">
                  Track your product's journey from production to consumption with blockchain-verified records. 
                  Ensuring quality, safety, and sustainability at every step.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/auth/login">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end animate-slide-in">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-primary/10 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 w-4/5 h-4/5 bg-accent rounded-lg"></div>
                  <div className="absolute inset-4 bg-card shadow-elevated rounded-lg overflow-hidden border border-border/50">
                    <div className="w-full h-full bg-[url('/StockR00t.png?height=600&width=600')] bg-cover bg-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Why Choose StockR00t?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our platform offers comprehensive tools for every stakeholder in the supply chain
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={feature.title} className="feature-card animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                How StockR00t Works
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our blockchain-powered platform connects all stakeholders in the supply chain
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-border"></div>
              <div className="grid grid-cols-1 gap-8 relative">
                {processSteps.map((step, index) => (
                  <div key={step.step} className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg z-10">
                      {step.step}
                    </div>
                    <div className="feature-card flex-1">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-muted-foreground mt-2">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Join the Future of Supply Chain?
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Start tracking your products today and be part of a transparent, efficient, and sustainable supply ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/auth/signup">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth/login">
                      Log In
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-video rounded-lg overflow-hidden shadow-elevated border border-border/50">
                  <div className="w-full h-full bg-[url('/banner.png?height=400&width=600')] bg-cover bg-center"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container flex justify-center px-4 md:px-6">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} StockR00t. All rights reserved.
            </p>
        </div>
      </footer>

      {/* Developer Mode Dialog */}
      <Dialog open={showDevDialog} onOpenChange={setShowDevDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-600" />
            Developer Mode
          </DialogTitle>
          <DialogDescription>
            Access all dashboard routes for development and testing
          </DialogDescription>
          
          <div className="flex items-center space-x-2 py-2">
            <Switch 
              id="dev-mode" 
              checked={devMode} 
              onCheckedChange={setDevMode} 
            />
            <Label htmlFor="dev-mode" className="text-sm font-medium">
              {devMode ? "Developer Mode Enabled" : "Developer Mode Disabled"}
            </Label>
          </div>
          
          <Separator className="my-2" />
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-1 gap-4">
              <h3 className="font-medium text-sm text-muted-foreground">Dashboard Routes</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Factory className="h-3 w-3 text-blue-500" />
                    Producer
                  </h4>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    <Link href="/dashboard/producer" className="text-sm hover:underline flex items-center gap-1">
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/producer/Products" className="text-sm hover:underline flex items-center gap-1">
                      Products <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/producer/Inventory" className="text-sm hover:underline flex items-center gap-1">
                      Inventory <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/producer/Quality" className="text-sm hover:underline flex items-center gap-1">
                      Quality <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Warehouse className="h-3 w-3 text-green-500" />
                    Supplier
                  </h4>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    <Link href="/dashboard/supplier" className="text-sm hover:underline flex items-center gap-1">
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/supplier/Orders" className="text-sm hover:underline flex items-center gap-1">
                      Orders <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/supplier/Inventory" className="text-sm hover:underline flex items-center gap-1">
                      Inventory <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <TruckIcon className="h-3 w-3 text-orange-500" />
                    Distributor
                  </h4>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    <Link href="/dashboard/distributor" className="text-sm hover:underline flex items-center gap-1">
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/distributor/Orders" className="text-sm hover:underline flex items-center gap-1">
                      Orders <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/distributor/Inventory" className="text-sm hover:underline flex items-center gap-1">
                      Inventory <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3 text-purple-500" />
                    Retailer
                  </h4>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    <Link href="/dashboard/retail" className="text-sm hover:underline flex items-center gap-1">
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/retail/Inventory" className="text-sm hover:underline flex items-center gap-1">
                      Inventory <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/retail/Orders" className="text-sm hover:underline flex items-center gap-1">
                      Orders <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3 text-blue-500" />
                    Consumer
                  </h4>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    <Link href="/dashboard/consumer" className="text-sm hover:underline flex items-center gap-1">
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/consumer/scan" className="text-sm hover:underline flex items-center gap-1">
                      Scan Product <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/consumer/Orders" className="text-sm hover:underline flex items-center gap-1">
                      Orders <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Settings className="h-3 w-3 text-gray-500" />
                    Government
                  </h4>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    <Link href="/dashboard/government" className="text-sm hover:underline flex items-center gap-1">
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/government/Compliance" className="text-sm hover:underline flex items-center gap-1">
                      Compliance <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link href="/dashboard/government/Reports" className="text-sm hover:underline flex items-center gap-1">
                      Reports <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDevDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}