// Groq API utility for Challenge Mode meaning verification
// Uses Next.js API route to keep API key secure on server-side

export async function verifyMeaning(word: string, meaning: string): Promise<boolean> {
  try {
    const response = await fetch('/api/groq/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word,
        meaning,
      }),
    });

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Could not read error response';
      }
      console.error('API route error:', response.status, errorText);
      // On API error, give benefit of doubt to the player
      return true;
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      return true;
    }
    
    // Handle both response formats for safety
    if (typeof data.isCorrect === 'boolean') {
      return data.isCorrect;
    }
    
    // Fallback if response format is unexpected
    console.warn('Unexpected API response format:', data);
    return true;
  } catch (error) {
    console.error('Error verifying meaning:', error);
    // On error, give benefit of doubt to the player
    return true;
  }
}
