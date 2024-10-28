import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  async onModuleInit() {
    try {
      
      this.connection = await amqp.connect('amqp://localhost:5672');
      this.channel = await this.connection.createChannel();

      
      await this.channel.assertQueue('notifications', { durable: true });

      
      this.channel.consume('notifications', (msg: amqp.Message | null) => {
        if (msg) {
          const messageContent = msg.content.toString();
          console.log(`Received message: ${messageContent}`);
          this.channel.ack(msg);
        }
      });

      console.log('RabbitMQ connection established and consumer set up.');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    
    try {
      await this.channel.close();
      await this.connection.close();
      console.log('RabbitMQ connection and channel closed.');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }

  
  async sendMessage(queue: string, message: string) {
    try {
      if (this.channel) {
        this.channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message sent to queue ${queue}: ${message}`);
      } else {
        console.error('Cannot send message: Channel is not initialized.');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}
