// "use client";
// import { cn } from "@/util/utils";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { Tree, TreeNode } from "react-organizational-chart";
// import Modal from "@/components/ui/Modal";
// import Button from "@/components/ui/Button";
// import { useOrganogramDataStore } from "@/app/management/organogram/_store/useStore";
// import axios from "axios";

// function Assignment(props: {
//     setIsEditing: (arg0: boolean) => void;
//     roleName: string;
//     roleId: number;
// }) {
//     const { assignPosition } = useOrganogramDataStore();
//     const [search, setSearch] = useState<string>("");
//     const [employees, setEmployees] = useState<Employee[] | null>(null);
//     const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

//     const memoizedSearchQuery = useMemo(() => search, [search]);

//     useEffect(() => {
//         async function fetchEmployees() {
//             axios
//                 .get<Employee[]>(
//                     process.env.NEXT_PUBLIC_API_URL +
//                         "/api/employees/?search=" +
//                         memoizedSearchQuery
//                 )
//                 .then((response) => {
//                     if (response.data) {
//                         setEmployees(response.data);
//                     } else {
//                         setEmployees([]);
//                     }
//                 })
//                 .catch((err) => console.log(err));
//         }
//         // Only fetch data if the search term is not empty
//         if (memoizedSearchQuery !== "" && memoizedSearchQuery.length >= 3) {
//             fetchEmployees();
//         } else {
//             setEmployees([]);
//         }
//     }, [memoizedSearchQuery, search]);

//     return (
//         <form
//             onSubmit={(e) => {
//                 if (selectedEmployee) {
//                     e.preventDefault();
//                     assignPosition(props.roleId, selectedEmployee);
//                     props.setIsEditing(false);
//                 }
//             }}
//         >
//             <div className="flex h-[450px] w-[600px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
//                 <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
//                     Assigment
//                     <Icon
//                         icon="ic:baseline-star"
//                         className="ml-1"
//                         fontSize={10}
//                     />
//                 </div>
//                 {/* Header */}
//                 <div className="mt-2 flex w-full items-center justify-between">
//                     <p className="text-2xl font-bold text-zinc-700">
//                         {props.roleName}
//                     </p>
//                 </div>
//                 {/* Search bar */}
//                 <div className="relative mt-4 flex w-full items-center justify-start gap-1">
//                     <input
//                         required
//                         autoCorrect="off"
//                         spellCheck="false"
//                         type="text"
//                         value={search ?? ""}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                             setSearch(e.target.value)
//                         }
//                         placeholder="Search for a staff member"
//                         className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
//                     />
//                     <Icon
//                         icon="material-symbols:search"
//                         className="absolute right-2 ml-1 text-zinc-300"
//                         fontSize={16}
//                     />
//                 </div>
//                 <div className="mt-4 flex max-h-[300px] w-full flex-1 flex-col gap-1 overflow-y-scroll">
//                     {search.length < 3 || employees == null ? (
//                         <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
//                             <Icon
//                                 icon="material-symbols:search"
//                                 className=""
//                                 fontSize={64}
//                             />
//                             <h1 className="text-xl font-bold">
//                                 Start typing more than 3 letters.
//                             </h1>
//                         </div>
//                     ) : employees.length > 0 ? (
//                         employees.map((employee, i) => {
//                             return (
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         selectedEmployee?.employeeId ==
//                                         employee.employeeId
//                                             ? setSelectedEmployee(undefined)
//                                             : setSelectedEmployee(employee);
//                                     }}
//                                     className={cn(
//                                         "grid grid-cols-5 w-full relative items-center justify-start rounded-md border-b border-b-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
//                                         `${
//                                             selectedEmployee?.employeeId ==
//                                                 employee.employeeId &&
//                                             "bg-zinc-100"
//                                         }`
//                                     )}
//                                     key={i}
//                                 >
//                                     <div className="flex items-center justify-start">
//                                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-zinc-50">
//                                             {employee.firstName.charAt(0) +
//                                                 employee.lastName.charAt(0)}
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col items-start justify-center">
//                                         <p className="text-[8px] font-medium text-zinc-300">
//                                             LAST NAME
//                                         </p>
//                                         <p
//                                             className={cn(
//                                                 "text-xs text-zinc-700 max-w-[150px] truncate font-medium"
//                                             )}
//                                         >
//                                             {employee.lastName}
//                                         </p>
//                                     </div>
//                                     <div className="flex flex-col items-start justify-center">
//                                         <p className="text-[8px] font-medium text-zinc-300">
//                                             FIRST NAME
//                                         </p>
//                                         <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
//                                             {employee.firstName}
//                                         </p>
//                                     </div>
//                                     <div className="flex flex-col items-start justify-center">
//                                         <p className="text-[8px] font-medium text-zinc-300">
//                                             MATRICULE
//                                         </p>
//                                         <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
//                                             {employee.matricule}
//                                         </p>
//                                     </div>
//                                     <div className="flex flex-col items-end justify-center">
//                                         {selectedEmployee?.employeeId ==
//                                         employee.employeeId ? (
//                                             <Icon
//                                                 icon="mdi:checkbox-marked-circle"
//                                                 className="ml-1 text-green-500"
//                                                 fontSize={24}
//                                             />
//                                         ) : (
//                                             <Icon
//                                                 icon="mdi:checkbox-blank-circle-outline"
//                                                 className="ml-1 text-green-300"
//                                                 fontSize={24}
//                                             />
//                                         )}
//                                     </div>
//                                 </button>
//                             );
//                         })
//                     ) : (
//                         <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
//                             <Icon
//                                 icon="fluent:dust-20-filled"
//                                 className=""
//                                 fontSize={64}
//                             />
//                             <h1 className="text-xl font-bold">
//                                 No employee found.
//                             </h1>
//                         </div>
//                     )}
//                 </div>
//                 {/* Assignment button */}
//                 <div className="mt-4 flex w-full items-center justify-start gap-2">
//                     <Button
//                         type="submit"
//                         disabled={!selectedEmployee}
//                         variant="primary"
//                     >
//                         Assign position
//                         <Icon
//                             icon="ic:baseline-plus"
//                             className="ml-1"
//                             fontSize={14}
//                         />
//                     </Button>
//                 </div>
//             </div>
//         </form>
//     );
// }

