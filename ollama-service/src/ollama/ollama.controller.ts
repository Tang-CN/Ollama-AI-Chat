import {
  Controller,
  Post,
  Body,
  Sse,
  Get,
  MessageEvent,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable, map } from 'rxjs';
import { OllamaService } from './ollama.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    return this.ollamaService.chat(chatDto);
  }

  // SSE 流式接口（GET 请求，用于 EventSource）
  @Sse('chat/sse')
  chatSse(@Body() chatDto: ChatDto): Observable<MessageEvent> {
    return this.ollamaService.chatStream(chatDto).pipe(
      map(
        (content) =>
          ({
            data: { content },
          }) as MessageEvent,
      ),
    );
  }

  // POST 流式接口（使用 ReadableStream）
  @Post('chat/stream')
  async chatStream(@Body() chatDto: ChatDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = this.ollamaService.chatStream(chatDto);

    stream.subscribe({
      next: (content) => {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      },
      error: (err) => {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      },
      complete: () => {
        res.write('data: [DONE]\n\n');
        res.end();
      },
    });
  }

  @Get('models')
  async getModels() {
    return this.ollamaService.getModels();
  }
}
