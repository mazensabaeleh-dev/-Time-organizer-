import { Subject, DailyScheduleEntry, StudyTip } from "../types";

export const generateSmartSchedule = async (
  availableHours: number,
  subjects: Subject[],
  otherTasks: string[]
): Promise<DailyScheduleEntry[]> => {
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "فشل الاتصال بالخادم لإنشاء الجدول");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const fetchStudyTips = async (subjects: Subject[]): Promise<StudyTip[]> => {
  const response = await fetch("/api/tips/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subjects,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "فشل توليد النصائح الدراسية");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};
