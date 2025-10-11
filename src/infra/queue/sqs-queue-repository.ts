import { SendMessageCommand } from '@aws-sdk/client-sqs'
import {
  QueueRepository,
  SendMessageParams,
} from '../../core/repositories/queue-repository'
import { sqsClient } from '../config/aws'

export class SQSQueueRepository implements QueueRepository {
  async sendMessage({
    queueUrl,
    messageBody,
  }: SendMessageParams): Promise<void> {
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
      })
    )
  }
}
