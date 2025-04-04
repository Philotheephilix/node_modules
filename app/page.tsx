import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, ShieldCheck, BarChart3, Truck } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-accent/20 to-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FoodChain</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">Sign up</Link>
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
                <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm text-accent-foreground mb-2">
                  Transparent Food Supply Chain
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Farm to Table <span className="text-primary">Transparency</span>
                </h1>
                <p className="text-muted-foreground md:text-xl max-w-[600px]">
                  Track your food's journey from production to consumption with blockchain-verified records. 
                  Ensuring quality, safety, and sustainability at every step.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/auth/signup">
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
                    <div className="w-full h-full bg-[url('/placeholder.svg?height=600&width=600')] bg-cover bg-center"></div>
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
                Why Choose FoodChain?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our platform offers comprehensive tools for every stakeholder in the food supply chain
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="feature-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Farm to Table Tracking</h3>
                <p className="text-muted-foreground mt-2">
                  Track food from production to consumption with immutable blockchain records
                </p>
              </div>
              <div className="feature-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Blockchain Verified</h3>
                <p className="text-muted-foreground mt-2">
                  Every transaction is secured and verified on the blockchain for maximum trust
                </p>
              </div>
              <div className="feature-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Government Integration</h3>
                <p className="text-muted-foreground mt-2">
                  Direct subsidies and monitoring for food security and regulatory compliance
                </p>
              </div>
              <div className="feature-card animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Logistics Optimization</h3>
                <p className="text-muted-foreground mt-2">
                  Streamline transportation and reduce waste with real-time tracking
                </p>
              </div>
              <div className="feature-card animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Quality Assurance</h3>
                <p className="text-muted-foreground mt-2">
                  Verify quality standards and certifications at every step of the supply chain
                </p>
              </div>
              <div className="feature-card animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <path d="M9 9h.01" />
                    <path d="M15 9h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Consumer Transparency</h3>
                <p className="text-muted-foreground mt-2">
                  Empower consumers with complete visibility into their food's journey and origin
                </p>
              </div>
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
                How FoodChain Works
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our blockchain-powered platform connects all stakeholders in the food supply chain
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-border"></div>
              <div className="grid grid-cols-1 gap-8 relative">
                <div className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg z-10">1</div>
                  <div className="feature-card flex-1">
                    <h3 className="text-xl font-bold">Farmer Registration</h3>
                    <p className="text-muted-foreground mt-2">
                      Farmers register their crops with detailed information about planting, cultivation methods, and harvesting
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg z-10">2</div>
                  <div className="feature-card flex-1">
                    <h3 className="text-xl font-bold">Supplier Distribution</h3>
                    <p className="text-muted-foreground mt-2">
                      Suppliers purchase from farmers and distribute to retailers with blockchain verification at each step
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg z-10">3</div>
                  <div className="feature-card flex-1">
                    <h3 className="text-xl font-bold">Retail Sales</h3>
                    <p className="text-muted-foreground mt-2">
                      Retailers receive products with complete history and make them available to consumers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg z-10">4</div>
                  <div className="feature-card flex-1">
                    <h3 className="text-xl font-bold">Consumer Access</h3>
                    <p className="text-muted-foreground mt-2">
                      Consumers scan QR codes to view the complete journey of their food from farm to table
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg z-10">5</div>
                  <div className="feature-card flex-1">
                    <h3 className="text-xl font-bold">Government Oversight</h3>
                    <p className="text-muted-foreground mt-2">
                      Government agencies monitor the supply chain and distribute subsidies directly through the platform
                    </p>
                  </div>
                </div>
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
                  Ready to Join the Future of Food Supply Chain?
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Start tracking your products today and be part of a transparent, efficient, and sustainable food ecosystem.
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
                  <div className="w-full h-full bg-[url('/placeholder.svg?height=400&width=600')] bg-cover bg-center"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">FoodChain</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transparent food supply chain tracking with blockchain technology
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} FoodChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}