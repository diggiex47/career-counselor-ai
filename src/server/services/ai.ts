// src/server/services/ai.ts
import { env } from "~/env";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  metadata: {
    model: string;
    tokens?: number;
    processingTime: number;
  };
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  previousMessages: AIMessage[];
}

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export class AIService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  private readonly model = "gemini-2.0-flash-exp";

  constructor() {
    this.apiKey = env.GEMINI_API_KEY ?? "";
  }

  async generateResponse(
    messages: AIMessage[],
    _context?: ConversationContext,
  ): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      // Create system instruction for career counseling
      const systemInstruction = `You are an expert AI career counselor with years of experience helping people navigate their professional journeys. Your role is to:

1. Provide personalized career guidance and advice
2. Help users identify their strengths, interests, and career goals
3. Suggest career paths, skill development, and growth opportunities
4. Offer practical advice on job searching, interviews, and workplace challenges
5. Be supportive, encouraging, and professional in all interactions

Guidelines:
- Ask thoughtful questions to understand the user's situation
- Provide specific, actionable advice
- Be empathetic and understanding
- Keep responses focused on career-related topics
- If asked about non-career topics, politely redirect to career counseling

Remember: You're here to help users achieve their professional goals and build fulfilling careers.`;

      // Convert messages to Gemini format (exclude system messages)
      const geminiMessages: GeminiMessage[] = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

      const requestBody = {
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1000,
        },
      };

      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json() as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
        usageMetadata?: {
          totalTokenCount?: number;
        };
      };
      const processingTime = Date.now() - startTime;

      if (
        !data.candidates?.[0]?.content?.parts?.[0]?.text
      ) {
        throw new Error("Invalid response format from Gemini API");
      }

      const aiResponse = data.candidates[0].content.parts[0].text;

      // Validate response content
      if (!this.validateResponse(aiResponse)) {
        throw new Error("AI response failed validation");
      }

      return {
        content: aiResponse,
        metadata: {
          model: this.model,
          tokens: data.usageMetadata?.totalTokenCount,
          processingTime,
        },
      };
    } catch (error) {
      console.error("AI Service Error:", error);

      // Return a fallback response
      return {
        content:
          "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or feel free to rephrase your question. I'm here to help with your career counseling needs.",
        metadata: {
          model: this.model,
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  async generateSessionName(firstMessage: string): Promise<string> {
    try {
      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate a short, descriptive title (3-6 words) for a career counseling conversation based on this message: "${firstMessage}". Focus on the main career topic or concern. Return only the title, no quotes or extra text.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 20,
        },
      };

      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        const data = await response.json() as {
          candidates?: Array<{
            content?: {
              parts?: Array<{ text?: string }>;
            };
          }>;
        };
        const title = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (title && title.length > 0) {
          return title.replace(/['"]/g, ""); // Remove quotes if present
        }
      }
    } catch (error) {
      console.error("Error generating session name:", error);
    }

    // Fallback to a generic name based on first message
    const words = firstMessage.split(" ").slice(0, 3);
    return words.length > 0 ? words.join(" ") + "..." : "Career Chat";
  }

  validateResponse(response: string): boolean {
    // Basic validation
    if (!response || response.trim().length === 0) {
      return false;
    }

    // Check for minimum length (avoid very short responses)
    if (response.trim().length < 10) {
      return false;
    }

    // Check for inappropriate content (basic filter)
    const inappropriatePatterns = [
      /\b(hate|violence|illegal|harmful)\b/i,
      /\b(personal information|private data)\b/i,
    ];

    return !inappropriatePatterns.some((pattern) => pattern.test(response));
  }
}

// Export singleton instance
export const aiService = new AIService();
