import { Suspense } from "react";
import OnboardingWizard from "@/components/molecules/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading onboarding...</div>}>
      <OnboardingWizard />
    </Suspense>
  );
} 