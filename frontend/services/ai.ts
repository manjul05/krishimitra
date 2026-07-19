/**
 * KrishiMitra AI Advisor API service — communicates with the FastAPI /api/ai/advisor endpoint.
 * Base URL: http://localhost:8000
 */

import type { AdvisorRequest, AdvisorResponse } from "@/types/ai";
import { ApiError } from "./api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getHeaders(contentType: string | null = "application/json"): HeadersInit {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let message = `Request failed with status ${response.status}`;
  try {
    const body = await response.json();
    if (body?.message) message = body.message;
    else if (body?.detail) message = body.detail;
  } catch {
    // response body is not JSON
  }
  throw new ApiError(message, response.status);
}

/**
 * Request AI advisory recommendations for a given crop disease.
 * POST /api/ai/advisor
 */
export async function generateAdvice(
  payload: AdvisorRequest,
): Promise<AdvisorResponse> {
  const res = await fetch(`${API_BASE_URL}/api/ai/advisor`, {
    method: "POST",
    headers: getHeaders("application/json"),
    body: JSON.stringify(payload),
  });
  return handleResponse<AdvisorResponse>(res);
}
