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
    try {
      const data = await getDiseases();
      setDiseases(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load diseases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getDiseases()
      .then((data) => {
        if (active) {
          setDiseases(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load diseases");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { diseases, loading, error, refetch: fetchDiseases };
}
