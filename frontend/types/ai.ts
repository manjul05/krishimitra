/** TypeScript interfaces for KrishiMitra AI Advisor features. */

export interface AdvisorRequest {
  crop: string;
  disease: string;
  language: "english" | "hindi";
}

export interface AdvisorData {
  disease: string;
  severity: string;
  cause: string;
  organic_treatment: string;
  chemical_treatment: string;
  prevention: string;
  farmer_tips: string;
}

export interface AdvisorResponse {
  success: boolean;
  data: AdvisorData;
}
