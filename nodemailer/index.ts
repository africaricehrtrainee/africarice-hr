import { connectToQueue } from "./utils/queueConnector";
import { handleEmailMessage } from "./handlers/emailHandler";

const start = async () => {
	const channel = await connectToQueue();
	const queue = "emailQueue";

	channel.assertQueue(queue, {
		durable: true,
	});

	channel.consume(
		queue,
		async (msg) => {
			if (msg !== null) {
				await handleEmailMessage(msg.content);
				channel.ack(msg);
			}
		},
		{
			noAck: false,
		}
	);

	console.log(`Worker is listening for messages on ${queue}...`);
};

start().catch(console.error);
