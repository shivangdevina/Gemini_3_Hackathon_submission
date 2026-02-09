import React from "react";
import { motion } from "framer-motion";

// Skeleton animation
const skeletonVariants = {
  initial: { opacity: 0.6 },
  animate: { opacity: [0.6, 1, 0.6] },
};

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 1.5, repeat: Infinity }}
      className="bg-muted rounded-lg p-4 space-y-3"
    >
      <div className="h-6 bg-muted-foreground/20 rounded w-3/4" />
      <div className="h-4 bg-muted-foreground/20 rounded w-full" />
      <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-muted-foreground/20 rounded w-20" />
        <div className="h-8 bg-muted-foreground/20 rounded w-20" />
      </div>
    </motion.div>
  );
}

// Team Member Skeleton
export function TeamMemberSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 1.5, repeat: Infinity }}
      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
    >
      <div className="h-10 w-10 bg-muted-foreground/20 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-24" />
        <div className="h-3 bg-muted-foreground/20 rounded w-32" />
      </div>
    </motion.div>
  );
}

// Stage Content Skeleton
export function StageContentSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 1.5, repeat: Infinity }}
      className="space-y-4"
    >
      <div className="h-8 bg-muted-foreground/20 rounded w-1/3" />
      <div className="space-y-3">
        <div className="h-4 bg-muted-foreground/20 rounded w-full" />
        <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
        <div className="h-4 bg-muted-foreground/20 rounded w-4/6" />
      </div>
      <div className="h-32 bg-muted-foreground/20 rounded" />
    </motion.div>
  );
}

// Table Skeleton
export function TableRowSkeleton() {
  return (
    <motion.tr
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 1.5, repeat: Infinity }}
      className="border-b border-border"
    >
      <td className="py-3 px-4">
        <div className="h-4 bg-muted-foreground/20 rounded w-24" />
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-muted-foreground/20 rounded w-32" />
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-muted-foreground/20 rounded w-20" />
      </td>
      <td className="py-3 px-4">
        <div className="h-8 bg-muted-foreground/20 rounded w-16" />
      </td>
    </motion.tr>
  );
}

// Loading Spinner with Text
export function LoadingSpinner({
  text = "Loading...",
  size = "md",
}: {
  text?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} rounded-full border-3 border-muted border-t-primary`}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

// Pulse Dot Animation
export function PulseDots() {
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: dot * 0.15,
          }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
  );
}

// Page Loading Overlay
export function PageLoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-card/50 backdrop-blur-sm flex items-center justify-center rounded-lg"
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    </motion.div>
  );
}

// Skeleton Grid
export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton List
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TeamMemberSkeleton key={i} />
      ))}
    </div>
  );
}

// Animated Background
export function AnimatedLoadingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(88, 86, 214, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(88, 86, 214, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(88, 86, 214, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0"
      />
    </div>
  );
}
