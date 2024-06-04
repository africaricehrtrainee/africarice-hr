import amqp from "amqplib";
import config from "../../config";

var channel: any;
var connection: any;

export const connectToQueue = async () => {
	try {
		connection = await amqp.connect(config.rabbitmqUrl);
		channel = await connection.createChannel();
		return channel;
	} catch (error) {
		console.error(error);
	}
};

export const publishToQueue = async (queue: string, message: object) => {
	try {
		channel.assertQueue(queue, {
			durable: true,
		});
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error(error);
	}
};
