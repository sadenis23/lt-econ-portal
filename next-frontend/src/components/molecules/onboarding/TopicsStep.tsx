"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import TopicChip from "@/components/atoms/TopicChip";

interface TopicsStepProps {
  form: UseFormReturn<any>;
  data: any;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  error: string;
}

const DEFAULT_TOPICS = [
  { slug: "economy", name: "Economy", description: "General economic indicators and trends" },
  { slug: "labor", name: "Labor", description: "Employment, wages, and labor market data" },
  { slug: "prices", name: "Prices", description: "Inflation, price indices, and cost of living" },
  { slug: "public_finance", name: "Public Finance", description: "Government budgets, taxes, and spending" },
  { slug: "social_indicators", name: "Social Indicators", description: "Demographics, health, and social statistics" },
  { slug: "energy", name: "Energy", description: "Energy production, consumption, and prices" },
  { slug: "environment", name: "Environment", description: "Environmental data and sustainability metrics" },
  { slug: "regional", name: "Regional", description: "Regional economic data and comparisons" },
  { slug: "data", name: "Data", description: "Raw datasets and data downloads" },
];

export default function TopicsStep({
  form,
  data,
  onNext,
  onPrevious,
  isSubmitting,
  error,
}: TopicsStepProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const selectedTopics = watch("topic_slugs") || [];

  const handleTopicToggle = (topicSlug: string) => {
    const newSelected = selectedTopics.includes(topicSlug)
      ? selectedTopics.filter((slug: string) => slug !== topicSlug)
      : [...selectedTopics, topicSlug];
    setValue("topic_slugs", newSelected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What topics interest you?
        </h2>
        <p className="text-gray-600">
          Select the topics you'd like to see more content about
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {DEFAULT_TOPICS.map((topic) => (
              <TopicChip
                key={topic.slug}
                label={topic.name}
                description={topic.description}
                selected={selectedTopics.includes(topic.slug)}
                onToggle={() => handleTopicToggle(topic.slug)}
              />
            ))}
          </div>
        </div>

        {errors.topic_slugs && (
          <p className="text-sm text-red-600 text-center">{errors.topic_slugs.message}</p>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 text-center">
            You can change these preferences anytime in your profile settings.
          </p>
        </div>
      </form>
    </motion.div>
  );
} 