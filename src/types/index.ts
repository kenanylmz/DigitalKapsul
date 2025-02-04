export interface MediaContent {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

export interface Capsule {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  openDate: string;
  type: 'text' | 'image' | 'video';
  content: string;
  mediaContent?: MediaContent;
  isLocked: boolean;
  recipientEmail?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  capsules: Capsule[];
} 