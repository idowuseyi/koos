import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const campaignModel = openai("gpt-4o");
export const chatModel = openai("gpt-4o");
