"use client";

import { useCallback, useEffect, useState } from "react";
import type { Disease } from "@/types/disease";
import { getDiseases } from "@/services/api";

export function useDiseases() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiseases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDiseases();
      setDiseases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load diseases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  return { diseases, loading, error, refetch: fetchDiseases };
}
