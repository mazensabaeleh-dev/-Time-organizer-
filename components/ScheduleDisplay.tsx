import React, { useState } from 'react';
import { DailyScheduleEntry } from '../types';
import { downloadCalendarFile } from '../utils/calendarExport';
import { exportScheduleToPDF } from '../utils/pdfExport';

interface Props {
  schedule: DailyScheduleEntry[];
}

const ScheduleDisplay: React.FC<Props> = ({ schedule }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (schedule.length === 0) return null;

  const handleExportCalendar = () => {
    try {
      downloadCalendarFile(schedule, `جدول_المذاكرة_${new Date().toISOString().slice(0, 10)}.ics`);
      setDownloadSuccess('calendar');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export calendar file:', err);
    }
  };

  const handleExportPDF = () => {
    try {
      exportScheduleToPDF(schedule);
    } catch (err) {
      console.error('Failed to export PDF file:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="bg-green-100 text-green-600 p-1.5 rounded-md">📅</span>
          جدولك اليومي المقترح
        </h3>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* PDF Download Button */}
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-sm transition-all shadow-sm border border-rose-200/60"
            title="تحميل أو طباعة الجدول بصيغة PDF"
          >
            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>تنزيل كـ PDF</span>
          </button>

          {/* Calendar .ICS Download Button */}
          <button
            onClick={handleExportCalendar}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-sm transition-all shadow-sm border border-indigo-200/60"
            title="تصدير إلى تقويم الهاتف أو الحاسوب"
          >
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>ملف تقويم (.ics)</span>
          </button>
        </div>
      </div>

      {downloadSuccess === 'calendar' && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>تم تحميل ملف التقويم بنجاح! يمكنك فتحه لإضافته فوراً إلى تقويم هاتفك أو حاسوبك.</span>
          </div>
          <button
            onClick={() => setDownloadSuccess(null)}
            className="text-emerald-600 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-4 p-4 rounded-xl border-r-4 transition-all hover:shadow-md ${
              item.type === 'study' ? 'bg-indigo-50 border-indigo-500' : 
              item.type === 'break' ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'
            }`}
          >
            <div className="text-sm font-bold text-gray-500 min-w-[70px]">
              {item.time}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800">{item.activity}</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/70 text-gray-600">{item.duration} دقيقة</span>
              </div>
              {item.subjectName && (
                <p className="text-sm font-medium text-indigo-600 mt-1">مادة: {item.subjectName}</p>
              )}
            </div>
            {item.type === 'study' && (
              <div className="bg-white p-1 rounded-full shadow-sm">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l7 3a1 1 0 00.788 0l7-3a1 1 0 000-1.848l-7-3zM14 11.595V13.51c.59.344 1 1.01 1 1.74 0 1.105-.895 2-2 2s-2-.895-2-2c0-.73.41-1.396 1-1.74v-1.915l-1.394.597a3 3 0 01-2.366 0L3 9.77V13a1 1 0 001 1h6.11l.129 1.29a1 1 0 00.99.873h1.542a1 1 0 00.99-.873l.129-1.29H16a1 1 0 001-1V9.77l-3 1.825z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>💡 يمكنك حفظ الجدول كـ PDF جاهز للطباعة أو مشاركته مع زملائك أو تعليقه في غرفتك الدراسية.</p>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-1.5 text-rose-600 font-bold hover:text-rose-800 transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          حفظ كـ PDF جاهز للطباعة
        </button>
      </div>
    </div>
  );
};

export default ScheduleDisplay;
