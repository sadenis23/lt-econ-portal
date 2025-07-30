"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRecommendations: () => void;
  onFinishLater: () => void;
  firstName: string;
}

export default function CompletionModal({
  isOpen,
  onClose,
  onViewRecommendations,
  onFinishLater,
  firstName,
}: CompletionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  You're all set, {firstName || "there"}!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your profile is complete and we'll use your preferences to personalize your experience.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={onViewRecommendations}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Recommended Content
                  </button>
                  <button
                    onClick={onFinishLater}
                    className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Finish Later
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 