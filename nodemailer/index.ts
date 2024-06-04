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
				const response = await handleEmailMessage(msg.content);
				if (response?.accepted) {
					console.log(`Email sent to ${response.accepted}`);
					channel.ack(msg);
				} else {
					console.log("Error sending email");
					channel.nack(msg);
				}
			}
		},
		{
			noAck: false,
		}
	);

	console.log(`Worker is listening for messages on ${queue}...`);
};

start().catch(console.error);
