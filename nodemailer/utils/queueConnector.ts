import amqp from "amqplib";
import config from "../config/config";

export const connectToQueue = async () => {
	const connection = await amqp.connect(config.rabbitmqUrl);
	const channel = await connection.createChannel();
	return channel;
};
