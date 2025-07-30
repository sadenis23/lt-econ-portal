import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfile } from '../hooks/useProfile';

// Mock fetch globally
global.fetch = jest.fn();

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch profile data on mount', async () => {
    const mockProfile = {
      id: 1,
      user_id: 1,
      first_name: 'Test',
      role: 'policy_maker',
      language: 'en',
      newsletter: true,
      digest_frequency: 'weekly',
      onboarding_completed: false,
      topic_slugs: ['economy'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBe('');
  });

  it('should handle profile update successfully', async () => {
    const initialProfile = {
      id: 1,
      user_id: 1,
      first_name: 'Test',
      role: 'policy_maker',
      language: 'en',
      newsletter: true,
      digest_frequency: 'weekly',
      onboarding_completed: false,
      topic_slugs: ['economy'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const updatedProfile = {
      ...initialProfile,
      onboarding_completed: true,
      first_name: 'Updated Test',
    };

    // Mock initial fetch
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => initialProfile,
      })
      // Mock update request
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Profile updated successfully' }),
      })
      // Mock refetch after update
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProfile,
      });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(initialProfile);

    // Update profile
    await act(async () => {
      const success = await result.current.updateProfile({
        first_name: 'Updated Test',
        onboarding_completed: true,
      });
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.profile).toEqual(updatedProfile);
    });
  });

  it('should handle profile update failure', async () => {
    const mockProfile = {
      id: 1,
      user_id: 1,
      first_name: 'Test',
      role: 'policy_maker',
      language: 'en',
      newsletter: true,
      digest_frequency: 'weekly',
      onboarding_completed: false,
      topic_slugs: ['economy'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    // Mock initial fetch
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      })
      // Mock failed update request
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Invalid data' }),
      });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Update profile
    await act(async () => {
      const success = await result.current.updateProfile({
        first_name: 'Invalid',
      });
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Failed to update profile. Please try again.');
  });

  it('should handle 404 profile not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe('');
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load profile. Please try again.');
    expect(result.current.retryCount).toBe(1);
  });

  it('should retry on error', async () => {
    const mockProfile = {
      id: 1,
      user_id: 1,
      first_name: 'Test',
      role: 'policy_maker',
      language: 'en',
      newsletter: true,
      digest_frequency: 'weekly',
      onboarding_completed: false,
      topic_slugs: ['economy'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    // Mock failed fetch first, then successful retry
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load profile. Please try again.');

    // Retry
    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBe('');
    expect(result.current.retryCount).toBe(0);
  });
}); 