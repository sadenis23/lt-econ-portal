import React from 'react';
import { render, screen } from '@testing-library/react';
import OnboardingWizard from '../components/molecules/OnboardingWizard';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser' },
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

describe('OnboardingWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('should render the first step correctly', () => {
    render(<OnboardingWizard />);
    
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(screen.getByText('25% complete')).toBeInTheDocument();
  });

  it('should show role options in step 1', () => {
    render(<OnboardingWizard />);
    
    expect(screen.getByText('Policy Maker')).toBeInTheDocument();
    expect(screen.getByText('Journalist')).toBeInTheDocument();
    expect(screen.getByText('Academic')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
  });

  it('should have proper step structure', () => {
    render(<OnboardingWizard />);
    
    // Check that we have the correct step titles
    expect(screen.getByText('What best describes your role?')).toBeInTheDocument();
  });
}); 