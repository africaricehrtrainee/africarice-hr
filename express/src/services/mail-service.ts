import prisma from "../../prisma/middleware";
import { computeFinished } from "../util/utils";
import { publishToQueue } from "../util/rabbitmq";

export default async function addMailToQueue({
	subject,
	recipients,
	templateData,
}: {
	subject?: string;
	recipients: string[];
	templateData:
		| { template: "main"; context: { content: string } }
		| { template: "recovery"; context: { recoveryId: string } };
}) {
	try {
		publishToQueue("emailQueue", { subject, recipients, templateData });
	} catch (error) {
		console.log(error);
	}
}

// export async function mailEvaluationStep() {
// 	const employees = await prisma.employees.findMany({
// 		select: {
// 			employeeId: true,
// 			email: true,
// 			firstName: true,
// 			lastName: true,
// 		},
// 		orderBy: {
// 			lastName: "asc",
// 		},
// 		where: {
// 			email: {
// 				not: {
// 					startsWith: "A",
// 				},
// 			},
// 		},
// 	});

// 	if (!employees) {
// 		console.log("No employees have been found.");
// 		return;
// 	}

// 	const getCurrentDate = (): string => new Date().toISOString().split("T")[0];
// 	const date = getCurrentDate();

// 	// Fetching all the steps
// 	const step = await prisma.steps.findFirst({
// 		select: {
// 			dateFrom: true,
// 			name: true,
// 			message: true,
// 			stepId: true,
// 			sent: true,
// 		},
// 		where: {
// 			dateFrom: {
// 				lte: date,
// 			},
// 		},
// 		orderBy: {
// 			dateFrom: "desc",
// 		},
// 	});

// 	if (!step) {
// 		console.log("No performance step has been found");
// 		return;
// 	}

// 	console.log("Current evaluation step is: " + `\u001b${step.name}`);

// 	if (step.sent) {
// 		console.log("Message has already been sent for this step");
// 		return;
// 	}

// 	const recipients = employees
// 		.filter((empl) => empl.email.includes("cgiar.org"))
// 		.map((employee) => employee.email);

// 	sendMail({
// 		context: { content: step.message },
// 		recipients,
// 	})
// 		.then(async () => {
// 			console.log("Message sent successfully");
// 			await prisma.steps.update({
// 				data: {
// 					sent: true,
// 				},
// 				where: {
// 					stepId: step.stepId,
// 				},
// 			});
// 		})
// 		.catch((err) => {
// 			console.log("Message failed to send", err);
// 		});
// }

export async function mailNotificationStep() {
	// Fetching all the employees and the current date

	const employees = await prisma.employees.findMany({
		select: {
			email: true,
			employeeId: true,
		},
		where: {
			email: {
				not: {
					startsWith: "A",
				},
			},
		},
	});

	if (!employees) {
		console.log("No employees have been found.");
		return;
	}

	let recipients: string[] = [];

	for (const employee of employees) {
		const finished = await computeFinished(employee.employeeId);
		if (!finished) {
			console.log(
				"Employee " +
					employee.employeeId +
					" has not finished all the steps"
			);
			recipients.push(employee.email);
		}
	}

	if (recipients.length < 0) {
		return;
	}

	addMailToQueue({
		templateData: {
			template: "main",
			context: {
				content:
					"You have not finished all the steps of the evaluation process. Please do so as soon as possible.",
			},
		},
		recipients,
	})
		.then(() =>
			console.log("Successfully added notification mail to queue")
		)
		.catch((err) =>
			console.log("An error occurred sending notification mail", err)
		);
}
