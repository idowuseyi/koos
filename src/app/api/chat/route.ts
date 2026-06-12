import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { chatModel } from '@/lib/ai/provider';
import { buildChatPrompt } from '@/lib/ai/prompts/chat';
import type { ChatBrandContext } from '@/lib/ai/prompts/chat';

export async function POST(req: Request) {
  const { messages, brandContext } = (await req.json()) as {
    messages: UIMessage[];
    brandContext: ChatBrandContext;
  };

  const systemPrompt = buildChatPrompt(brandContext);

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: chatModel,
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
