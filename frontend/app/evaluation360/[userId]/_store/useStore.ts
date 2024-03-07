import axios from "axios";
import { useQueryState } from "nuqs";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Data {
    evaluation: Evaluation360 | null | undefined;
    evaluators: Evaluator360[] | undefined;
    employee: Employee | null;
    selectedEmployeeId: number | null;
}

interface Actions {
    fetchEvaluation: (userId: string, year: string) => Promise<void>;
    fetchEvaluators: (userId: string) => Promise<void>;
    fetchEmployee: (userId: string) => Promise<void>;
    setEvaluation: (to: Evaluation360 | null) => void;
    setEvaluators: (to: Evaluator360[] | null) => void;
    setSelectedEmployeeId: (to: number | null) => void;
}

const initialState: Data = {
    evaluation: undefined,
    evaluators: undefined,
    employee: null,
    selectedEmployeeId: null,
};

export const useEvaluationDataStore = create<Data & Actions>()(
    immer((set) => ({
        ...initialState,
        // ACTIONS
        setEvaluation: (to) => set((state) => ({ evaluation: to })),
        setEvaluators: (to) => set((state) => ({ evaluators: to })),
        setSelectedEmployeeId: (to) =>
            set((state) => ({ selectedEmployeeId: to })),
        // API CALLS
        fetchEvaluation: async (userId, year) => {
            const evaluation = await axios
                .get<Evaluation360>(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${userId}/evaluation360`,
                    {
                        params: {
                            year,
                        },
                    }
                )
                .then((res) => res.data ?? null)
                .catch((err) => {
                    console.log(err);
                    return null;
                });
            if (evaluation) console.log("evaluation360", evaluation);
            set((state) => ({ evaluation }));
        },
        fetchEvaluators: async (evaluationId) => {
            const evaluators = await axios
                .get<Evaluation360>(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation360/${evaluationId}/evaluators`
                )
                .then((res) => res.data)
                .catch((err) => {
                    console.log(err);
                    return null;
                });
            if (evaluators) console.log("evaluator360", evaluators);
            set((state) => ({ evaluators }));
        },
        fetchEmployee: async (userId) => {
            const employee = await axios
                .get<Employee>(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${userId}`
                )
                .then((res) => res.data)
                .catch((err) => {
                    console.log(err);
                    return null;
                });
            if (employee) console.log("employee", employee);
            set((state) => ({ employee }));
        },
    }))
);
