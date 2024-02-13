// "use client";
// import { getCurrentMySQLDate, xlsxToJsonArray } from "@/util/utils";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import axios from "axios";
// import dynamic from "next/dynamic";
// import { useState, useEffect, useRef, useLayoutEffect } from "react";
// import panzoom, { PanZoom } from "panzoom";
// import Button from "@/components/ui/Button";
// import {
//     selectTree,
//     useOrganogramDataStore,
// } from "@/app/management/organogram/_store/useStore";

// const RootTreeNode = dynamic(() => import("./RootTreeNode"), {
//     ssr: false,
// });

// export default function OrgChart() {
//     const { positionsLocal, setPositionsLocal, positions, setPositions } =
//         useOrganogramDataStore();
//     const tree = useOrganogramDataStore(selectTree);
//     const elementRef = useRef(null);
//     const panzoomRef = useRef<PanZoom>(null);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const fileInputRef = useRef<HTMLInputElement | null>(null);
//     // Set up panzoom on mount, and dispose on unmount
//     useLayoutEffect(() => {
//         // @ts-ignore
//         panzoomRef.current = panzoom(elementRef.current, {
//             minZoom: 0.8,
//             maxZoom: 1.5,
//             pinchSpeed: 0.2,
//             zoomDoubleClickSpeed: 1,
//         });

//         panzoomRef.current.on("pan", () => console.log("Pan!"));
//         panzoomRef.current.on("zoom", () => console.log("Zoom!"));

//         return () => {
//             panzoomRef?.current?.dispose();
//         };
//     }, []);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = event.target.files && event.target.files[0];

//         // Handle the selected file as needed
//         if (selectedFile) {
//             const reader = new FileReader();

//             reader.onload = (e) => {
//                 if (e.target?.result) {
//                     const data = e.target.result as ArrayBuffer;
//                     // Process the file data using xlsx or any other library
//                     const arr = xlsxToJsonArray(data) as Omit<
//                         Employee,
//                         "employeeId"
//                     >[];
//                     if (arr.length > 0) {
//                         postEmployees(arr);
//                     }
//                 }
//             };

//             reader.readAsArrayBuffer(selectedFile);
//         }
//     };

//     const handleUploadClick = () => {
//         if (fileInputRef.current) {
//             fileInputRef.current.click();
//         }
//     };
//     async function postEmployees(employees: Omit<Employee, "employeeId">[]) {
//         console.log(positionsLocal);
//         axios
//             .post(process.env.NEXT_PUBLIC_API_URL + "/api/employees/all", {
//                 employees,
//             })
//             .then((response) => {
//                 if (response.status == 201) {
//                     fetchPositions();
//                     alert("Employees updated successfully");
//                 }
//             })
//             .catch((err) => console.log(err));
//     }

//     async function fetchPositions() {
//         axios
//             .get<Position[]>(
//                 process.env.NEXT_PUBLIC_API_URL + "/api/positions/"
//             )
//             .then((response) => {
//                 if (response.data.length > 0) {
//                     console.log(response.data);
//                     setPositions([...response.data]);
//                 } else {
//                     setPositions([
//                         {
//                             createdAt: getCurrentMySQLDate(),
//                             deletedAt: null,
//                             firstName: null,
//                             lastName: null,
//                             holderId: null,
//                             name: "New position",
//                             roleId: Math.random() * 10000,
//                             supervisorId: null,
//                             updatedAt: getCurrentMySQLDate(),
//                         },
//                     ]);
//                 }
//             })
//             .catch((err) => console.log(err));
//     }

//     async function postPositions() {
//         console.log(positionsLocal);
//         axios
//             .post(process.env.NEXT_PUBLIC_API_URL + "/api/positions/all", {
//                 positions: tree,
//             })
//             .then((response) => {
//                 if (response.status == 201) {
//                     fetchPositions();
//                     alert("Positions updated successfully");
//                 }
//             })
//             .catch((err) => console.log(err));
//     }

//     useEffect(() => {
//         fetchPositions();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     useEffect(() => {
//         if (positions) {
//             setPositionsLocal(positions.map((a) => ({ ...a })));
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [positions]);

//     useEffect(() => {
//         console.log(positionsLocal);
//     }, [positionsLocal]);

//     return (
//         <div className="relative flex h-[500px] w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
//             <div className="absolute left-4 top-4 z-10 flex flex-col items-start justify-start">
//                 <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-purple-100 p-1 px-2 text-[8px] font-semibold text-purple-700">
//                     Organization
//                     <Icon
//                         icon="fluent:organization-12-filled"
//                         className="ml-1"
//                         fontSize={10}
//                     />
//                 </div>
//                 <div className="mt-2 flex w-full items-center justify-between">
//                     <p className="text-2xl font-bold text-zinc-700">
//                         Organizational Chart
//                     </p>
//                 </div>
//             </div>
//             <div ref={elementRef}>
//                 {tree && (
//                     <div className="flex gap-2">
//                         {tree.map((root, index) => (
//                             <RootTreeNode tree={root} depth={0} key={index} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//             {/* Organogram Controls */}
//             <div className="absolute right-4 top-4 flex items-center justify-center gap-2">
//                 <input
//                     type="file"
//                     style={{ display: "none" }}
//                     onChange={handleFileChange}
//                     ref={fileInputRef}
//                 ></input>
//                 <Button
//                     className=""
//                     onClick={() => handleUploadClick()}
//                     variant="alternate"
//                 >
//                     Upload filesheet
//                     <Icon
//                         icon="mingcute:upload-3-fill"
//                         className="ml-1"
//                         fontSize={16}
//                     />
//                 </Button>
//                 <Button
//                     className=""
//                     onClick={() => {
//                         panzoomRef.current?.zoomTo(0, 0, 1);
//                         panzoomRef.current?.smoothMoveTo(0, 0);
//                     }}
//                     variant="alternateOutline"
//                 >
//                     Center organogram
//                     <Icon icon="fe:target" className="ml-1" fontSize={16} />
//                 </Button>
//             </div>
//             {/* Version Controls */}
//             <div className="absolute bottom-4 right-4 flex items-center justify-start gap-2">
//                 <Button
//                     className=""
//                     disabled={
//                         !positionsLocal ||
//                         JSON.stringify(positions) ===
//                             JSON.stringify(positionsLocal)
//                     }
//                     onClick={() => {
//                         if (positions) {
//                             setPositionsLocal(positions.map((a) => ({ ...a })));
//                         }
//                     }}
//                     variant="alert"
//                 >
//                     Undo changes
//                     <Icon
//                         icon="ic:baseline-undo"
//                         className="ml-1"
//                         fontSize={14}
//                     />
//                 </Button>
//                 <Button
//                     className=""
//                     disabled={
//                         !positionsLocal ||
//                         JSON.stringify(positions) ===
//                             JSON.stringify(positionsLocal)
//                     }
//                     onClick={() => postPositions()}
//                     variant="primary"
//                 >
//                     Apply changes
//                     <Icon
//                         icon="heroicons-solid:save"
//                         className="ml-1"
//                         fontSize={14}
//                     />
//                 </Button>
//             </div>
//         </div>
//     );
// }
