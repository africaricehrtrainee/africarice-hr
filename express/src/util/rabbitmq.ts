import amqp from "amqplib";
import config from "../../config";

export const publishToQueue = async (queue: string, message: object) => {
	try {
		const connection = await amqp.connect(config.rabbitmqUrl);
		const channel = await connection.createChannel();

		channel.assertQueue(queue, {
			durable: true,
		});
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
			persistent: true,
		});

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error(error);
	}
};
