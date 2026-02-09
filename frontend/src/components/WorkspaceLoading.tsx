import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Brain, FileText } from "lucide-react";

interface WorkspaceLoadingProps {
  stage?: "team" | "research" | "ideation" | "prd" | "implementation";
  message?: string;
}

export function WorkspaceLoading({
  stage = "team",
  message,
}: WorkspaceLoadingProps) {
  const stageConfig = {
    team: {
      icon: Sparkles,
      title: "Building Your Team",
      description: "Setting up team members and roles...",
      color: "from-blue-500 to-purple-500",
    },
    research: {
      icon: Brain,
      title: "Analyzing Research",
      description: "Gathering insights and data...",
      color: "from-purple-500 to-pink-500",
    },
    ideation: {
      icon: Zap,
      title: "Generating Ideas",
      description: "Creating innovative solutions...",
      color: "from-yellow-500 to-orange-500",
    },
    prd: {
      icon: FileText,
      title: "Drafting PRD",
      description: "Creating product specification...",
      color: "from-green-500 to-emerald-500",
    },
    implementation: {
      icon: Zap,
      title: "Implementing Changes",
      description: "Building and deploying...",
      color: "from-red-500 to-rose-500",
    },
  };

  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
      {/* Animated gradient background */}
      <motion.div
        animate={{
          background: [
            `linear-gradient(135deg, ${config.color.split(" ")[1]} 0%, transparent 100%)`,
            `linear-gradient(135deg, transparent 0%, ${config.color.split(" ")[1]} 100%)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 opacity-5 blur-3xl"
      />

      <div className="relative z-10 text-center space-y-6">
        {/* Loader */}
        <div className="flex justify-center mb-8">
          <div className="loader">
            <div className="cell d-0"></div>
            <div className="cell d-1"></div>
            <div className="cell d-2"></div>

            <div className="cell d-1"></div>
            <div className="cell d-2"></div>
            <div className="cell d-3"></div>

            <div className="cell d-2"></div>
            <div className="cell d-3"></div>
            <div className="cell d-4"></div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{config.title}</h3>
          <p className="text-muted-foreground">{message || config.description}</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-1.5 items-center justify-center pt-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{ height: ["8px", "16px", "8px"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.15,
              }}
              className="w-1.5 rounded-full bg-primary"
            />
          ))}
        </div>

        {/* Progress indicator */}
        <motion.div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}

export function StageCardLoading() {
  return (
    <motion.div
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="p-6 rounded-lg border border-border bg-muted space-y-4"
    >
      <div className="h-6 bg-muted-foreground/20 rounded w-1/3" />
      <div className="space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-full" />
        <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-10 bg-muted-foreground/20 rounded w-24" />
        <div className="h-10 bg-muted-foreground/20 rounded w-24" />
      </div>
    </motion.div>
  );
}
