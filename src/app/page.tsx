
import Link from "next/link";
import { Shield, Share2, Clock, ArrowRight, Lock, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>EventVault</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-6 font-medium text-white transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-background"
            >
              <span className="mr-2">Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground mb-6 backdrop-blur-sm bg-background/50 hover:bg-muted/50 transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              The secure vault for your memories
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white mb-6 max-w-4xl mx-auto pb-2">
              Secure Your Moments <br className="hidden md:block" /> Forever.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              EventVault provides bank-grade encryption for your most cherished event memories. Store, organize, and share with absolute peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-all bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
              >
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="h-12 px-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium flex items-center justify-center transition-all"
              >
                Log in to existing vault
              </Link>
            </div>

            {/* Abstract Visual or Dashboard Preview Placeholder */}
            <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border bg-background/50 shadow-2xl p-2 md:p-4 backdrop-blur-sm select-none pointer-events-none opacity-90">
              <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border overflow-hidden relative">
                {/* Simulated UI Content */}
                <div className="absolute inset-0 flex flex-col p-6 md:p-10">
                  <div className="flex gap-4 mb-8">
                    <div className="w-1/4 h-32 rounded-lg bg-white/40 dark:bg-white/5 animate-pulse"></div>
                    <div className="w-1/4 h-32 rounded-lg bg-white/40 dark:bg-white/5 animate-pulse delay-75"></div>
                    <div className="w-1/4 h-32 rounded-lg bg-white/40 dark:bg-white/5 animate-pulse delay-150"></div>
                    <div className="w-1/4 h-32 rounded-lg bg-white/40 dark:bg-white/5 animate-pulse delay-200"></div>
                  </div>
                  <div className="flex-1 rounded-lg bg-white/40 dark:bg-white/5 border border-white/10 p-6">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                      <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                      <div className="h-3 w-4/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything needed for memory management</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Designed for privacy-conscious users who value digital sovereignty.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Lock,
                  title: "End-to-End Encryption",
                  description: "Your photos and videos are encrypted before they leave your device. Only you have the keys.",
                },
                {
                  icon: Share2,
                  title: "Private Sharing",
                  description: "Create temporary, password-protected links for guests. Revoke access at any time.",
                },
                {
                  icon: Clock,
                  title: "Timeline View",
                  description: "Rediscover moments chronologically with our beautiful, adaptive timeline interface.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-background border border-border/50 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5"
                >
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4 mx-auto text-center relative z-10">
            <div className="max-w-3xl mx-auto bg-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 bg-black/10 rounded-full blur-3xl"></div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your memories?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who trust EventVault with their most precious moments. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="h-12 px-8 rounded-full bg-white text-blue-600 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center">
                  Get Started Now
                </Link>
                <Link href="/contact" className="h-12 px-8 rounded-full bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors flex items-center justify-center border border-blue-500">
                  Contact Sales
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-blue-100/80">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Free 14-day trial</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Cancel anytime</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> 24/7 Support</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <div className="flex justify-center items-center gap-2 mb-4 font-semibold text-foreground">
            <Shield className="w-5 h-5" />
            <span>EventVault</span>
          </div>
          <p>© {new Date().getFullYear()} EventVault Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
