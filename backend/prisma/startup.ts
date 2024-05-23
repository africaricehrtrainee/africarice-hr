import prisma from "./middleware";

export default function startup() {
	prisma.employees
		.create({
			data: {
				email: "admin@mail.com",
				firstName: "Admin",
				lastName: "Platform",
				jobTitle: "Administrator",
				password: "admin",
				role: "admin",
				employeeId: 1,
			},
		})
		.catch((err) => {});

	prisma.steps
		.createMany({
			data: [
				{
					stepId: 1,
					name: "Objective Submission",
					message:
						"The objective submission period has started. Please take the time to submit your objectives on the performance platform.",
					active: false,
					dateFrom: "2024-01-01",
					dateTo: "2024-01-07",
				},

				{
					stepId: 2,
					name: "Objective Validation",
					message:
						"The objective validation period has started. Please take the time to validate your team's objectives on the performance platform.",
					active: false,
					dateFrom: "2024-01-08",
					dateTo: "2024-01-14",
				},

				{
					stepId: 3,
					name: "Midterm Review",
					message:
						"The midterm review period has started. Please take the time to review your team's as well as your objectives on the performance platform.",
					active: false,
					dateFrom: "2024-01-08",
					dateTo: "2024-01-14",
				},

				{
					stepId: 4,
					name: "Staff Self-Evaluation",
					message:
						"The self-evaluation period has started. Please take the time to self-evaluate your performance and your objectives on the performance platform.",
					active: false,
					dateFrom: "2024-01-15",
					dateTo: "2024-01-21",
				},

				{
					stepId: 5,
					name: "Supervisor Evaluation",
					message:
						"The evaluation period has started. Please take the time to evaluate your team's performance and objectives on the performance platform.",
					active: true,
					dateFrom: "2024-01-22",
					dateTo: "2024-01-28",
				},
			],
		})
		.then(() => {})
		.catch((err) => {});

	prisma.settings.createMany({
		data: [
			{
				settingId: 1,
				name: "SETTING_MIN_OBJ",
				value: "3",
				label: "Minimum number of objectives",
			},

			{
				settingId: 2,
				name: "SETTING_MAX_OBJ",
				value: "5",
				label: "Maximum number of objectives",
			},

			{
				settingId: 3,
				name: "SETTING_MIN_CHAR",
				value: "200",
				label: "Minimum length for input fields",
			},

			{
				settingId: 4,
				name: "SETTING_MAX_CHAR",
				value: "250",
				label: "Maximum length for input fields",
			},

			{
				settingId: 5,
				name: "EVALUATION_QUESTION_1",
				value: "How does the individual interact with team members and other colleagues? To what extent does he promote collaboration, communication and conflict handling?",
				label: "Evaluation Question 1",
			},

			{
				settingId: 6,
				name: "EVALUATION_QUESTION_2",
				value: "How does the individual communicate with colleagues, peers and subordinates? To what extent does he or she foster a collaborative and open work environment?",
				label: "Evaluation Question 2",
			},

			{
				settingId: 7,
				name: "EVALUATION_QUESTION_3",
				value: "To what extent does the individual demonstrate leadership and initiative within the organization? Can you cite situations where he or she has taken proactive steps to solve problems or improve processes?",
				label: "Evaluation Question 3",
			},

			{
				settingId: 8,
				name: "EVALUATION_QUESTION_4",
				value: "How does the individual encourage professional and personal development within the team? To what extent does he show an interest in the well-being and growth of his colleagues?",
				label: "Evaluation Question 4",
			},

			{
				settingId: 9,
				name: "EVALUATION_QUESTION_5",
				value: "How does the individual communicate team goals and individual roles clearly ?",
				label: "Evaluation Question 5",
			},
		],
	});
}
