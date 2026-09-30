import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to call Gemini with model fallback if a model experiences high demand
async function generateJsonWithFallback<T>(params: {
  contents: string;
  responseSchema: any;
}): Promise<T> {
  const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: params.responseSchema,
        },
      });

      const text = response.text?.trim() || '[]';
      return JSON.parse(text) as T;
    } catch (err: any) {
      console.warn(`Model ${model} failed, checking next model. Reason:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('تعذر الحصول على استجابة من نماذج الذكاء الاصطناعي.');
}

// Endpoint: Generate Smart Study Schedule
app.post('/api/schedule/generate', async (req: Request, res: Response) => {
  try {
    const { availableHours = 4, subjects = [], otherTasks = [] } = req.body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'يرجى تحديد مادة دراسية واحدة على الأقل.' });
    }

    const prompt = `أنت خبير في التخطيط التربوي وتنظيم الوقت الدراسي للطلاب.
قم بإنشاء جدول دراسي يومي منظم ومتوازن بناءً على المعطيات التالية:
- الساعات المتاحة للدراسة اليوم: ${availableHours} ساعة.
- المواد الدراسية المدخلة: ${JSON.stringify(subjects)}.
- المهام الإضافية: ${Array.isArray(otherTasks) ? JSON.stringify(otherTasks) : 'لا يوجد'}.

القواعد الأكاديمية:
1. ابدأ بالمواد ذات الأولوية العالية وتلك التي تتطلب تركيزاً ذهنياً عالياً في بداية الجدول.
2. أضف فترات راحة قصيرة (5-15 دقيقة) بين جلسات المذاكرة (أسلوب بومودورو)، وفترات راحة أطول (20-30 دقيقة) بعد كل 2-3 جلسات.
3. وزع الوقت بدقة ليتناسب مجموع أوقات الدراسة والراحة مع الساعات المتاحة (${availableHours * 60} دقيقة تقريباً).
4. استخدم صياغة أوقات واضحة بنظام 12 ساعة (مثال: "04:00 م - 04:45 م").
5. نوع النشاط يجب أن يكون بدقة أحد القيم: "study" أو "break" أو "other".
6. أخرج النتيجة بصيغة JSON متوافقة مع المخطط المحدد.`;

    const schedule = await generateJsonWithFallback({
      contents: prompt,
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: 'الفترة الزمنية (مثال: 04:00 م - 04:45 م)' },
            activity: { type: Type.STRING, description: 'اسم النشاط أو موضوع الجلسة' },
            duration: { type: Type.NUMBER, description: 'المدة بالدقائق' },
            type: { type: Type.STRING, description: 'نوع النشاط: study أو break أو other' },
            subjectName: { type: Type.STRING, description: 'اسم المادة إذا كان النشاط دراسياً' },
          },
          required: ['time', 'activity', 'duration', 'type'],
        },
      },
    });

    return res.json(schedule);
  } catch (error: any) {
    console.error('Error generating schedule:', error);
    return res.status(500).json({
      error: error?.message || 'تعذر إنشاء الجدول الدراسي الذكي. يرجى المحاولة مرة أخرى.',
    });
  }
});

// Endpoint: Generate Study Tips
app.post('/api/tips/generate', async (req: Request, res: Response) => {
  try {
    const { subjects = [] } = req.body;

    const subjectsSummary = Array.isArray(subjects) && subjects.length > 0
      ? subjects.map((s: any) => `${s.name} (${s.nature || 'مادة دراسية'})`).join('، ')
      : 'مواد عامة';

    const prompt = `أنت موجه أكاديمي وخبير في علم النفس المعرفي واستراتيجيات التعلم السريع.
قدم 4 نصائح دراسية استراتيجية ومخصصة لطالب يدرس المواد التالية: ${subjectsSummary}.
استند إلى تقنيات معتمدة ومثبتة علمياً (مثل: الاسترجاع النشط Active Recall، التكرار المتباعد Spaced Repetition، تقنية فاينمان، وطريقة بومودورو).
اجعل كل نصيحة ذات قيمة عملية وقابلة للتطبيق فوراً. أخرج النتيجة بصيغة JSON حصراً.`;

    const tips = await generateJsonWithFallback({
      contents: prompt,
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'عنوان النصيحة' },
            content: { type: Type.STRING, description: 'شرح النصيحة والخطوات العملية' },
            category: { type: Type.STRING, description: 'التصنيف (مثال: تقنيات الاستذكار، إدارة الطاقة، التركيز، المراجعة)' },
          },
          required: ['title', 'content', 'category'],
        },
      },
    });

    return res.json(tips);
  } catch (error: any) {
    console.error('Error generating tips:', error);
    return res.status(500).json({
      error: error?.message || 'تعذر توليد النصائح الدراسية. يرجى المحاولة مرة أخرى.',
    });
  }
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
