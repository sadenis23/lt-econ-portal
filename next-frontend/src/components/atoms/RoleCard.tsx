"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

interface RoleCardProps {
  id: string;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
}

const RoleCard = forwardRef<HTMLInputElement, RoleCardProps & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ id, label, description, icon, selected, ...props }, ref) => {
    const getIcon = (iconName: string) => {
      const iconClasses = "w-6 h-6";
      switch (iconName) {
        case "building":
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          );
        case "newspaper":
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          );
        case "graduation-cap":
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          );
        case "briefcase":
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" />
            </svg>
          );
        case "heart":
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          );
        case "book-open":
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          );
        case "user":
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          );
        default:
          return (
            <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <input
          ref={ref}
          type="radio"
          id={id}
          value={id}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={id}
          className={`block cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
            selected
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`p-3 rounded-full ${
                selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              {getIcon(icon)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </label>
      </motion.div>
    );
  }
);

RoleCard.displayName = "RoleCard";

export default RoleCard; 