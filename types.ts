
export enum SubjectNature {
  Theoretical = 'نظري',
  Practical = 'عملي',
  Review = 'مراجعة',
  Intense = 'تركيز عالٍ'
}

export interface Subject {
  id: string;
  name: string;
  priority: number; // 1-5
  nature: SubjectNature;
  estimatedHours: number;
}

export interface Task {
  id: string;
  title: string;
  duration: number; // minutes
  isCompleted: boolean;
}

export interface DailyScheduleEntry {
  time: string;
  activity: string;
  duration: number;
  type: 'study' | 'break' | 'other';
  subjectName?: string;
}

export interface StudyTip {
  title: string;
  content: string;
  category: string;
}

export interface AppState {
  availableHours: number;
  subjects: Subject[];
  otherTasks: Task[];
  schedule: DailyScheduleEntry[];
  tips: StudyTip[];
  isGenerating: boolean;
}
