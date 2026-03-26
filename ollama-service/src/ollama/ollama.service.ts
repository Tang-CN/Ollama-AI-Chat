import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import { ChatDto } from './dto/chat.dto';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly ollama: Ollama;

  constructor(private configService: ConfigService) {
    this.ollama = new Ollama({
      host:
        this.configService.get<string>('OLLAMA_HOST') ||
        'http://localhost:11434',
    });
  }

  async chat(chatDto: ChatDto) {
    try {
      const response = await this.ollama.chat({
        model: chatDto.model,
        messages: [{ role: 'user', content: chatDto.prompt }],
        stream: false,
      });
      return {
        model: response.model,
        response: response.message.content,
        done: response.done,
      };
    } catch (error) {
      this.logger.error('Chat error:', error);
      throw error;
    }
  }

  chatStream(chatDto: ChatDto): Observable<string> {
    return new Observable<string>((subscriber: Subscriber<string>) => {
      this.streamChat(chatDto, subscriber);
    });
  }

  private async streamChat(chatDto: ChatDto, subscriber: Subscriber<string>) {
    try {
      const stream = await this.ollama.chat({
        model: chatDto.model,
        messages: [{ role: 'user', content: chatDto.prompt }],
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.message?.content) {
          subscriber.next(chunk.message.content);
        }
        if (chunk.done) {
          subscriber.complete();
        }
      }
    } catch (error) {
      this.logger.error('Stream chat error:', error);
      subscriber.error(error);
    }
  }

  async getModels() {
    try {
      const models = await this.ollama.list();
      return models.models.map((model) => ({
        name: model.name,
        size: model.size,
        modified_at: model.modified_at,
      }));
    } catch (error) {
      this.logger.error('Get models error:', error);
      throw error;
    }
  }
}
