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
    // Evaluator fields
    evaluatorOneId?: number;
    evaluatorOneJobTitle?: string;
    evaluatorOneGrade?: number;
    evaluatorOneComment?: string;
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
