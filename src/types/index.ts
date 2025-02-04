export interface MediaContent {
  uri: string;
  type: string;
  fileName: string;
  base64?: string;
}

export interface Capsule {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaContent?: MediaContent;
  openDate: string;
  createdAt: string;
  isLocked: boolean;
  recipientEmail?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  capsules: Capsule[];
}