// function Label({ position }: { position: Position }) {
//     const {
//         setVacant,
//         insertBelow,
//         insertAbove,
//         deletePosition,
//         positions,
//         employees,
//     } = useOrganogramDataStore();
//     const [isShown, setIsShown] = useState<boolean>(false);
//     const targetRef = useRef<HTMLButtonElement>(null);
//     const [isCreating, setIsCreating] = useState<[boolean, "above" | "below"]>([
//         false,
//         "below",
//     ]);
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [roleName, setRoleName] = useState<string>("");

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 targetRef.current &&
//                 !targetRef.current.contains(event.target as Node)
//             ) {
//                 setIsShown(false);
//             }
//         };

//         // Add the click event listener to the document
//         document.addEventListener("click", handleClickOutside);

//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//         };
//     }, []);

//     return (
//         <button
//             ref={targetRef}
//             onClick={(e) => {
//                 e.stopPropagation();
//                 console.log("Triggered");
//                 setIsShown((prev) => !prev);
//             }}
//             className={cn(
//                 "relative select-none cursor-pointer max-w-[200px] border border-transparent inline-block items-center justify-center gap-1 rounded-md p-3 px-5 text-xs transition-all font-semibold",
//                 `${
//                     positions.some(
//                         (cache) =>
//                             JSON.stringify(cache) === JSON.stringify(position)
//                     )
//                         ? "hover:border-purple-300 bg-purple-100 text-purple-700 active:bg-purple-200"
//                         : "hover:border-slate-300 bg-slate-100 text-slate-500 active:bg-slate-200 border-slate-300 border-dashed"
//                 }`,
//                 `${
//                     position.deletedAt !== null &&
//                     "hover:border-red-300 bg-red-100 text-red-500 active:bg-red-200 border-red-300 border-dashed"
//                 }`
//             )}
//         >
//             <p>{position.name}</p>
//             {position.holderId ? (
//                 <p className="text-[10px] font-medium">
//                     {position.firstName + " " + position.lastName}
//                 </p>
//             ) : (
//                 <p className="text-[10px] font-medium opacity-50">N/A</p>
//             )}

