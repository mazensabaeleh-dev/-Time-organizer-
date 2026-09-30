import { DailyScheduleEntry } from '../types';

/**
 * Exports the daily schedule into a clean, printable PDF document
 * with full Arabic RTL support and beautiful styling.
 */
export function exportScheduleToPDF(schedule: DailyScheduleEntry[]): void {
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalStudyMinutes = schedule
    .filter(s => s.type === 'study')
    .reduce((acc, curr) => acc + curr.duration, 0);

  const totalBreakMinutes = schedule
    .filter(s => s.type === 'break')
    .reduce((acc, curr) => acc + curr.duration, 0);

  const scheduleRows = schedule
    .map(
      (item, idx) => `
      <tr class="${item.type === 'study' ? 'row-study' : item.type === 'break' ? 'row-break' : 'row-other'}">
        <td class="col-num">${idx + 1}</td>
        <td class="col-time"><strong>${item.time}</strong></td>
        <td class="col-activity">
          <div class="activity-title">${item.activity}</div>
          ${item.subjectName ? `<div class="activity-sub">المادة الدراسية: ${item.subjectName}</div>` : ''}
        </td>
        <td class="col-type">
          <span class="badge ${item.type}">
            ${item.type === 'study' ? 'جلسة مذاكرة' : item.type === 'break' ? 'استراحة' : 'نشاط آخر'}
          </span>
        </td>
        <td class="col-duration">${item.duration} دقيقة</td>
      </tr>
    `
    )
    .join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لتحميل وطباعة ملف الـ PDF');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>جدول المذاكرة اليومي - مُخططي الذكي</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          color: #1e293b;
          background: #ffffff;
          padding: 24px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #4f46e5;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .header-title h1 {
          font-size: 24px;
          font-weight: 900;
          color: #4338ca;
        }
        .header-title p {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }
        .header-date {
          text-align: left;
          font-size: 12px;
          color: #475569;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          text-align: center;
        }
        .stat-card.primary {
          background: #eef2ff;
          border-color: #c7d2fe;
        }
        .stat-value {
          font-size: 18px;
          font-weight: 900;
          color: #1e293b;
        }
        .stat-card.primary .stat-value {
          color: #4338ca;
        }
        .stat-label {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 13px;
        }
        th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          text-align: right;
          padding: 10px 12px;
          border-bottom: 2px solid #cbd5e1;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .row-study {
          background: #faf5ff;
        }
        .row-break {
          background: #f0fdf4;
        }
        .col-num {
          width: 35px;
          text-align: center;
          color: #94a3b8;
          font-weight: bold;
        }
        .col-time {
          width: 130px;
          color: #334155;
        }
        .activity-title {
          font-weight: 700;
          color: #0f172a;
        }
        .activity-sub {
          font-size: 11px;
          color: #6366f1;
          margin-top: 2px;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge.study {
          background: #e0e7ff;
          color: #4338ca;
        }
        .badge.break {
          background: #dcfce7;
          color: #15803d;
        }
        .badge.other {
          background: #f1f5f9;
          color: #475569;
        }
        .col-duration {
          width: 90px;
          text-align: left;
          font-weight: 700;
          color: #475569;
        }
        .footer {
          margin-top: 30px;
          padding-top: 14px;
          border-top: 1px dashed #cbd5e1;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-title">
          <h1>📅 جدول المذاكرة اليومي</h1>
          <p>تم إنشاؤه وتنسيقه بواسطة مُخططي الذكي (Smart Planner)</p>
        </div>
        <div class="header-date">
          <div><strong>التاريخ:</strong> ${currentDate}</div>
          <div style="margin-top:4px;"><strong>إجمالي الجلسات:</strong> ${schedule.length} فترات</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-value">${Math.round((totalStudyMinutes / 60) * 10) / 10} ساعة</div>
          <div class="stat-label">إجمالي وقت المذاكرة (${totalStudyMinutes} دقيقة)</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalBreakMinutes} دقيقة</div>
          <div class="stat-label">فترات الراحة والتجديد</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${schedule.filter(s => s.type === 'study').length} جلسات</div>
          <div class="stat-label">جلسات تركيز بومودورو</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th class="col-time">الوقت</th>
            <th>النشاط والمحتوى</th>
            <th style="width: 100px;">النوع</th>
            <th class="col-duration">المدة</th>
          </tr>
        </thead>
        <tbody>
          ${scheduleRows}
        </tbody>
      </table>

      <div class="footer">
        <div>نصيحة اليوم: التزم بالجدول وخذ فترات الراحة بانتظام للحفاظ على أعلى مستويات التركيز والإنتاجية.</div>
        <div>مُخططي الذكي © 2026</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
