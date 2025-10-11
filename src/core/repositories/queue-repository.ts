export type SendMessageParams = {
  queueUrl: string
  messageBody: string
}

export interface QueueRepository {
  sendMessage(params: SendMessageParams): Promise<void>
}