//             <div
//                 onClick={(e) => e.stopPropagation()}
//                 className={
//                     "absolute transition-all w-[180px] cursor-default top-full left-0 text-zinc-700 bg-white mt-1 flex flex-col items-center justify-center z-10 rounded-md border border-zinc-200 overflow-hidden shadow-sm" +
//                     `${
//                         !isShown
//                             ? " opacity-0 -translate-y-2 pointer-events-none z-0"
//                             : " opacity-100 translate-y-0"
//                     }`
//                 }
//             >
//                 <button
//                     onClick={() => {
//                         setIsCreating([true, "above"]);
//                         setIsShown(false);
//                     }}
//                     className="flex w-full items-center justify-between gap-1 p-2 px-3 transition-all hover:bg-zinc-50"
//                 >
//                     Insert position above
//                     <Icon
//                         icon="majesticons:arrow-up-line"
//                         className="ml-1"
//                         fontSize={16}
//                     />
//                 </button>
//                 <button
//                     onClick={() => {
//                         setIsCreating([true, "below"]);
//                         setIsShown(false);
//                     }}
//                     className="flex w-full items-center justify-between gap-1 p-2 px-3 transition-all hover:bg-zinc-50"
//                 >
//                     Insert position below
//                     <Icon
//                         icon="majesticons:arrow-down-line"
//                         className="ml-1"
//                         fontSize={16}
//                     />
//                 </button>
//                 <button
//                     onClick={() => setIsEditing(true)}
//                     className="flex w-full items-center justify-between gap-1 bg-blue-50 p-2 px-3 text-blue-500 transition-all hover:bg-blue-100"
//                 >
//                     Assign position
//                     <Icon
//                         icon="zondicons:refresh"
//                         className="ml-1"
//                         fontSize={16}
//                     />
//                 </button>
//                 {position.holderId && (
//                     <button
//                         onClick={() => {
//                             setIsShown(false);
//                             setVacant(position.roleId);
//                         }}
//                         className="flex w-full items-center justify-between gap-1 bg-yellow-50 p-2 px-3 text-yellow-500 transition-all hover:bg-yellow-100"
//                     >
//                         Set vacant
//                         <Icon
//                             icon="iconoir:square-dashed"
//                             className="ml-1"
//                             fontSize={16}
//                         />
//                     </button>
//                 )}
//                 <button
//                     onClick={() => {
//                         deletePosition(position.roleId);
//                     }}
//                     className="flex w-full items-center justify-between gap-1 bg-red-50 p-2 px-3 text-red-500 transition-all hover:bg-red-100"
//                 >
//                     Delete role
//                     <Icon
//                         icon="mdi:alert-outline"
//                         className="ml-1"
//                         fontSize={16}
//                     />
//                 </button>
//                 <Modal
//                     show={isCreating[0]}
//                     onClose={() => setIsCreating([false, "below"])}
//                 >
//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             if (isCreating[1] == "below") {
//                                 insertBelow(position.roleId, roleName);
//                                 setIsCreating([false, "below"]);
//                             }
//                             if (isCreating[1] == "above") {
//                                 insertAbove(position.roleId, roleName);
//                             }
//                             setRoleName("");
//                         }}
//                     >
//                         <div className="flex w-[400px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
//                             <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
//                                 Position
//                                 <Icon
//                                     icon="ic:baseline-star"
//                                     className="ml-1"
//                                     fontSize={10}
//                                 />
//                             </div>
//                             <div className="mt-2 flex w-full items-center justify-between">
//                                 <p className="text-2xl font-bold text-zinc-700">
//                                     Create a position {isCreating[1]}
//                                 </p>
//                             </div>
//                             <div className="mt-4 flex w-full flex-col justify-start gap-1">
//                                 <label className="text-[8px] font-medium text-zinc-300">
//                                     JOB TITLE
//                                 </label>
//                                 <input
//                                     required
//                                     autoCorrect="off"
//                                     spellCheck="false"
//                                     type="text"
//                                     value={roleName ?? ""}
//                                     onChange={(
//                                         e: React.ChangeEvent<HTMLInputElement>
//                                     ) => setRoleName(e.target.value)}
//                                     placeholder="Enter the first name"
//                                     className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
//                                 />
//                             </div>
//                             <div className="mt-4 flex w-full items-center justify-start gap-2">
//                                 <Button
//                                     type="submit"
//                                     disabled={!roleName}
//                                     variant="primary"
//                                 >
//                                     Create position
//                                     <Icon
//                                         icon="ic:baseline-plus"
//                                         className="ml-1"
//                                         fontSize={14}
//                                     />
//                                 </Button>
//                             </div>
//                         </div>
//                     </form>
//                 </Modal>
//                 <Modal show={isEditing} onClose={() => setIsEditing(false)}>
//                     <Assignment
//                         setIsEditing={setIsEditing}
//                         roleName={position.name}
//                         roleId={position.roleId}
//                     />
//                 </Modal>
//             </div>
//         </button>
//     );
// }

// export default function RootTreeNode({
//     tree,
//     depth,
// }: {
//     tree: TreeNode;
//     depth: number;
// }) {
//     // if (tree.position.deletedAt !== null) return null;
//     if (depth == 0 && tree.children)
//         return (
//             <Tree
//                 lineColor="lightgray"
//                 label={<Label position={tree.position} />}
//             >
//                 {tree.children.map((child, index) => (
//                     <RootTreeNode tree={child} depth={1} key={index} />
//                 ))}
//             </Tree>
//         );
//     if (!tree.children)
//         return <TreeNode label={<Label position={tree.position} />} />;
//     else
//         return (
//             <TreeNode label={<Label position={tree.position} />}>
//                 {tree.children.map((child, index) => (
//                     <RootTreeNode tree={child} depth={1} key={index} />
//                 ))}
//             </TreeNode>
//         );
// }
