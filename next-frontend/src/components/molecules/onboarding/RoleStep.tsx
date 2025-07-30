"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import RoleCard from "@/components/atoms/RoleCard";

interface RoleStepProps {
  form: UseFormReturn<any>;
  data: any;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  error: string;
}

const ROLES = [
  {
    id: "policy_maker",
    label: "Policy Maker",
    description: "Government official or policy advisor",
    icon: "building",
  },
  {
    id: "journalist",
    label: "Journalist",
    description: "Media professional or reporter",
    icon: "newspaper",
  },
  {
    id: "academic",
    label: "Academic",
    description: "Researcher or educator",
    icon: "graduation-cap",
  },
  {
    id: "business",
    label: "Business",
    description: "Entrepreneur or business professional",
    icon: "briefcase",
  },
  {
    id: "ngo",
    label: "NGO",
    description: "Non-governmental organization",
    icon: "heart",
  },
  {
    id: "student",
    label: "Student",
    description: "Currently studying",
    icon: "book-open",
  },
  {
    id: "citizen",
    label: "Citizen",
    description: "Interested member of the public",
    icon: "user",
  },
];

export default function RoleStep({
  form,
  data,
  onNext,
  onPrevious,
  isSubmitting,
  error,
}: RoleStepProps) {
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const selectedRole = watch("role");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What best describes your role?
        </h2>
        <p className="text-gray-600">
          This helps us provide content relevant to your interests and needs
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              id={role.id}
              label={role.label}
              description={role.description}
              icon={role.icon}
              selected={selectedRole === role.id}
              {...register("role")}
            />
          ))}
        </div>

        {errors.role && (
          <p className="text-sm text-red-600 text-center">{errors.role.message}</p>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 text-center">
            This information is used only to tailor content. Never shared.
          </p>
        </div>
      </form>
    </motion.div>
  );
} 