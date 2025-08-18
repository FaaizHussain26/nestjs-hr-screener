import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File } from 'multer';
import OpenAI from 'openai';
import * as pdfParse from 'pdf-parse';
import { JobRepository } from 'src/jobs/repositories/job.repository';
import { UploadFileDto } from '../controller/dto/upload-file.dto';
import { resumeAnalyzerPrompt } from 'src/common/prompts/resume-analyzer.prompt';

@Injectable()
export class ResumeAnalyzerService {
  private client: OpenAI;
  constructor(
    private readonly configService: ConfigService,
    private readonly jobRepository: JobRepository,
  ) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }
  async analyzer(payload: UploadFileDto, file: File) {
    const job = await this.jobRepository.findById(payload.job_id);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }

    const buffer = file.buffer;
    const pdfbuffer = await pdfParse(buffer);
    const resumeText = pdfbuffer.text.trim();

    try {
      const prompt = resumeAnalyzerPrompt(job, resumeText);

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        return { success: false, message: 'Empty response from AI' };
      }

      const cleaned = content.replace(/```json|```/g, '').trim();
      try {
        const parsed = JSON.parse(cleaned);

        return {
          success: true,
          data: parsed,
        };
      } catch (err) {
        return {
          success: false,
          message: 'AI response is not valid JSON',
          rawOutput: content,
        };
      }
    } catch {
      return {
        success: false,
        message: 'The AI is not analyzing your résumé.',
      };
    }
  }
}
