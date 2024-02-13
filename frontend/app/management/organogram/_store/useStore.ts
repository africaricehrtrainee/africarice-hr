// import { constructPositionTree, getCurrentMySQLDate } from "@/util/utils";
// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";

// interface Data {
//     positions: Position[];
//     positionsLocal: Position[] | null;
//     employees: Employee[];
// }

// interface Actions {
//     setPositions: (to: Position[]) => void;
//     setPositionsLocal: (to: Position[]) => void;
//     setVacant: (roleId: number) => void;
//     insertBelow: (roleId: number, roleName: string) => void;
//     insertAbove: (roleId: number, roleName: string) => void;
//     deletePosition: (roleId: number) => void;
//     assignPosition: (roleId: number, holder: Employee) => void;
//     setEmployees: (to: Employee[]) => void;
// }

// const initialState: Data = {
//     positions: [],
//     positionsLocal: [],
//     employees: [],
// };

// export const useOrganogramDataStore = create<Data & Actions>()(
//     immer((set) => ({
//         ...initialState,
//         setPositions: (to) => set((state) => ({ positions: to })),
//         setPositionsLocal: (to) => set((state) => ({ positionsLocal: to })),
//         setEmployees: (to) => set((state) => ({ employees: to })),

//         assignPosition: (roleId, holder) =>
//             set((state) => {
//                 if (state.positionsLocal) {
//                     state.positionsLocal.forEach((pos) =>
//                         pos.holderId == holder.employeeId
//                             ? (pos.holderId = null)
//                             : null
//                     );
//                     const i = state.positionsLocal.findIndex(
//                         (position) => position.roleId === roleId
//                     );
//                     state.positionsLocal[i].holderId = holder.employeeId;
//                     state.positionsLocal[i].firstName = holder.firstName;
//                     state.positionsLocal[i].lastName = holder.lastName;
//                 }
//             }),
//         setVacant: (to) =>
//             set((state) => {
//                 if (state.positionsLocal) {
//                     state.positionsLocal[
//                         state.positionsLocal.findIndex(
//                             (position) => position.roleId === to
//                         )
//                     ].holderId = null;
//                 }
//             }),
//         insertBelow: (roleId, roleName) =>
//             set((state) => {
//                 state.positionsLocal
//                     ? state.positionsLocal.push({
//                           createdAt: getCurrentMySQLDate(),
//                           updatedAt: getCurrentMySQLDate(),
//                           firstName: null,
//                           holderId: null,
//                           lastName: null,
//                           name: roleName,
//                           roleId: Math.ceil(Math.random() * 10000000),
//                           supervisorId: roleId,
//                           deletedAt: null,
//                       })
//                     : null;
//             }),
//         insertAbove: (roleId, roleName) =>
//             set((state) => {
//                 if (state.positionsLocal) {
//                     const newId = Math.ceil(Math.random() * 1000000);
//                     state.positionsLocal[
//                         state.positionsLocal.findIndex(
//                             (position) => position.roleId === roleId
//                         )
//                     ].supervisorId = newId;
//                     state.positionsLocal.push({
//                         createdAt: getCurrentMySQLDate(),
//                         updatedAt: getCurrentMySQLDate(),
//                         firstName: null,
//                         holderId: null,
//                         lastName: null,
//                         name: roleName,
//                         roleId: newId,
//                         supervisorId: null,
//                         deletedAt: null,
//                     });
//                 }
//             }),
//         deletePosition: (roleId) =>
//             set((state) => {
//                 if (state.positionsLocal) {
//                     const i = state.positionsLocal.findIndex(
//                         (position) => position.roleId === roleId
//                     );

//                     state.positionsLocal.forEach((position, index, arr) => {
//                         if (position.supervisorId == roleId) {
//                             arr[index].supervisorId = arr[i].supervisorId;
//                         }
//                     });

//                     state.positionsLocal[i].deletedAt = getCurrentMySQLDate();
//                     state.positionsLocal[i].supervisorId = null;
//                 }
//             }),
//     }))
// );

// export const selectTree = (state: Data) =>
//     state.positionsLocal ? constructPositionTree(state.positionsLocal) : null;

// export const selectPositionsWithRoles = (state: Data) => {
//     if (state.positionsLocal && state.employees) {
//         return state.positionsLocal.map((position, index, array) =>
//             state.employees.find(
//                 (employee) => employee.employeeId == position.holderId
//             )
//         );
//     }
// };
