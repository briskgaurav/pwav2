import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCardRequestState, clearCardRequestState, selectCardRequestResponse } from '@/store/redux/slices/cardRequestSlice';
import type { CardRequestStateResponse, ErrorResponse } from '@/types/cardIssuance';

/**
 * Central hook for the backend-driven card journey.
 *
 * `call(fn)` wraps any API call that returns a `CardRequestStateResponse`,
 * dispatches the result into Redux, and re-throws typed `ErrorResponse`
 * on failure so callers can handle it locally (toast, inline error, etc.).
 *
 * Since `fetchWithAuth` already parses JSON and throws `ApiError` on non-2xx,
 * `fn` should return the parsed body directly — not a raw `Response`.
 */
export function useCardJourney() {
  const dispatch = useDispatch();
  const state = useSelector(selectCardRequestResponse);

  const call = useCallback(
    async (fn: () => Promise<CardRequestStateResponse>) => {
      const data = await fn();
      dispatch(setCardRequestState(data));
      return data;
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch(clearCardRequestState());
  }, [dispatch]);

  return { state, call, reset };
}
