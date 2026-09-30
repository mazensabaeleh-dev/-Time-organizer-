import { Subject, DailyScheduleEntry, StudyTip } from "../types";
import { generateLocalSchedule, generateLocalTips } from "../utils/localPlanner";

export const generateSmartSchedule = async (
  availableHours: number,
  subjects: Subject[],
  otherTasks: string[]
): Promise<DailyScheduleEntry[]> => {
  try {
    const response = await fetch("/api/schedule/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        availableHours,
        subjects,
        otherTasks,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // If backend endpoint is unavailable (e.g. static GitHub Pages hosting)
    // fallback gracefully to smart client-side algorithm
  }

  return generateLocalSchedule(availableHours, subjects);
};

export const fetchStudyTips = async (subjects: Subject[]): Promise<StudyTip[]> => {
  try {
    const response = await fetch("/api/tips/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subjects,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Static hosting fallback
  }

  return generateLocalTips(subjects);
};
