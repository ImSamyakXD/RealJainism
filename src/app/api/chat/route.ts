import { NextResponse } from 'next/server';

const RAG_BACKEND_URL = process.env.RAG_BACKEND_URL || 'http://127.0.0.1:8000';

const FAST_TOPICS: Record<string, string> = {
  "पंच महाव्रत": `**पंच महाव्रत (Five Great Vows of Jainism):**

1. **अहिंसा महाव्रत (Ahimsa)** — मन, वचन और काया से किसी भी जीव को लेशमात्र भी कष्ट न देना।
2. **सत्य महाव्रत (Satya)** — सर्वथा क्रोध, लोभ, भय, हास्य रहित होकर निर्दोष सत्य बोलना।
3. **अस्तेय महाव्रत (Asteya)** — बिना दी गई किसी भी वस्तु को ग्रहण न करना (चोरी का त्याग)।
4. **ब्रह्मचर्य महाव्रत (Brahmacharya)** — सर्व प्रकार के मैथुन और विषय-वासना का पूर्ण त्याग करना।
5. **अपरिग्रह महाव्रत (Aparigraha)** — धन, धान्य, वस्त्र, मकान आदि सर्व परिग्रह का त्याग करना।`,

  "अनेकांतवाद": `**अनेकांतवाद (Anekantavada — Theory of Non-Absolutism):**

अनेकांतवाद जैन दर्शन की वह अनुपम देन है जो सिखाती है कि परम सत्य के अनेक पहलू होते हैं।

- **मूल सिद्धांत**: किसी वस्तु या घटना को केवल एक दृष्टिकोण से देखकर अंतिम निर्णय नहीं लेना चाहिए।
- **स्याद्वाद (Syadvada)**: भाषिक अभिव्यक्ति में "स्यात्" (किसी अपेक्षा से) पद का प्रयोग करके सापेक्ष सत्य को प्रकट किया जाता है।
- **सहिष्णुता**: यह सिद्धांत वैचारिक अहिंसा और दूसरों के दृष्टिकोण के प्रति सम्मान और सहिष्णुता का मार्ग प्रशस्त करता है।`,

  "karma theory": `**Jain Karma Theory (कर्म सिद्धांत):**

In Jainism, Karma is not a divine reward/punishment system, but a subtle physical matter (**Karma Varganas**) that attaches to the Soul (**Jiva**) due to passions (**Kashayas** like anger, pride, deceit, greed).

1. **Main Types**:
   - **Ghatiya Karmas** (Harming soul's natural qualities: Knowledge, Perception, Bliss, Energy).
   - **Aghatiya Karmas** (Determining physical body, lifespan, status, feelings).
2. **Shedding Karmas (Nirjara)**: Through austerity (Tapa), meditation, self-control (Samyama), and devotion, the soul sheds all karmic particles to achieve **Moksha** (Liberation).`,

  "तीर्थंकर": `**चौबीस तीर्थंकर (24 Tirthankaras):**

जैन धर्म में धर्म-तीर्थ (संसार-समुद्र को पार कराने वाला धर्म का मार्ग) का प्रवर्त्तन करने वाले सर्वज्ञ, वीतराग पुरुष को **तीर्थंकर** कहते हैं।

- **प्रथम तीर्थंकर**: भगवान **ऋषभदेव (आदिनाथ)**
- **२३वें तीर्थंकर**: भगवान **पार्श्वनाथ स्वामी**
- **२४वें तीर्थंकर**: भगवान **महावीर स्वामी** (वर्तमान शासन नायक)

प्रत्येक तीर्थंकर के ५ कल्याणक (गर्भ, जन्म, दीक्षा, ज्ञान, मोक्ष) मनाए जाते हैं।`,

  "ahimsa": `**Ahimsa in Jain Philosophy (अहिंसा):**

**"Ahimsā Paramo Dharmaḥ"** (Non-violence is the supreme spiritual duty).

- **Definition**: Avoiding injury to any living being (**Jiva**) through **Mind (Manas), Speech (Vachana), or Body (Kaya)** — directly doing it, causing others to do it, or consenting to it (*Krita, Karita, Anumodita*).
- **Compassion for all beings**: Applies to humans, animals, plants, insects, and even micro-organisms (Ekendriya Jivas).
- It is the foundation of Jain ethics, diet, and liberation.`
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    const trimmedMsg = message.trim().toLowerCase();

    // High-speed instant answers for Explore topic buttons & greetings (0.01s instant latency!)
    const isGreeting = /^(jai\s*jinendra|namaste|hello|hi|pranam)/i.test(trimmedMsg);
    if (isGreeting) {
      return NextResponse.json({
        answer: 'Jai Jinendra! 🙏 I am JainGPT, your scriptural AI assistant. I can answer your questions on Jainism, Agams, philosophy, and daily practice grounded in authentic scriptures!',
        source: 'instant',
      });
    }

    for (const [key, ans] of Object.entries(FAST_TOPICS)) {
      if (trimmedMsg.includes(key.toLowerCase()) || key.toLowerCase().includes(trimmedMsg)) {
        return NextResponse.json({
          answer: ans,
          source: 'instant_topic',
        });
      }
    }

    // Try communicating with Python FastAPI RAG service
    try {
      const response = await fetch(`${RAG_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
        signal: AbortSignal.timeout(45000), // 45s timeout for ML vector search & LLM
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          answer: data.answer || 'No response received from Jain AI.',
          source: 'rag_backend',
        });
      }
    } catch (backendError) {
      console.warn('RAG FastAPI service unreachable, checking direct fallback...', backendError);
    }

    // Default polite response if backend is offline
    return NextResponse.json({
      answer: 'Jai Jinendra! The scriptural RAG database server is currently connecting. Please ensure the Python backend (`python -m uvicorn app:app --port 8000`) is running to access full Agam knowledge base searches.',
      source: 'offline_notice',
    });

  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred processing your query.' },
      { status: 500 }
    );
  }
}
