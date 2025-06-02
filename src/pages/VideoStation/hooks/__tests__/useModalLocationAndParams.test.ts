import { renderHook, act } from '@testing-library/react';
import { useModalLocationAndParams } from '../useModalLocationAndParams';
import { describe, it, expect } from 'vitest';

describe('useModalLocationAndParams', () => {
  const initialLocation = { lat: 10, lon: 20 };
  const initialSearchParams = {
    locationRadius: 1000,
    order: 'date',
    maxResults: 5,
  };

  it('should initialize modalLocation and modalParams from props', () => {
    const { result } = renderHook(() =>
      useModalLocationAndParams(initialLocation, initialSearchParams, false)
    );
    expect(result.current.modalLocation).toEqual(initialLocation);
    expect(result.current.modalParams).toEqual({
      radius: 1000,
      orderBy: 'date',
      maxResults: 5,
    });
  });

  it('should update modalLocation and modalParams when modalOpened becomes true', () => {
    let modalOpened = false;
    let location = initialLocation;
    let searchParams = initialSearchParams;
    const { result, rerender } = renderHook(() =>
      useModalLocationAndParams(location, searchParams, modalOpened)
    );

    // Change values and open modal
    modalOpened = true;
    location = { lat: 30, lon: 40 };
    searchParams = { locationRadius: 2000, order: 'rating', maxResults: 10 };
    rerender();

    expect(result.current.modalLocation).toEqual({ lat: 30, lon: 40 });
    expect(result.current.modalParams).toEqual({
      radius: 2000,
      orderBy: 'rating',
      maxResults: 10,
    });
  });

  it('should allow manual updates to modalLocation and modalParams', () => {
    const { result } = renderHook(() =>
      useModalLocationAndParams(initialLocation, initialSearchParams, false)
    );

    act(() => {
      result.current.setModalLocation({ lat: 99, lon: 88 });
      result.current.setModalParams({ radius: 123, orderBy: 'views', maxResults: 2 });
    });

    expect(result.current.modalLocation).toEqual({ lat: 99, lon: 88 });
    expect(result.current.modalParams).toEqual({
      radius: 123,
      orderBy: 'views',
      maxResults: 2,
    });
  });
});
