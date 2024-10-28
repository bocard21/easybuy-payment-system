import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    try {
      const url = process.env.RABBITMQ_URL;
      if (!url) {
        throw new Error('RABBITMQ_URL is not defined in the environment variables.');
      }

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('RabbitMQ connected.');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000); // Tentar reconectar em 5 segundos
    }
  }

  async disconnect() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  async publish(queue: string, message: string) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not established.');
      return;
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to queue ${queue}: ${message}`);
  }
}
