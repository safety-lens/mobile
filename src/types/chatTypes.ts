  export interface ImageUrl {
    s3Uri: string;
    url: string;
  }
  export interface ContentItem {
    type: 'image_url' | 'text';
    image_url?: ImageUrl;
    text?: string;
  }

  export interface NewMessage {
    role: 'user' | 'admin' | 'system' | 'assistant';
    content: ContentItem[];
  }

  export interface IStartChat {
    conversation: string;
    message: NewMessage;
    language: string
  }

  // chat response
  export interface ResponseContentItem {
    type: 'image_url' | 'text';
    image_url?: ImageUrl;
    text?: string;
  }

  export interface Message {
    id?: string;
    role: 'user' | 'admin' | 'system' | 'assistant';
    content: ResponseContentItem[] | string;
  }

  export interface ChatResponse {
    id: string;
    messages: Message[];
  }

export type MessageType = Message | NewMessage;

interface Analytics {
  missingData: unknown[];
  feedback: unknown[];
}

export interface IConversationIdResponse {
  agentId: string;
  analytics: Analytics;
  createdAt: string;
  id: string;
  messages: unknown[];
  updatedAt: string;
}