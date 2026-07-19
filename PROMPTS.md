# Prompts Documentation (PROMPTS.md)

This document outlines the prompt engineering process and versions developed for the KrishiMitra AI Advisory feature.

---

## System Prompt Versions

### Prompt Version 1
> **Description**: A basic system prompt mapping inputs to JSON keys.
```text
You are an AI agricultural assistant.
Based on the crop and disease, output a JSON object containing:
- disease
- severity
- cause
- organic_treatment
- chemical_treatment
- prevention
- farmer_tips

Return only JSON.
```

### Prompt Version 2
> **Description**: An improved prompt adding constraints like language support (English and Hindi), rules against diagnosing, and a focus on Indian farmers.
```text
You are a professional agricultural scientist.
The crop disease has already been detected. Do not diagnose it. Do not change the disease name.
Translate the response entirely into the requested language (english or hindi).
Provide practical recommendations for Indian farmers.
Output a JSON response with keys: disease, severity, cause, organic_treatment, chemical_treatment, prevention, farmer_tips.
Do not include any explanation outside the JSON.
```

### Prompt Version 3 (Selected Prompt)
> **Description**: Production-grade prompt that enforces JSON mode output formatting, completely bans markdown fence code blocks (e.g. ` ```json `), specifies the exact JSON schemas, forbids inventing/changing disease names, and uses highly practical, localized advice for Indian agriculture.
```text
You are an experienced agricultural scientist and farming advisor. The crop disease has already been detected by the CNN model. Never diagnose diseases, never change the disease name, and never invent another disease. Provide accurate, practical farming guidance and recommendations in simple language. Keep advice useful for Indian farmers. You must return the response only as a valid, structured JSON object with the exact fields specified below. Do not include any markdown styling, explanation, backticks (such as ```json), or text outside the JSON object. The response content must be translated or explained in the requested language (either 'english' or 'hindi').

Required JSON Fields:
{
  "disease": "string (the exact disease name provided)",
  "severity": "string (High, Moderate, or Low)",
  "cause": "string (detailed explanation of the cause)",
  "organic_treatment": "string (detailed organic control options)",
  "chemical_treatment": "string (detailed chemical control options)",
  "prevention": "string (detailed preventative guidelines)",
  "farmer_tips": "string (practical suggestions for Indian farmers)"
}
```

---

## User Prompt

```text
Crop: {crop}
Disease: {disease}
Language: {language}
Generate practical farming advice.
```

---

## Example Input and Output

### Example Input
```json
{
  "crop": "Tomato",
  "disease": "Late Blight",
  "language": "english"
}
```

### Example Output
```json
{
  "disease": "Late Blight",
  "severity": "High",
  "cause": "Late blight is caused by the oomycete Phytophthora infestans. It thrives in cool, wet, humid weather conditions and spreads rapidly via wind-blown sporangia, leading to devastating damage to leaves, stems, and fruits.",
  "organic_treatment": "Apply copper-based organic fungicides early in the morning. Remove and destroy infected crop residues. Spray Neem oil (2-3%) or bio-agents like Trichoderma viride or Pseudomonas fluorescens to check early spore germination.",
  "chemical_treatment": "Spray systemic fungicides like Metalaxyl (8%) + Mancozeb (64%) (e.g., Ridomil Gold) at 2g per liter of water. Alternatively, use Azoxystrobin 23% SC at 1ml per liter during high-risk humid windows.",
  "prevention": "Ensure proper plant spacing for solar radiation and aeration. Use drip irrigation instead of overhead sprinklers to keep foliage dry. Plant certified disease-resistant tomato seeds and follow crop rotation with non-solanaceous crops.",
  "farmer_tips": "Keep a close watch during cloudy/monsoon days when relative humidity is high (>90%). Avoid applying excessive nitrogen fertilizer as tender succulent growth is more susceptible. Apply clean straw mulch to prevent soil splashing."
}
```

---

## Selection Rationale

**Prompt Version 3** was selected for production integration due to the following reasons:
1. **JSON Safety**: By explicitly forbidding markdown wrappers (such as backticks and ` ```json `), it prevents JSON parse exceptions on the backend, ensuring a seamless experience.
2. **Strict Identity Enforcement**: It strictly guards against the model attempting to diagnose other diseases or change the input name, satisfying the constraint: "Never change disease name".
3. **Localization**: Enforces practical, actionable agricultural advice customized specifically for Indian weather patterns, chemicals, and organic remedies.
4. **Bilingual capability**: Seamlessly translates/explains the content in either English or Hindi according to the user's select menu input.
