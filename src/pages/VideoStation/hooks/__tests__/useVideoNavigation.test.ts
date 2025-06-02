import { renderHook, act } from '@testing-library/react';
import { useVideoNavigation } from '../useVideoNavigation';
import { vi, describe, it, expect } from 'vitest';

describe('useVideoNavigation', () => {
  const getVirtualizer = () => ({
    scrollToIndex: vi.fn(),
  });

  it('should initialize with currentIndex 0', () => {
    const rowVirtualizer = getVirtualizer();
    const { result } = renderHook(() => useVideoNavigation(3, rowVirtualizer));
    expect(result.current.currentIndex).toBe(0);
  });

  it('should increment and decrement currentIndex and call scrollToIndex', () => {
    const rowVirtualizer = getVirtualizer();
    const { result } = renderHook(() => useVideoNavigation(3, rowVirtualizer));
    act(() => {
      result.current.handleDown();
    });
    expect(result.current.currentIndex).toBe(1);
    expect(rowVirtualizer.scrollToIndex).toHaveBeenCalledWith(1, { align: 'center' });
    act(() => {
      result.current.handleUp();
    });
    expect(result.current.currentIndex).toBe(0);
    expect(rowVirtualizer.scrollToIndex).toHaveBeenCalledWith(0, { align: 'center' });
  });

  it('should not decrement below 0 or increment above videosLength - 1', () => {
    const rowVirtualizer = getVirtualizer();
    const { result } = renderHook(() => useVideoNavigation(2, rowVirtualizer));
    act(() => {
      result.current.handleUp();
    });
    expect(result.current.currentIndex).toBe(0);
    act(() => {
      result.current.handleDown();
      result.current.handleDown();
    });
    expect(result.current.currentIndex).toBe(1);
  });
});
