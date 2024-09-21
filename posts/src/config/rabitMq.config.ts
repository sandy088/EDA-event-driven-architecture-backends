import { Connection, Channel, connect } from 'amqplib';

class RabbitMQConfig {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async connect(): Promise<void> {
        try {
            this.connection = await connect(this.url);
            this.channel = await this.connection?.createChannel()!;
            //also create a queue
            await this.createQueue('posts');
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ', error);
        }
    }

    async createQueue(queueName: string): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel is not initialized. Call connect() first.');
        }
        await this.channel.assertQueue(queueName, { durable: true });
        console.log(`Queue ${queueName} created`);
    }

    async sendToQueue(queueName: string, message: string): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel is not initialized. Call connect() first.');
        }
        this.channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message sent to queue ${queueName}`);
    }

    //consumer
    async consume(queueName: string, onMessage: (message: any) => void): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel is not initialized. Call connect() first.');
        }
        this.channel.consume(queueName, (message) => {
            if (message) {
                onMessage(JSON.parse(message.content.toString()));
                this.channel?.ack(message);
            }
        });
        console.log(`Consuming messages from queue ${queueName}`);
    }

    async close(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
        console.log('Connection to RabbitMQ closed');
    }
}

export default new RabbitMQConfig('amqp://localhost');