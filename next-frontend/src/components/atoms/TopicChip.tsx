"use client";

import { motion } from "framer-motion";

interface TopicChipProps {
  label: string;
  description: string;
  selected: boolean;
  onToggle: () => void;
}

// Export the improved tag classes for reuse in other components
export const tagClasses = "inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-900 ring-1 ring-inset ring-emerald-300";

export default function TopicChip({
  label,
  description,
  selected,
  onToggle,
}: TopicChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        selected
          ? "border-emerald-500 bg-emerald-100 text-emerald-900 shadow-md ring-1 ring-emerald-300"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
      }`}
      title={description}
    >
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
} 