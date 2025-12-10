import { ImageData } from './image-data';

export interface Ristrutturazione {
  id?: string;
  title: string;
  description: string;
  beforeImages: ImageData[];
  afterImages: ImageData[];
  created_at?: string;
}