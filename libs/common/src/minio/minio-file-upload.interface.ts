export interface MinioFileUploadOptions {
  bucket: string;
  key: string;
  file: Buffer;
  filePath?: string;
}
