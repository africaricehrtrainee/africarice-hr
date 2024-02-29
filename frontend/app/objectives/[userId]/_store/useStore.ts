import { create } from "zustand";
import { compareAsc, format } from "date-fns";
import axios from "axios";

interface Data {
    // SLICES
    selectedYear: string | null;
    selectedEvaluationStep: number;
    selectedObjectiveIndex: number;
    objectives: Objective[] | null;
    objectivesLocal: Partial<Objective>[];
    comments: Comment[];
    evaluation: Evaluation | null;
    evaluationLocal: Partial<Evaluation>;
    evaluationSteps: Step[];
    employee: Employee | null;
}

interface Actions {
    // ACTIONS
    setSelectedYear: (to: string) => void;
    setObjectives: (to: Objective[] | null) => void;
    setObjectivesLocal: (to: Partial<Objective>[]) => void;
    setComments: (to: Comment[]) => void;
    setEvaluation: (to: Evaluation | null) => void;
    setEvaluationLocal: (to: Partial<Evaluation>) => void;
    setEvaluationSteps: (to: Step[]) => void;
    setEmployee: (to: Employee) => void;
    setSelectedEvaluationStep: (to: number) => void;
    setSelectedObjectiveIndex: (to: number) => void;
    fetchObjectives: (userId: string) => void;
    fetchEvaluation: (userId: string) => void;
    reset: () => void;
}
const initialState: Data = {
    // SLICES
    selectedYear: null,
    objectives: null,
    objectivesLocal: [],
    comments: [],
    evaluation: null,
    evaluationLocal: {},
    employee: null,
    selectedEvaluationStep: 0,
    evaluationSteps: [],
    selectedObjectiveIndex: -1,
};
export const useObjectivesDataStore = create<Data & Actions>((set) => ({
    ...initialState,
    // ACTIONS
    setSelectedYear: (to) => set((state) => ({ selectedYear: to })),
    setObjectives: (to) => set((state) => ({ objectives: to })),
    setObjectivesLocal: (to) => set((state) => ({ objectivesLocal: to })),
    setComments: (to) => set((state) => ({ comments: to })),
    setEvaluation: (to) => set((state) => ({ evaluation: to })),
    setEvaluationLocal: (to) => set((state) => ({ evaluationLocal: to })),
    setEmployee: (to) => set((state) => ({ employee: to })),
    setSelectedEvaluationStep: (to) =>
        set((state) => ({ selectedEvaluationStep: to })),
    setEvaluationSteps: (to) => set((state) => ({ evaluationSteps: to })),
    setSelectedObjectiveIndex: (to) =>
        set((state) => ({ selectedObjectiveIndex: to })),
    reset: () => {
        set(initialState);
    },
    fetchObjectives: async (userId) => {
        axios
            .get<Objective[]>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    userId +
                    "/objectives"
            )
            .then((response) => {
                if (response.data.length > 0) {
                    set((state) => ({ objectives: response.data }));
                    console.log("objectives", response.data[0]);
                } else {
                    set((state) => ({ objectives: [] }));
                }
            })
            .catch((err) => console.log(err));
    },
    fetchEvaluation: async (userId) => {
        axios
            .get<Evaluation>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    userId +
                    "/objectives"
            )
            .then((response) => {
                if (response.data) {
                    set((state) => ({ evaluation: response.data }));
                    console.log("evaluation", response.data);
                } else {
                    // set((state) => ({ evaluation: [] }));
                }
            })
            .catch((err) => console.log(err));
    },
}));

// export const selectActiveStep = (state: Data) => {
//     let index = -1;
//     state.evaluationSteps.forEach((step, i) => {
//         if (compareAsc(new Date(), step.dateFrom) !== -1) {
//             index = i;
//         }
//     });
//     return index;
// };
export const selectActiveStep = (state: Data) =>
    state.evaluationSteps
        ? state.evaluationSteps.findLastIndex(
              (step) => compareAsc(new Date(), step.dateFrom) == 1
          )
        : -1;

export const selectActiveObjective = (state: Data) =>
    state.objectivesLocal
        ? state.objectivesLocal.find(
              (objective, index) => index === state.selectedObjectiveIndex
          )
        : null;
