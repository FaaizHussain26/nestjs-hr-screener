import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.client = new OpenAI({ apiKey: apiKey as string });
    this.model =
      this.configService.get<string>('EMBEDDING_MODEL') ||
      'text-embedding-3-small';
  }

  async generateEmbeddingFromJob(payload: {
    title: string;
    experience: string;
    summary?: string;
    description: string;
    skills?: string[];
  }): Promise<number[] | undefined> {
    try {
      const composed = this.composeJobText(payload);
      if (!this.client.apiKey) {
        return undefined;
      }
      const res = await this.client.embeddings.create({
        model: this.model,
        input: composed,
      });
      return res.data?.[0]?.embedding as unknown as number[];
    } catch (error) {
      this.logger.error('Failed to generate embedding', error as Error);
      return undefined;
    }
  }

  private composeJobText(payload: {
    title: string;
    experience: string;
    summary?: string;
    description: string;
    skills?: string[];
  }): string {
    const parts: string[] = [];
    parts.push(`Title: ${payload.title}`);
    parts.push(`Experience (years): ${payload.experience}`);
    if (payload.summary) parts.push(`Summary: ${payload.summary}`);
    parts.push(`Description: ${payload.description}`);
    if (payload.skills?.length)
      parts.push(`Skills: ${payload.skills.join(', ')}`);
    return parts.join('\n');
  }
}
