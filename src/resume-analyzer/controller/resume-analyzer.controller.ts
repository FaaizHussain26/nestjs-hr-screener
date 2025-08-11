import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { File } from 'multer';
import { ResumeAnalyzerService } from '../service/resume-analyzer.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { PdfParseFilePipe } from 'src/common/pipes/parse-pipe.pipe';

@Controller('resume-analyzer')
@ApiTags('resume-analyzer')
export class ResumeAnalyzerController {
  constructor(private readonly resumeAnalyzerService: ResumeAnalyzerService) { }

  @Post('resume-analyzer')
  @ApiOperation({ summary: 'Upload a PDF file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(FileInterceptor('file'))
  analyzer(
    @Body() payload: UploadFileDto,
    @UploadedFile(PdfParseFilePipe)
    file: File,
  ) {
    return this.resumeAnalyzerService.analyzer(payload, file);
  }
}
