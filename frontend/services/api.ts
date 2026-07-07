/**
 * KrishiMitra API service — all backend communication goes through this module.
 * Base URL: http://localhost:8000
 */

import type {
  Disease,
  DiseaseCreatePayload,
  DiseaseUpdatePayload,
  HealthResponse,
  PredictResponse,
  Stats,
} from "@/types/disease";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    return response.json() as Promise<T>;
  }

  let message = `Request failed with status ${response.status}`;
  try {
    const body = await response.json();
    if (body?.message) message = body.message;
  } catch {
    // response body is not JSON
  }
  throw new ApiError(message, response.status);
}

/** GET /api/health */
export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return handleResponse<HealthResponse>(res);
}

/** GET /api/diseases */
export async function getDiseases(): Promise<Disease[]> {
  const res = await fetch(`${API_BASE_URL}/api/diseases`, {
    cache: "no-store",
  });
  return handleResponse<Disease[]>(res);
}

/** GET /api/diseases/{id} */
export async function getDisease(id: number): Promise<Disease> {
  const res = await fetch(`${API_BASE_URL}/api/diseases/${id}`, {
    cache: "no-store",
  });
  return handleResponse<Disease>(res);
}

/** POST /api/diseases */
export async function createDisease(
  payload: DiseaseCreatePayload,
): Promise<Disease> {
  const res = await fetch(`${API_BASE_URL}/api/diseases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Disease>(res);
}

/** PUT /api/diseases/{id} */
export async function updateDisease(
  id: number,
  payload: DiseaseUpdatePayload,
): Promise<Disease> {
  const res = await fetch(`${API_BASE_URL}/api/diseases/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Disease>(res);
}

/** DELETE /api/diseases/{id} */
export async function deleteDisease(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/diseases/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(res);
}

/** GET /api/search?crop=... */
export async function searchDisease(crop: string): Promise<Disease[]> {
  const params = new URLSearchParams({ crop });
  const res = await fetch(`${API_BASE_URL}/api/search?${params}`, {
    cache: "no-store",
  });
  return handleResponse<Disease[]>(res);
}

/** GET /api/stats */
export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE_URL}/api/stats`, {
    cache: "no-store",
  });
  return handleResponse<Stats>(res);
}

/** POST /api/predict — AI image disease detection */
export async function predictDisease(image: File): Promise<PredictResponse> {
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<PredictResponse>(res);
}

export { ApiError };
