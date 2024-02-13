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
    evaluationStatus: "draft" | "sent" | "ok" | "invalid"; // default draft
    employee: Employee;
    supervisor: Employee;
    evaluator: Employee | null;
    evaluators?: Evaluator360[];
}

interface Evaluator360 {
    evaluator360Id: number;
    evaluationId: number;
    evaluatorId: number;
    evaluatorJobTitle: string;
    evaluatorGrade: number;
    evaluatorComment: string;
}

interface Objective {
    objectiveId: number;
    objectiveYear: string; // references evaluationId
    status: "draft" | "sent" | "invalid" | "ok"; // default draft
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
    selfGrade: number | null;
    selfComment: string | null;
    employee?: Employee;
    supervisor?: Employee;
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
