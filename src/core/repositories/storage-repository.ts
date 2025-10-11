export type UploadFileParams = {
  fileName: string
  body: Buffer
  contentType: string
}

export type UploadFileResponse = {
  url: string
}

export interface StorageRepository {
  upload(params: UploadFileParams): Promise<UploadFileResponse>
}
