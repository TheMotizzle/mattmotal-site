"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  whileInView?: any;
  transition?: any;
  viewport?: any;
}

export function AnimatedSection({
  children,
  className = "",
  initial,
  animate,
  whileInView,
  transition,
  viewport,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}
