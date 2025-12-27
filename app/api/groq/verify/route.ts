import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, meaning } = body;

    if (!word || !meaning) {
      console.error('Missing word or meaning:', { word, meaning });
      return NextResponse.json(
        { error: 'Word and meaning are required', isCorrect: true },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      // Give benefit of doubt to the player if API key is missing
      return NextResponse.json({ isCorrect: true });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a word meaning verifier. You will receive a word and a meaning provided by a player. 
The meaning can be in English or Bengali (Bangla) language.
Your job is to determine if the meaning is correct or reasonably close to the actual definition of the word.
Be somewhat lenient - accept meanings that capture the core essence of the word, even if not perfectly worded.
The meaning can be provided in any language (English or Bengali), and you should verify it correctly regardless of the language used.
Respond with ONLY "yes" if the meaning is correct/acceptable, or "no" if it is wrong.
Do not include any other text in your response.`
          },
          {
            role: 'user',
            content: `Word: "${word.toUpperCase()}"\nPlayer's meaning (can be in English or Bengali): "${meaning}"\n\nIs this meaning correct? Answer only "yes" or "no".`
          }
        ],
        model: 'openai/gpt-oss-120b',
        temperature: 1,
        max_completion_tokens: 100,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status);
      // On API error, give benefit of doubt to the player
      return NextResponse.json({ isCorrect: true });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected Groq API response structure:', data);
      return NextResponse.json({ isCorrect: true });
    }
    
    const answer = data.choices[0].message.content?.toLowerCase().trim();
    
    if (!answer) {
      console.error('No answer from Groq API');
      return NextResponse.json({ isCorrect: true });
    }
    
    const isCorrect = answer === 'yes';
    console.log('Groq verification result:', { word, meaning, answer, isCorrect });
    
    return NextResponse.json({ isCorrect });
  } catch (error) {
    console.error('Error verifying meaning:', error);
    // On error, give benefit of doubt to the player
    return NextResponse.json({ isCorrect: true });
  }
}

