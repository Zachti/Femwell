export interface uploadFile {
  key: string
  data: Buffer
  mimeType: string
}
export interface uploadResult {
  id: string
  type: string
  error: number
}
