"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import ProgressBar from "@/components/atoms/ProgressBar";
import AccountStep from "./onboarding/AccountStep";
import RoleStep from "./onboarding/RoleStep";
import TopicsStep from "./onboarding/TopicsStep";
import PreferencesStep from "./onboarding/PreferencesStep";
import CompletionModal from "./onboarding/CompletionModal";

// Form validation schemas
const accountSchema = yup.object({
  first_name: yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
});

const roleSchema = yup.object({
  role: yup.string().required("Please select your role"),
});

const topicsSchema = yup.object({
  topic_slugs: yup.array().of(yup.string()).min(1, "Please select at least one topic of interest"),
});

const preferencesSchema = yup.object({
  newsletter: yup.boolean(),
  digest_frequency: yup.string().required("Please select digest frequency"),
});

interface OnboardingData {
  first_name: string;
  role: string;
  topic_slugs: string[];
  newsletter: boolean;
  digest_frequency: string;
}

const STEPS = [
  { id: 1, title: "Account", component: AccountStep, schema: accountSchema },
  { id: 2, title: "Role", component: RoleStep, schema: roleSchema },
  { id: 3, title: "Topics", component: TopicsStep, schema: topicsSchema },
  { id: 4, title: "Preferences", component: PreferencesStep, schema: preferencesSchema },
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for deep link intent
  useEffect(() => {
    const intent = searchParams.get("intent");
    if (intent === "download-dataset") {
      setOnboardingData(prev => ({ ...prev, topic_slugs: ["data"] }));
    }
  }, [searchParams]);

  const currentStepConfig = STEPS[currentStep - 1];
  const form = useForm({
    resolver: yupResolver(currentStepConfig.schema),
    mode: "onChange",
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();
    const updatedData = { ...onboardingData, ...formData };
    setOnboardingData(updatedData);

    // Auto-save current step
    await saveStep(updatedData);

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      form.reset();
    } else {
      // Complete onboarding
      await completeOnboarding(updatedData as OnboardingData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      form.reset();
    }
  };

  const saveStep = async (data: Partial<OnboardingData>) => {
    try {
      // For now, just save to localStorage
      localStorage.setItem("onboarding_data", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save step:", error);
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // For now, just save to localStorage and show completion modal
      localStorage.setItem("onboarding_completed", "true");
      localStorage.setItem("onboarding_data", JSON.stringify(data));
      
      setShowCompletionModal(true);
    } catch (error) {
      setError("Failed to complete onboarding. Please try again.");
      console.error("Onboarding completion error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  const handleViewRecommendations = () => {
    router.push("/");
  };

  const handleFinishLater = () => {
    router.push("/");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleNext();
    } else if (e.key === "ArrowRight" && (e.ctrlKey || e.metaKey)) {
      handleNext();
    } else if (e.key === "ArrowLeft" && (e.ctrlKey || e.metaKey)) {
      handlePrevious();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem("onboarding_data");
    if (saved) {
      try {
        setOnboardingData(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  const CurrentStepComponent = currentStepConfig.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Help us personalize your experience with relevant content and insights
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />

        {/* Step Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                form={form}
                data={onboardingData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
                error={error}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="px-6 py-2 text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </button>
            
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : currentStep === STEPS.length ? "Complete" : "Continue"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onViewRecommendations={handleViewRecommendations}
        onFinishLater={handleFinishLater}
        firstName={onboardingData.first_name || ""}
      />
    </div>
  );
} 