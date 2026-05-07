import OpenAI from 'openai';
import {
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
  CHATGPT_API_MODEL,
  CHATGPT_PROMPT_PREFIX,
  CHATGPT_TEMPERATURE,
  CHATGPT_TIMEOUT,
} from './env.js';
import { StoredConversation } from './interfaces.js';

export type ChatResult = {
  text: string;
  responseId: string;
};

export function createOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: OPENAI_API_KEY,
    ...(OPENAI_BASE_URL ? { baseURL: OPENAI_BASE_URL } : {}),
    timeout: CHATGPT_TIMEOUT,
  });
}

export async function sendChatMessage(
  client: OpenAI,
  question: string,
  storedConversation: StoredConversation | undefined,
): Promise<ChatResult> {
  const response = await client.responses.create({
    model: CHATGPT_API_MODEL,
    input: question,
    instructions: CHATGPT_PROMPT_PREFIX,
    temperature: CHATGPT_TEMPERATURE,
    ...(storedConversation?.previousResponseId
      ? { previous_response_id: storedConversation.previousResponseId }
      : {}),
  });

  const text = response.output_text ?? '';
  if (!text) throw new Error('OpenAI response contained no text output');
  return { text, responseId: response.id };
}
