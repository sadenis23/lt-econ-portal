"use client";

import { useState } from "react";
import OnboardingWizard from "@/components/molecules/OnboardingWizard";

export default function TestOnboardingPage() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <OnboardingWizard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Test Onboarding Wizard
        </h1>
        <p className="text-gray-600 mb-6">
          Click the button below to test the onboarding wizard functionality.
        </p>
        <button
          onClick={() => setShowWizard(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Onboarding
        </button>
      </div>
    </div>
  );
} 