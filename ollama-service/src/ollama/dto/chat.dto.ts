export class ChatDto {
  model: string;
  prompt: string;
  stream?: boolean;
}

export class ChatResponseDto {
  model: string;
  response: string;
  done: boolean;
}
