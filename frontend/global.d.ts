interface Employee {
    employeeId: number;
    role: "hr" | "staff" | "admin" | "consultant";
    email: string;
    supervisorId: number;
    firstName: string;
    lastName: string;
    password: string;
    matricule: string;
    jobTitle: string;
    supervisor: Employee | null;
    subordinates: Employee[];
    evaluations360: Evaluation360[];
    evaluation360Supervisor: Evaluation360[];
    evaluation360Evaluator: Evaluation360[];
    objectives?: Objectives[];
    objectivesSupervisor?: Objectives[];
    evaluations?: Evaluations[];
    evaluationsSupervisor?: Evaluations[];
}

interface Evaluation {
    evaluationId: number;
    employeeId: number;
    supervisorId: number;
    supervisorJobTitle: string;
    evaluationYear: string;
    evaluationStatus: string;
    updatedAt: Date;
    createdAt: Date;
    efficiency: string | null;
    efficiencyRating: number | null;
    competency: string | null;
    competencyRating: number | null;
    commitment: string | null;
    commitmentRating: number | null;
    initiative: string | null;
    initiativeRating: number | null;
    respect: string | null;
    respectRating: number | null;
    leadership: string | null;
    leadershipRating: number | null;
    selfEvaluationStatus: string;
    selfEfficiency: string | null;
    selfEfficiencyRating: number | null;
    selfCompetency: string | null;
    selfCompetencyRating: number | null;
    selfCommitment: string | null;
    selfCommitmentRating: number | null;
    selfInitiative: string | null;
    selfInitiativeRating: number | null;
    selfRespect: string | null;
    selfRespectRating: number | null;
    selfLeadership: string | null;
    selfLeadershipRating: number | null;
    employee?: Employee;
    supervisor?: Employee;
}

interface Evaluation360 {
    evaluation360Id: number;
    employeeId: number;
    supervisorId: number;
    evaluationYear: string;
    employee: Employee;
    supervisor: Employee;
    evaluator: Employee | null;
    evaluators?: Evaluator360[];
}

interface Evaluator360 {
    evaluator360Id: number;
    evaluationId: number;
    evaluatorStatus: "draft" | "sent" | "ok" | "invalid" | "evaluated"; // default draft
    evaluatorId: number;
    evaluatorJobTitle: string;

    interpersonalComment: string | null;
    collaborationComment: string | null;
    leadershipComment: string | null;
    commitmentComment: string | null;
    teamworkComment: string | null;
    interpersonalRating: number | null;
    collaborationRating: number | null;
    leadershipRating: number | null;
    commitmentRating: number | null;
    teamworkRating: number | null;
}

interface Objective {
    objectiveId: number;
    objectiveYear: string; // references evaluationId
    status: "draft" | "sent" | "invalid" | "ok" | "cancelled"; // default draft
    employeeId: number; // references employeeId
    supervisorId: number; // references employeeId
    evaluationStatus: "draft" | "sent"; // default draft
    selfEvaluationStatus: "draft" | "sent"; // default draft
    createdAt: string;
    updatedAt: string;
    // Objective fields
    title: string | null;
    description: string | null;
    successConditions: string | null;
    deadline: string | null;
    kpi: string | null;
    grade: number | null;
    comment: string | null;
    reviewStatus: "draft" | "sent";
    selfReviewStatus: "draft" | "sent";
    selfGrade: number | null;
    selfComment: string | null;

    employee?: Employee;
    supervisor?: Employee;
    midtermSelfComment: string | null;
    midtermComment: string | null;
    ObjectiveComment?: Comment[];
}

interface Step {
    stepId: number;
    name: string;
    message: string;
    dateFrom: string;
    dateTo: string;
    active: boolean;
    sent: boolean;
}

interface Comment {
    commentId: number;
    objectiveId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    content: string;
    objective: Objectives;
}

interface Position {
    employeeId: number;
    employeeFirstName: string;
    employeeLastName: string;
    employeeJobTitle: string;
    children?: Position[];
}
// Status types and notifications
type StaffObjectiveStatus =
    | "OBJECTIVE_IDLE"
    | "OBJECTIVE_EMPTY"
    | "OBJECTIVE_SENT"
    | "OBJECTIVE_INVALID"
    | "OBJECTIVE_OK"
    | "OBJECTIVE_UNREVIEWED"
    | "OBJECTIVE_REVIEWED"
    | "OBJECTIVE_UNRATED"
    | "OBJECTIVE_RATED";
type StaffSelfEvaluationStatus =
    | "SELF_EVALUATION_IDLE"
    | "SELF_EVALUATION_EMPTY"
    | "SELF_EVALUATION_SENT";
type SupervisorObjectiveStatus =
    | "SUPERVISOR_OBJECTIVE_IDLE"
    | "SUPERVISOR_OBJECTIVE_UNVALIDATED"
    | "SUPERVISOR_OBJECTIVE_VALIDATED"
    | "SUPERVISOR_OBJECTIVE_UNREVIEWED"
    | "SUPERVISOR_OBJECTIVE_REVIEWED"
    | "SUPERVISOR_OBJECTIVE_UNRATED"
    | "SUPERVISOR_OBJECTIVE_RATED";
type SupervisorEvaluationStatus =
    | "SUPERVISOR_EVALUATION_IDLE"
    | "SUPERVISOR_EVALUATION_UNRATED"
    | "SUPERVISOR_EVALUATION_RATED";

type StaffEvaluation360Status =
    | "EVALUATION360_IDLE"
    | "EVALUATION360_EMPTY"
    | "EVALUATION360_SENT"
    | "EVALUATION360_INVALID"
    | "EVALUATION360_OK"
    | "EVALUATION360_RATED";

type SupervisorEvaluation360Status =
    | "SUPERVISOR_EVALUATION360_IDLE"
    | "SUPERVISOR_EVALUATION360_UNREVIEWED"
    | "SUPERVISOR_EVALUATION360_REVIEWED";

type OtherEvaluation360Status =
    | "EVALUATION360_IDLE"
    | "EVALUATION360_UNRATED"
    | "EVALUATION360_RATED";

type SupervisorStatus = {
    objectiveStatus: SupervisorObjectiveStatus;
    evaluationStatus: SupervisorEvaluationStatus;
    evaluation360Status: SupervisorEvaluation360Status;
    employeeId: number;
};

type Evaluation360Status = {
    evaluationStatus: StaffEvaluation360Status;
    employeeId: number;
};

type OtherEvaluation360 = {
    evaluationStatus: OtherEvaluation360Status;
    employeeId: number;
};

type Status = {
    objectiveStatus: StaffObjectiveStatus;
    evaluation360Status: StaffEvaluation360Status;
    selfEvaluationStatus: StaffSelfEvaluationStatus;
    otherEvaluation360Status: OtherEvaluation360[];
    supervisorStatus?: SupervisorStatus[];
};
