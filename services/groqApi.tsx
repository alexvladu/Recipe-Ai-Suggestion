import axios from 'axios';

const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'; // URL-ul API-ului Groq

export const fetchGroqResponse = async (query:string) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'llama-3.3-70b-versatile', // Specifică modelul AI
        messages: [{ role: 'user', content: query }],
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    return 'Nu am putut obține un răspuns.';
  }
};
