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
					messageFr:
						"La période de soumission des objectifs a commencé. Veuillez prendre le temps de soumettre vos objectifs sur la plateforme de performance.",
					active: false,
					dateFrom: "2024-01-01",
					dateTo: "2024-01-07",
				},

				{
					stepId: 2,
					name: "Objective Validation",
					message:
						"The objective validation period has started. Please take the time to validate your team members' objectives on the performance platform.",
					messageFr:
						"La période de validation des objectifs a commencé. Veuillez prendre le temps de valider les objectifs de vos membres d'équipe sur la plateforme de performance.",
					active: false,
					dateFrom: "2024-01-08",
					dateTo: "2024-01-14",
				},
				{
					stepId: 3,
					name: "Mid-term Review",
					message:
						"The mid-term review period has started. Please take the time to review your team's as well as your objectives on the performance platform.",
					messageFr:
						"La période de notation à mi-parcours a commencé. Veuillez prendre le temps de noter les progres de votre équipe ainsi que les vôtres sur la plateforme de performance.",
					active: false,
					dateFrom: "2024-01-15",
					dateTo: "2024-01-23",
				},

				{
					stepId: 4,
					name: "Year End Evaluation",
					message:
						"The year-end evaluation period has started. Please take the time to evaluate your team members on the performance platform.",
					messageFr:
						"La période d'évaluation de fin d'année a commencé. Veuillez prendre le temps d'évaluer vos membres d'équipe sur la plateforme de performance.",
					active: false,
					dateFrom: "2024-02-08",
					dateTo: "2024-02-14",
				},
			],
		})
		.then(() => {
			console.log("Loaded steps settings.");
		})
		.catch((err) => {});

	prisma.settings
		.createMany({
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
					value: "100",
					label: "Minimum length for input fields",
				},

				{
					settingId: 4,
					name: "SETTING_MAX_CHAR",
					value: "1000",
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
				{
					settingId: 10,
					name: "EVALUATION_QUESTION_FR_1",
					value: "Comment l'individu interagit-il avec les membres de l'équipe et les autres collègues ? Dans quelle mesure favorise-t-il la collaboration, la communication et la gestion des conflits ?",
					label: "Evaluation Question 1 FR",
				},
				{
					settingId: 11,
					name: "EVALUATION_QUESTION_FR_2",
					value: "Comment l'individu communique-t-il avec les collègues, les pairs et les subordonnés ? Dans quelle mesure favorise-t-il un environnement de travail collaboratif et ouvert ?",
					label: "Evaluation Question 2 FR",
				},
				{
					settingId: 12,
					name: "EVALUATION_QUESTION_FR_3",
					value: "Dans quelle mesure l'individu fait-il preuve de leadership et d'initiative au sein de l'organisation ? Pouvez-vous citer des situations où il ou elle a pris des mesures proactives pour résoudre des problèmes ou améliorer des processus ?",
					label: "Evaluation Question 3 FR",
				},
				{
					settingId: 13,
					name: "EVALUATION_QUESTION_FR_4",
					value: "Comment l'individu encourage-t-il le développement professionnel et personnel au sein de l'équipe ? Dans quelle mesure montre-t-il un intérêt pour le bien-être et la croissance de ses collègues ?",
					label: "Evaluation Question 4 FR",
				},
				{
					settingId: 14,
					name: "EVALUATION_QUESTION_FR_5",
					value: "Comment l'individu communique-t-il clairement les objectifs de l'équipe et les rôles individuels ?",
					label: "Evaluation Question 5 FR",
				},
			],
		})
		.then(() => {
			console.log("Loaded global settings.");
		})
		.catch((err) => {});
}
