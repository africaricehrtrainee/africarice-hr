type Employees = {
	employeeId: number;
	role: "hr" | "admin" | "staff" | "consultant"; // default staff
	email: string;
	supervisorId?: number; // references another employeeId
	firstName: string;
	lastName: string;
	password: string;
	matricule: string; //unique
	jobTitle: string;
};

type Evaluations = {
	// Meta fields
	evaluationId: number;
	employeeId: number; // references employeeId
	supervisorId: number; // references employeeId
	supervisorJobTitle: string;
	evaluationYear: string; // format: YYYY default to current year
	evaluationStatus: "draft" | "sent"; // default draft
	updatedAt: Date; // sql update timestamp
	createdAt: Date; // sql create timestamp
	// Evaluation fields
	efficiency?: string;
	efficiencyRating?: number;
	competency?: string;
	competencyRating?: number;
	commitment?: string;
	commitmentRating?: number;
	initiative?: string;
	initiativeRating?: number;
	respect?: string;
	respectRating?: number;
	leadership?: string;
	leadershipRating?: number;
	selfEvaluationStatus: "draft" | "sent";
	selfEfficiency?: string;
	selfEfficiencyRating?: number;
	selfCompetency?: string;
	selfCompetencyRating?: number;
	selfCommitment?: string;
	selfCommitmentRating?: number;
	selfInitiative?: string;
	selfInitiativeRating?: number;
	selfRespect?: string;
	selfRespectRating?: number;
	selfLeadership?: string;
	selfLeadershipRating?: number;
};

type Evaluation360 = {
	// Meta fields
	evaluation360Id: number;
	employeeId: number; // references employeeId
	supervisorId: number; // references employeeId
	evaluationYear: string; // format: YYYY default to current year
	evaluationStatus: "sent" | "accepted"; // default sent
};

type Objectives = {
	// Meta fields
	objectiveId: number;
	evaluationId: number; // references evaluationId
	objectiveYear: string;
	status: "draft" | "sent" | "invalid" | "ok"; // default draft
	employeeId: number; // references employeeId
	supervisorId: number; // references employeeId
	evaluationStatus: "draft" | "sent"; // default draft
	selfEvaluationStatus: "draft" | "sent"; // default draft
	// Objective fields
	title: string | null;
	description: string | null;
	successConditions: string | null;
	deadline: string | null;
	kpi: string | null;
	grade: number | null;
	comment: string | null;
	selfGrade: number | null;
	selfComment: string | null;
};

type Step = {
	stepId: number;
	name: string;
	message: string;
	dateFrom: string;
	dateTo: string;
	sent: boolean;
};

type ObjectiveComment = {
	commentId: number;
	objectiveId: number;
	authorId: number;
	createdAt: string; // sql create timestamp
	updatedAt: Date; // sql update timestamp
	content: Date;
};

interface Settings {
	SETTING_MIN_OBJ: string;
	SETTING_MAX_OBJ: string;
	SETTING_MIN_CHAR: string;
	SETTING_MAX_CHAR: string;
	EVALUATION_QUESTION_1: string;
	EVALUATION_QUESTION_2: string;
	EVALUATION_QUESTION_3: string;
	EVALUATION_QUESTION_4: string;
	EVALUATION_QUESTION_5: string;
}
// Status types and notifications

export type StaffObjectiveStatus =
	| "OBJECTIVE_IDLE"
	| "OBJECTIVE_EMPTY"
	| "OBJECTIVE_SENT"
	| "OBJECTIVE_INVALID"
	| "OBJECTIVE_OK"
	| "OBJECTIVE_UNREVIEWED"
	| "OBJECTIVE_REVIEWED"
	| "OBJECTIVE_UNRATED"
	| "OBJECTIVE_RATED";
export type StaffSelfEvaluationStatus =
	| "SELF_EVALUATION_IDLE"
	| "SELF_EVALUATION_EMPTY"
	| "SELF_EVALUATION_SENT";
export type SupervisorObjectiveStatus =
	| "SUPERVISOR_OBJECTIVE_IDLE"
	| "SUPERVISOR_OBJECTIVE_UNVALIDATED"
	| "SUPERVISOR_OBJECTIVE_VALIDATED"
	| "SUPERVISOR_OBJECTIVE_UNREVIEWED"
	| "SUPERVISOR_OBJECTIVE_REVIEWED"
	| "SUPERVISOR_OBJECTIVE_UNRATED"
	| "SUPERVISOR_OBJECTIVE_RATED";
export type SupervisorEvaluationStatus =
	| "SUPERVISOR_EVALUATION_IDLE"
	| "SUPERVISOR_EVALUATION_UNRATED"
	| "SUPERVISOR_EVALUATION_RATED";

export type StaffEvaluation360Status =
	| "EVALUATION360_IDLE"
	| "EVALUATION360_EMPTY"
	| "EVALUATION360_SENT"
	| "EVALUATION360_INVALID"
	| "EVALUATION360_OK"
	| "EVALUATION360_RATED";

export type SupervisorEvaluation360Status =
	| "SUPERVISOR_EVALUATION360_IDLE"
	| "SUPERVISOR_EVALUATION360_UNREVIEWED"
	| "SUPERVISOR_EVALUATION360_REVIEWED";

export type OtherEvaluation360Status =
	| "EVALUATION360_IDLE"
	| "EVALUATION360_UNRATED"
	| "EVALUATION360_RATED";

export type SupervisorStatus = {
	objectiveStatus: SupervisorObjectiveStatus;
	evaluationStatus: SupervisorEvaluationStatus;
	evaluation360Status: SupervisorEvaluation360Status;
	employeeId: number;
};

export type Evaluation360Status = {
	evaluationStatus: StaffEvaluation360Status;
	employeeId: number;
};

export type OtherEvaluation360 = {
	evaluationStatus: OtherEvaluation360Status;
	employeeId: number;
};

export type Status = {
	objectiveStatus: StaffObjectiveStatus;
	evaluation360Status: StaffEvaluation360Status;
	selfEvaluationStatus: StaffSelfEvaluationStatus;
	otherEvaluation360Status: OtherEvaluation360[];
	supervisorStatus?: SupervisorStatus[];
};
