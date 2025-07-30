"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";

interface AccountStepProps {
  form: UseFormReturn<any>;
  data: any;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  error: string;
}

export default function AccountStep({
  form,
  data,
  onNext,
  onPrevious,
  isSubmitting,
  error,
}: AccountStepProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          We'll use this information to personalize your experience
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            {...register("first_name")}
            defaultValue={data.first_name || ""}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Account Information</h3>
          <p className="text-sm text-blue-700">
            Your account is already set up. We'll use your existing email and username.
          </p>
        </div>
      </form>
    </motion.div>
  );
} 