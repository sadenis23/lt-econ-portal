import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProfilePage from '../app/profile/page';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('../context/AuthContext');
jest.mock('../hooks/useProfile');
jest.mock('../components/atoms/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;

describe('ProfilePage', () => {
  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
  };

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockProfile = {
    id: 1,
    user_id: 1,
    first_name: 'Test',
    role: 'policy_maker',
    language: 'en' as const,
    newsletter: true,
    digest_frequency: 'weekly',
    onboarding_completed: true,
    topic_slugs: ['economy', 'labor'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      token: null,
      loading: false,
    });
  });

  it('should display user information correctly', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: true,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    // Check for skeleton loading elements
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
  });

  it('should show incomplete profile warning', () => {
    const incompleteProfile = { ...mockProfile, onboarding_completed: false };
    mockUseProfile.mockReturnValue({
      profile: incompleteProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Complete Setup')).toBeInTheDocument();
    expect(screen.getByText('Profile Incomplete')).toBeInTheDocument();
  });

  it('should show complete profile status', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Profile Complete')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('should handle error state with retry button', () => {
    const mockRetry = jest.fn();
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      error: 'Failed to load profile',
      retryCount: 1,
      retry: mockRetry,
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try again'));
    expect(mockRetry).toHaveBeenCalled();
  });

  it('should navigate to onboarding when complete setup is clicked', () => {
    const incompleteProfile = { ...mockProfile, onboarding_completed: false };
    mockUseProfile.mockReturnValue({
      profile: incompleteProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    fireEvent.click(screen.getByText('Complete Setup'));
    expect(mockRouter.push).toHaveBeenCalledWith('/onboarding');
  });

  it('should navigate to onboarding when edit profile is clicked', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(mockRouter.push).toHaveBeenCalledWith('/onboarding');
  });

  it('should show topics of interest when available', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Topics of Interest')).toBeInTheDocument();
    expect(screen.getByText('economy')).toBeInTheDocument();
    expect(screen.getByText('labor')).toBeInTheDocument();
  });

  it('should display role information correctly', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('policy maker')).toBeInTheDocument();
  });

  it('should display language information correctly', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should display newsletter frequency correctly', () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('weekly')).toBeInTheDocument();
  });

  it('should show disabled newsletter when newsletter is false', () => {
    const disabledNewsletterProfile = { ...mockProfile, newsletter: false };
    mockUseProfile.mockReturnValue({
      profile: disabledNewsletterProfile,
      loading: false,
      error: '',
      retryCount: 0,
      retry: jest.fn(),
      refetch: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      token: null,
      loading: false,
    });

    render(<ProfilePage />);

    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });
}); 