export class UpdateBlogDto {
  title?: { ru: string; az: string };
  content?: { ru: string; az: string };
  description?: { ru: string; az: string };
  images?: string[];
  
}
