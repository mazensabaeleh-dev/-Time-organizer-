import React, { useState } from 'react';

const Header: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'مُخططي الذكي - Smart Planner',
          text: 'تطبيق ذكي لتنظيم الوقت وجداول المذاكرة اليومية بالذكاء الاصطناعي 🚀',
          url,
        });
        return;
      } catch (e) {
        // User cancelled or share API fell back
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-sm text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">مُخططي الذكي</h1>
            <p className="text-[11px] text-gray-400 hidden sm:block">منظّم المذاكرة اليومي الذكي للطلاب</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold transition-all shadow-sm"
            title="مشاركة رابط التطبيق للعامة"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-700">تم نسخ الرابط!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>مشاركة الرابط 🔗</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
