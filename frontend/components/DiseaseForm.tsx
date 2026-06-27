"use client";

import { FormEvent, useState } from "react";
import { Input, showErrorToast, showSuccessToast } from "@/components/ui";
import { createDisease } from "@/services/api";
import type { DiseaseCreatePayload } from "@/types/disease";

type DiseaseFormProps = {
  onSuccess?: () => void;
};

const initialForm: DiseaseCreatePayload = {
  crop: "",
  disease: "",
  symptoms: "",
  treatment: "",
  severity: "Moderate",
  image: "",
};

export default function DiseaseForm({ onSuccess }: DiseaseFormProps) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof DiseaseCreatePayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDisease(form);
      showSuccessToast("Disease Added");
      setForm(initialForm);
      onSuccess?.();
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : "Failed to add disease");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Crop"
          value={form.crop}
          onChange={(e) => handleChange("crop", e.target.value)}
          placeholder="e.g. Tomato"
          required
        />
        <Input
          label="Disease Name"
          value={form.disease}
          onChange={(e) => handleChange("disease", e.target.value)}
          placeholder="e.g. Early Blight"
          required
        />
      </div>
      <Input
        label="Symptoms"
        value={form.symptoms}
        onChange={(e) => handleChange("symptoms", e.target.value)}
        placeholder="Describe symptoms..."
        required
      />
      <Input
        label="Treatment"
        value={form.treatment}
        onChange={(e) => handleChange("treatment", e.target.value)}
        placeholder="Recommended treatment..."
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium km-text-primary">
            Severity
          </label>
          <select
            value={form.severity}
            onChange={(e) => handleChange("severity", e.target.value)}
            className="w-full rounded-xl border border-km-border bg-white/80 px-4 py-2.5 text-sm km-text-primary outline-none focus:ring-2 focus:ring-km-green/30 dark:border-km-green/20 dark:bg-km-green-dark/40"
          >
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </div>
        <Input
          label="Image URL (optional)"
          value={form.image ?? ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-km-green py-3 text-sm font-semibold text-white transition-colors hover:bg-km-green-dark disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting ? "Adding..." : "Add Disease"}
      </button>
    </form>
  );
}
