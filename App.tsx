import React, { useState } from 'react';
import Header from './components/Header';
import SubjectInput from './components/SubjectInput';
import Analytics from './components/Analytics';
import ScheduleDisplay from './components/ScheduleDisplay';
import Tips from './components/Tips';
import { Subject, AppState, SubjectNature } from './types';
import { generateSmartSchedule, fetchStudyTips } from './services/geminiService';

const SAMPLE_SUBJECTS: Subject[] = [
  { id: 'sample-1', name: 'الرياضيات', priority: 5, nature: SubjectNature.Intense, estimatedHours: 2 },
  { id: 'sample-2', name: 'الفيزياء', priority: 4, nature: SubjectNature.Practical, estimatedHours: 1.5 },
  { id: 'sample-3', name: 'اللغة الإنجليزية', priority: 3, nature: SubjectNature.Review, estimatedHours: 1 },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    availableHours: 4,
    subjects: [],
    otherTasks: [],
    schedule: [],
    tips: [],
    isGenerating: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addSubject = (subject: Subject) => {
    setErrorMessage(null);
    setState(prev => ({
      ...prev,
      subjects: [...prev.subjects, subject],
    }));
  };

  const removeSubject = (id: string) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
    }));
  };

  const loadSampleSubjects = () => {
    setErrorMessage(null);
    setState(prev => ({
      ...prev,
      subjects: SAMPLE_SUBJECTS,
    }));
  };

  const handleGenerate = async () => {
    setErrorMessage(null);

    if (state.subjects.length === 0) {
      setErrorMessage('يرجى إضافة مادة دراسية واحدة على الأقل قبل إنشاء الجدول!');
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      const [newSchedule, newTips] = await Promise.all([
        generateSmartSchedule(state.availableHours, state.subjects, []),
        fetchStudyTips(state.subjects),
      ]);

      setState(prev => ({
        ...prev,
        schedule: newSchedule,
        tips: newTips,
        isGenerating: false,
      }));
    } catch (error: any) {
      console.error('Generation failed:', error);
      const message = error?.message || 'تعذر التواصل مع خدمة الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.';
      setErrorMessage(message);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Tajawal']" dir="rtl">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2">مرحباً بك في رحلة التميز! 🚀</h2>
            <p className="text-indigo-100 max-w-2xl leading-relaxed">
              دعنا نساعدك في تنظيم وقتك اليوم. أدخل المواد التي تنوي دراستها وسيقوم الذكاء الاصطناعي ببناء الخطة الأمثل لك بدقة وتوازن.
            </p>
          </div>
          {state.subjects.length === 0 && (
            <button
              onClick={loadSampleSubjects}
              type="button"
              className="self-start md:self-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/30"
            >
              ⚡ إضافة مواد تجريبية
            </button>
          )}
        </div>

        {/* In-app Error Banner */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-red-800 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold text-sm">{errorMessage}</p>
                <p className="text-xs text-red-600 mt-0.5">
                  تم تحديث اتصال الذكاء الاصطناعي ليعمل مباشرة عبر الخادم السحابي الآمن.
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 font-bold p-1 rounded-lg"
              aria-label="إغلاق التنبيه"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                كم ساعة لديك للدراسة اليوم؟
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={state.availableHours}
                  onChange={(e) => setState(prev => ({ ...prev, availableHours: parseInt(e.target.value) || 1 }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-2xl font-black text-indigo-600 min-w-[3rem] text-center">
                  {state.availableHours}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">اسحب لتحديد عدد الساعات المتاحة للدراسة اليوم.</p>
            </div>

            <SubjectInput
              onAdd={addSubject}
              subjects={state.subjects}
              onRemove={removeSubject}
            />

            <button
              onClick={handleGenerate}
              disabled={state.isGenerating}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3 ${
                state.isGenerating
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {state.isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>جاري التخطيط بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <span>إنشاء الجدول الذكي</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Displays & Analytics */}
          <div className="lg:col-span-8 space-y-6">
            {state.subjects.length > 0 && <Analytics subjects={state.subjects} />}

            {state.schedule.length > 0 ? (
              <ScheduleDisplay schedule={state.schedule} />
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-300 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لا يوجد جدول حالياً</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  أضف موادك الدراسية واضغط على زر "إنشاء الجدول الذكي" لتبدأ يومك بمنظم مدروس من Gemini.
                </p>
              </div>
            )}

            <Tips tips={state.tips} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
