import { renderHook, act } from '@testing-library/react';
import { useLocationModal } from '../useLocationModal';
import { vi, describe, it, expect } from 'vitest';

describe('useLocationModal', () => {
  it('should handle modal open/close and coordinate selection', () => {
    const setLocation = vi.fn();
    const { result } = renderHook(() => useLocationModal(setLocation));
    expect(result.current.modalOpened).toBe(false);
    act(() => {
      result.current.setModalOpened(true);
    });
    expect(result.current.modalOpened).toBe(true);
    act(() => {
      result.current.handleSelectCoordinates({ lat: 10, lon: 20 });
    });
    expect(setLocation).toHaveBeenCalledWith({ lat: 10, lon: 20 });
    expect(result.current.modalOpened).toBe(false);
  });
});
