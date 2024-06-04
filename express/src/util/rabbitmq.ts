import amqp from "amqplib";
import config from "../../config";

export const connectToQueue = async () => {
	const connection = await amqp.connect(config.rabbitmqUrl);
	const channel = await connection.createChannel();
	return channel;
};

export const publishToQueue = async (queue: string, message: object) => {
	const channel = await connectToQueue();
	channel.assertQueue(queue, {
		durable: true,
	});
	channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};
