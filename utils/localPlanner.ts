import { Subject, DailyScheduleEntry, StudyTip } from '../types';

/**
 * Intelligent client-side schedule generator fallback.
 * Uses pedagogical rules (Pomodoro, high cognitive priority first, balanced breaks).
 */
export function generateLocalSchedule(
  availableHours: number,
  subjects: Subject[]
): DailyScheduleEntry[] {
  if (!subjects || subjects.length === 0) return [];

  // Sort by priority desc (5 down to 1)
  const sortedSubjects = [...subjects].sort((a, b) => b.priority - a.priority);

  const totalMinutes = availableHours * 60;
  const schedule: DailyScheduleEntry[] = [];

  let currentTimeMinutes = 16 * 60; // Start at 04:00 PM (16:00) by default
  let elapsedMinutes = 0;
  let sessionIndex = 0;

  const formatTimeSlot = (startMin: number, durationMin: number): string => {
    const endMin = startMin + durationMin;

    const to12h = (totalMins: number) => {
      let h = Math.floor(totalMins / 60) % 24;
      const m = totalMins % 60;
      const period = h >= 12 ? 'م' : 'ص';
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(h)}:${pad(m)} ${period}`;
    };

    return `${to12h(startMin)} - ${to12h(endMin)}`;
  };

  while (elapsedMinutes < totalMinutes && sortedSubjects.length > 0) {
    const remainingTime = totalMinutes - elapsedMinutes;
    if (remainingTime < 20) break;

    const currentSubject = sortedSubjects[sessionIndex % sortedSubjects.length];

    // Determine study session length (30-50 mins)
    const studyDuration = Math.min(45, remainingTime);

    schedule.push({
      time: formatTimeSlot(currentTimeMinutes, studyDuration),
      activity: `مذاكرة وتطبيق عملي: ${currentSubject.name}`,
      duration: studyDuration,
      type: 'study',
      subjectName: currentSubject.name,
    });

    currentTimeMinutes += studyDuration;
    elapsedMinutes += studyDuration;
    sessionIndex++;

    // Check if there is room for a break
    const remainingAfterStudy = totalMinutes - elapsedMinutes;
    if (remainingAfterStudy >= 15) {
      const isLongBreak = sessionIndex % 3 === 0;
      const breakDuration = isLongBreak ? Math.min(20, remainingAfterStudy - 15) : Math.min(10, remainingAfterStudy - 15);

      if (breakDuration >= 5) {
        schedule.push({
          time: formatTimeSlot(currentTimeMinutes, breakDuration),
          activity: isLongBreak ? 'استراحة طويلة وتناول وجبة خفيفة' : 'استراحة قصيرة وشرب الماء وتمدد',
          duration: breakDuration,
          type: 'break',
        });
        currentTimeMinutes += breakDuration;
        elapsedMinutes += breakDuration;
      }
    }
  }

  return schedule;
}

/**
 * Client-side tips generator based on learning science.
 */
export function generateLocalTips(subjects: Subject[]): StudyTip[] {
  const subjectNames = subjects.map(s => s.name).join('، ');

  return [
    {
      title: 'الاسترجاع النشط (Active Recall)',
      content: `بعد مذاكرة أي جزء من موادك (${subjectNames || 'المواد المقررة'})، أغلق الملخص وحاول تذكر النقاط الأساسية وكتابتها أو شرحها بصوت مسموع بدون النظر في الكتاب.`,
      category: 'تقنيات الاستذكار',
    },
    {
      title: 'التكرار المتباعد (Spaced Repetition)',
      content: 'راجع الأفكار الرئيسية بعد 24 ساعة، ثم بعد 3 أيام، ثم بعد أسبوع لترسيخ المعلومات في الذاكرة طويلة المدى ومنع منحنى النسيان.',
      category: 'المراجعة الذكية',
    },
    {
      title: 'إدارة الطاقة الذهنية والتركيز',
      content: 'ابدأ دراستك بالمادة الأكثر صعوبة عندما تكون طاقتك في أعلى مستوياتها، وضع هاتفك في غرفة أخرى أثناء جلسات الـ 45 دقيقة.',
      category: 'إدارة الطاقة',
    },
    {
      title: 'تقنية بومودورو الفعالة',
      content: 'حافظ على تقسيم الوقت لـ 45 دقيقة دراسة متبوعة بـ 10 دقائق راحة، هذا يمنع إرهاق الدماغ ويبقيك متحفزاً طوال اليوم.',
      category: 'إدارة الوقت',
    },
  ];
}
