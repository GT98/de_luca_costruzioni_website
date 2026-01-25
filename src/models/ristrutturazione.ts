import { ImageData } from './image-data';

export interface Ristrutturazione {
  id?: string;
  title: string;
  description: string;
  beforeImages: ImageData[];
  afterImages: ImageData[];
  beforePreviews?: ImageData[];
  afterPreviews?: ImageData[];
  beforeFiles?: File[];
  afterFiles?: File[];
  created_at?: string;
}