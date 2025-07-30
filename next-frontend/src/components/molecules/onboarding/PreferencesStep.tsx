"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";

interface PreferencesStepProps {
  form: UseFormReturn<any>;
  data: any;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  error: string;
}

const DIGEST_FREQUENCIES = [
  { value: "never", label: "Never", description: "No email updates" },
  { value: "weekly", label: "Weekly", description: "Weekly summary of new content" },
  { value: "monthly", label: "Monthly", description: "Monthly digest of highlights" },
];

export default function PreferencesStep({
  form,
  data,
  onNext,
  onPrevious,
  isSubmitting,
  error,
}: PreferencesStepProps) {
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const newsletter = watch("newsletter");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Communication Preferences
        </h2>
        <p className="text-gray-600">
          Choose how you'd like to stay updated with new content and insights
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Newsletter Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Email Newsletter</h3>
              <p className="text-sm text-gray-600">
                Receive updates about new dashboards, reports, and insights
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("newsletter")}
                defaultChecked={data.newsletter !== false}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Digest Frequency */}
          {newsletter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium text-gray-700">
                Digest Frequency
              </label>
              <div className="space-y-2">
                {DIGEST_FREQUENCIES.map((frequency) => (
                  <label key={frequency.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register("digest_frequency")}
                      value={frequency.value}
                      defaultChecked={data.digest_frequency === frequency.value || (!data.digest_frequency && frequency.value === "weekly")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{frequency.label}</div>
                      <div className="text-sm text-gray-500">{frequency.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.digest_frequency && (
                <p className="text-sm text-red-600">{errors.digest_frequency.message}</p>
              )}
            </motion.div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 text-center">
            You can change these preferences anytime in your profile settings.
          </p>
        </div>
      </form>
    </motion.div>
  );
} 