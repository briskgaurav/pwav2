import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCardLinkState, clearCardLinkState, selectCardLinkResponse } from '@/store/redux/slices/cardLinkSlice';
import type { CardLinkStateResponse } from '@/types/cardLinking';

/**
 * Central hook for the backend-driven card-link journey.
 *
 * Mirrors `useCardJourney` but targets the `cardLink` slice.
 * `call(fn)` wraps any API call that returns a `CardLinkStateResponse`,
 * dispatches the result into Redux, and re-throws typed errors
 * on failure so callers can handle it locally.
 */
export function useCardLinkJourney() {
  const dispatch = useDispatch();
  const state = useSelector(selectCardLinkResponse);

  const call = useCallback(
    async (fn: () => Promise<CardLinkStateResponse>) => {
      const data = await fn();
      dispatch(setCardLinkState(data));
      return data;
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch(clearCardLinkState());
  }, [dispatch]);

  return { state, call, reset };
}
