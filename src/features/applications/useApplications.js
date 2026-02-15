import { useEffect, useMemo, useState } from 'react';
import { applicationsService } from '../../services/applications-service';

/**
 * Lightweight data hook (no react-query) to keep template simple.
 */
export function useApplications(params) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const stableParams = useMemo(() => params ?? {}, [JSON.stringify(params ?? {})]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError('');
    applicationsService
      .list(stableParams)
      .then((res) => mounted && setData(res))
      .catch((e) => mounted && setError(e?.message ?? 'Failed to load applications'))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [stableParams]);

  return { data, isLoading, error, refresh: () => applicationsService.list(stableParams).then(setData) };
}
