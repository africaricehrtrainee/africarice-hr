import { getCurrentMySQLDate } from "@/util/utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Data {
    positions: Position[];
    employees: Employee[];
}

interface Actions {
    setPositions: (to: Position[]) => void;
    setEmployees: (to: Employee[]) => void;
}

const initialState: Data = {
    positions: [],
    employees: [],
};

export const useOrganogramDataStore = create<Data & Actions>()(
    immer((set) => ({
        ...initialState,
        setPositions: (to) => set((state) => ({ positions: to })),
        setEmployees: (to) => set((state) => ({ employees: to })),

    }))
);
