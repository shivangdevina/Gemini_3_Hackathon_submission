import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  Users,
  Sparkles,
  Zap,
  ArrowRight,
  Trophy,
  Target,
  Rocket
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI-Powered Hackathon Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Win Hackathons with Your
              <br />
              <span className="text-gradient">AI Co-Pilot</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover hackathons, build dream teams, and execute winning projects with
              AI-powered research, ideation, planning, and implementation support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 text-base px-8 glow-primary">
                <Link to="/explore">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base px-8">
                <Link to="/workspace">
                  See Demo
                  <Sparkles className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Win</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From discovery to deployment, your AI co-pilot guides you every step of the way
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: "Explore Hackathons",
                description: "Discover opportunities from Devpost, ETHGlobal, MLH, and more. Smart filters help you find the perfect match.",
                link: "/explore",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Users,
                title: "Build Dream Teams",
                description: "Find teammates with complementary skills. AI analyzes team composition and suggests missing roles.",
                link: "/create-team",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Execution",
                description: "Research, ideate, plan, and implement with AI guidance. Generate PRDs and track progress in real-time.",
                link: "/workspace",
                color: "from-primary to-blue-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={feature.link}
                  className="block group bg-card border border-border rounded-xl p-8 hover:border-primary/30 transition-all h-full"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                    <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-border bg-card/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Hackathons", icon: Target },
              { value: "10K+", label: "Hackers", icon: Users },
              { value: "2K+", label: "Teams Formed", icon: Zap },
              { value: "150+", label: "Winners", icon: Trophy },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-card/80" />
            <div className="relative z-10">
              <Rocket className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Join thousands of hackers using AI to turn ideas into winning projects
              </p>
              <Button asChild size="lg" className="gap-2 text-base px-8 glow-primary">
                <Link to="/explore">
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                <span className="text-gradient">Dev</span>Collab
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 DevCollab. Built for hackers, by hackers.
            </p>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
