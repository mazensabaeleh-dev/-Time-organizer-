import { DailyScheduleEntry } from '../types';

/**
 * Parses time formats such as "04:00 م - 04:45 م" or "09:00 ص - 10:30 ص" or "14:00 - 15:00"
 * and returns start/end dates for today.
 */
function parseScheduleTime(timeStr: string, baseDate = new Date()): { start: Date; end: Date } {
  const defaultDuration = 45; // minutes
  const now = new Date(baseDate);
  const start = new Date(now);
  const end = new Date(now);

  const clean = timeStr.trim();
  const parts = clean.split('-').map(p => p.trim());

  const parseSingleTime = (str: string, fallbackHours = 9, fallbackMins = 0): { hours: number; minutes: number } => {
    const isPM = /م|pm/i.test(str);
    const isAM = /ص|am/i.test(str);
    const numMatch = str.match(/(\d{1,2}):(\d{2})/);

    if (numMatch) {
      let h = parseInt(numMatch[1], 10);
      const m = parseInt(numMatch[2], 10);
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      return { hours: h, minutes: m };
    }
    return { hours: fallbackHours, minutes: fallbackMins };
  };

  if (parts.length >= 2) {
    const s = parseSingleTime(parts[0], 9, 0);
    const e = parseSingleTime(parts[1], 9, defaultDuration);
    start.setHours(s.hours, s.minutes, 0, 0);
    end.setHours(e.hours, e.minutes, 0, 0);
    if (end <= start) {
      end.setTime(start.getTime() + defaultDuration * 60 * 1000);
    }
  } else if (parts.length === 1) {
    const s = parseSingleTime(parts[0], 9, 0);
    start.setHours(s.hours, s.minutes, 0, 0);
    end.setTime(start.getTime() + defaultDuration * 60 * 1000);
  }

  return { start, end };
}

function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates an iCalendar (.ics) string compatible with Apple Calendar, Outlook,
 * Google Calendar import, Samsung Calendar, and all mobile/desktop calendar clients.
 */
export function generateICS(schedule: DailyScheduleEntry[]): string {
  const now = new Date();
  const timestamp = formatDateToICS(now);

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smart Planner//Study Schedule//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:جدول المذاكرة الذكي',
    'X-WR-TIMEZONE:UTC',
  ];

  schedule.forEach((entry, idx) => {
    const { start, end } = parseScheduleTime(entry.time, now);
    const title = entry.subjectName ? `[مذاكرة] ${entry.subjectName}: ${entry.activity}` : entry.activity;
    const description = `النشاط: ${entry.activity}\\nالمدة: ${entry.duration} دقيقة${entry.subjectName ? '\\nالمادة: ' + entry.subjectName : ''}`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:smart-planner-${now.getTime()}-${idx}@planner.app`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${formatDateToICS(start)}`,
      `DTEND:${formatDateToICS(end)}`,
      `SUMMARY:${title.replace(/[\r\n]+/g, ' ')}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      `DESCRIPTION:تذكير: بعد 10 دقائق يبدأ ${entry.activity}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

/**
 * Downloads the .ics calendar file to the user's device
 */
export function downloadCalendarFile(schedule: DailyScheduleEntry[], filename = 'جدول_المذاكرة.ics'): void {
  const icsData = generateICS(schedule);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
