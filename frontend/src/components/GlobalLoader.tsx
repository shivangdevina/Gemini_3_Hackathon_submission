import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/contexts/LoadingContext";

export default function GlobalLoader() {
  const { isLoading, message } = useLoading();

  const dots = [0, 1, 2];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-card to-card/80 border border-primary/20 shadow-2xl shadow-primary/10 p-8 rounded-2xl flex flex-col items-center gap-6 max-w-md w-full mx-4"
          >
            {/* Enhanced Spinner */}
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

            {/* Message Text */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">
                {message || "Working on it"}
              </p>
              <p className="text-xs text-muted-foreground">
                {message
                  ? "Please wait..."
                  : "This may take a few moments..."}
              </p>
            </div>

            {/* Animated Dots */}
            <div className="flex gap-1.5 items-center justify-center h-1">
              {dots.map((dot) => (
                <motion.div
                  key={dot}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>

            {/* Progress Bar (subtle) */}
            <motion.div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
