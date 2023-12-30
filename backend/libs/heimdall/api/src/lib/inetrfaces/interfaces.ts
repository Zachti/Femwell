export interface uploadFile {
  key: string;
  data: Buffer;
  mimeType: string;
}
export interface uploadResult {
  id: string;
  type: string;
  error: number;
}
export enum MimeTypes {
  PDF = 'application/pdf',
  JPG = 'image/jpeg',
  PNG = 'image/png',
}
