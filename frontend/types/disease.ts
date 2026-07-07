/** Shared TypeScript interfaces for KrishiMitra API data. */

export interface Disease {
  id: number;
  crop: string;
  disease: string;
  symptoms: string;
  treatment: string;
  severity: string;
  image: string;
  created_at: string;
}

export interface DiseaseCreatePayload {
  crop: string;
  disease: string;
  symptoms: string;
  treatment: string;
  severity: string;
  image?: string;
}

export interface DiseaseUpdatePayload {
  crop?: string;
  disease?: string;
  symptoms?: string;
  treatment?: string;
  severity?: string;
  image?: string;
}

export interface Stats {
  total_diseases: number;
  crop_count: number;
  high_severity_count: number;
}

export interface HealthResponse {
  status: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface PredictionResult {
  crop: string;
  disease: string;
  confidence: number;
}

export interface DiseaseDetails {
  symptoms: string;
  treatment: string;
  severity: string;
  image: string;
}

export interface PredictResponse {
  success: true;
  prediction: PredictionResult;
  details?: DiseaseDetails;
}
