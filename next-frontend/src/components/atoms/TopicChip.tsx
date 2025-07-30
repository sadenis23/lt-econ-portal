"use client";

import { motion } from "framer-motion";

interface TopicChipProps {
  label: string;
  description: string;
  selected: boolean;
  onToggle: () => void;
}

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
          ? "border-blue-500 bg-blue-100 text-blue-700 shadow-md"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
      }`}
      title={description}
    >
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
} 