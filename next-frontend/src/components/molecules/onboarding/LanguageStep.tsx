"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface LanguageStepProps {
  form: UseFormReturn<{ language: string }>;
  data: { language?: string };
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  error: string;
}

const LANGUAGES = [
  { value: "lt", label: "Lietuvių", flag: "🇱🇹" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export default function LanguageStep({
  form,
  data,
  onNext,
  onPrevious,
  isSubmitting,
  error,
}: LanguageStepProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = form;

  // Auto-detect browser language on mount
  useEffect(() => {
    if (!data.language) {
      const browserLang = navigator.language.split('-')[0];
      const supportedLang = LANGUAGES.find(lang => lang.value === browserLang);
      const defaultLang = supportedLang ? supportedLang.value : 'en';
      setValue("language", defaultLang);
    }
  }, [data.language, setValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Language Selection
        </h2>
        <p className="text-gray-600">
          Choose your preferred interface language
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Interface Language
          </label>
          <div className="space-y-3">
            {LANGUAGES.map((language) => (
              <label
                key={language.value}
                className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  {...register("language")}
                  value={language.value}
                  defaultChecked={data.language === language.value || (!data.language && language.value === 'en')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <span className="text-2xl mr-3">{language.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{language.label}</div>
                    <div className="text-sm text-gray-500">
                      {language.value === 'lt' && 'Lithuanian'}
                      {language.value === 'en' && 'English'}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.language && (
            <p className="text-sm text-red-600">{errors.language.message}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 text-center">
            You can change this language preference anytime in your profile settings.
          </p>
        </div>
      </form>
    </motion.div>
  );
} 