import { renderHook, act } from '@testing-library/react';
import { useVideoNavigation } from '../useVideoNavigation';
import { vi, describe, it, expect } from 'vitest';

describe('useVideoNavigation', () => {
  const getScrollToIndex = () => vi.fn();

  it('should initialize with currentIndex 0', () => {
    const scrollToIndex = getScrollToIndex();
    const { result } = renderHook(() => useVideoNavigation(3, scrollToIndex));
    expect(result.current.currentIndex).toBe(0);
  });

  it('should increment and decrement currentIndex and call scrollToIndex', () => {
    const scrollToIndex = getScrollToIndex();
    const { result } = renderHook(() => useVideoNavigation(3, scrollToIndex));
    act(() => {
      result.current.handleDown();
    });
    expect(result.current.currentIndex).toBe(1);
    expect(scrollToIndex).toHaveBeenCalledWith(1);
    act(() => {
      result.current.handleUp();
    });
    expect(result.current.currentIndex).toBe(0);
    expect(scrollToIndex).toHaveBeenCalledWith(0);
  });

  it('should not decrement below 0 or increment above videosLength - 1', () => {
    const scrollToIndex = getScrollToIndex();
    const { result } = renderHook(() => useVideoNavigation(2, scrollToIndex));
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

  it('should allow setting currentIndex directly to any valid index', () => {
    const scrollToIndex = getScrollToIndex();
    const { result } = renderHook(() => useVideoNavigation(5, scrollToIndex));

    act(() => {
      result.current.setCurrentIndex(3);
    });
    expect(result.current.currentIndex).toBe(3);

    act(() => {
      result.current.setCurrentIndex(0);
    });
    expect(result.current.currentIndex).toBe(0);
  });

  it('should reset currentIndex to zero when search is applied', () => {
    const scrollToIndex = getScrollToIndex();
    const { result } = renderHook(() => useVideoNavigation(5, scrollToIndex));

    act(() => {
      result.current.handleDown();
    });
    expect(result.current.currentIndex).toBe(1);
    expect(scrollToIndex).toHaveBeenCalledWith(1);
    
    act(() => {
      result.current.handleDown();
    });
    expect(result.current.currentIndex).toBe(2);
    expect(scrollToIndex).toHaveBeenCalledWith(2);

    scrollToIndex.mockClear();

    act(() => {
      result.current.setCurrentIndex(0);
    });
    expect(result.current.currentIndex).toBe(0);
  });
});
