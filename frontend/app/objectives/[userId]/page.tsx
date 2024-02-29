"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState } from "react";
import ObjectiveList from "@/app/objectives/[userId]/_components/ObjectiveList";
import { NewObjective } from "./_components/NewObjective";
import { cn } from "@/util/utils";
import { CommentList } from "./_components/CommentList";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Modal from "@/components/ui/Modal";
import EditStep from "@/app/objectives/[userId]/_components/EditStep";
import { selectActiveStep, useObjectivesDataStore } from "./_store/useStore";
import { useToast } from "@/components/ui/use-toast";
import Evaluation from "./_components/Evaluation/Evaluation";
import HistoryList from "./_components/HistoryList";
import { useRouter, usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { getYear } from "date-fns";

export default function Objectives({ params }: { params: { userId: string } }) {
    const { toast } = useToast();
    const { user } = useAuth();

    const [comments, setComments] = useState<Comment[] | null>(null);
    const [year, setYear] = useQueryState("year");

    const data = useObjectivesDataStore();

    async function fetchStep() {
        axios
            .get<Step[]>(process.env.NEXT_PUBLIC_API_URL + "/api/steps/", {})
            .then((response) => {
                if (response.data) {
                    console.log("steps", response.data);
                    data.setEvaluationSteps(response.data);
                } else {
                    data.setEvaluationSteps([]);
                }
            })
            .catch((err) => console.log(err));
    }

    async function fetchObjectives() {
        axios
            .get<Objective[]>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/objectives",
                {
                    params: {
                        year,
                    },
                }
            )
            .then((response) => {
                if (response.data.length > 0) {
                    data.setObjectives(response.data);
                    console.log("objectives", response.data[0]);
                } else {
                    data.setObjectives([]);
                }
            })
            .catch((err) => console.log(err));
    }

    async function fetchUser() {
        axios
            .get<Employee>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/supervisors"
            )
            .then((response) => {
                if (response.data) {
                    console.log("employee", response.data);
                    data.setEmployee(response.data);
                } else {
                }
            })
            .catch((err) => console.log(err));
    }

    async function fetchComments() {
        axios
            .get<Comment[]>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/comments"
            )
            .then((response) => {
                console.log("comments", response.data);
                if (response.data[0].commentId) {
                    data.setComments(response.data);
                } else {
                    data.setComments([]);
                }
            })
            .catch((err) => console.log(err));
    }

    const fetchEvaluations = async () => {
        try {
            const response = await axios.get<Evaluation>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${params.userId}/evaluations`
            ); // Adjust the API endpoint
            if (response.data) {
                data.setEvaluation(response.data);
            } else {
                data.setEvaluationLocal({
                    employeeId: parseInt(params.userId),
                    evaluationYear: "2024",
                    supervisorId: data.employee?.supervisorId
                        ? data.employee?.supervisorId
                        : -1,
                    evaluationStatus: "draft",
                    selfEvaluationStatus: "draft",
                    supervisorJobTitle: data.employee?.supervisor?.jobTitle,
                });
            }
        } catch (error) {
            console.error("Error fetching evaluations:", error);
        }
    };

    function postObjectives(objectives: Partial<Objective>[]) {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/api/objectives/", {
                objective: objectives,
            })
            .then((response) => {
                if (response.status == 201) {
                    fetchObjectives();
                    toast({
                        description: "Successfully updated objectives",
                    });
                    ``;
                }
            })
            .catch((err) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                console.log(err);
            });
    }

    function init() {
        fetchUser();
        fetchObjectives();
        fetchComments();
        fetchStep();
    }

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            console.log("Cleaning up");
            data.reset();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchEvaluations();
        fetchObjectives();
    }, [year]);
    useEffect(() => {
        if (
            JSON.stringify(data.objectives) !==
            JSON.stringify(data.objectivesLocal)
        ) {
            const obj = JSON.parse(JSON.stringify(data.objectives));
            data.setObjectivesLocal(obj);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.objectives]);

    useEffect(() => {
        const arr = data.comments.map((a) => ({ ...a }));
        setComments(arr);
    }, [data.comments]);

    useEffect(() => {
        if (
            JSON.stringify(data.evaluation) !==
            JSON.stringify(data.evaluationLocal)
        ) {
            const obj = JSON.parse(JSON.stringify(data.evaluation));
            data.setEvaluationLocal(obj);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.evaluation]);

    useEffect(() => {
        if (data.employee) {
            fetchEvaluations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.employee]);

    useEffect(() => {}, []);
    return (
        // <ProtectedRoute>
        <main className="flex min-h-screen flex-col items-start justify-start gap-2 p-4 px-8">
            {data.objectivesLocal !== null &&
            data.employee !== null &&
            comments !== null ? (
                data.evaluationLocal != null &&
                user &&
                data.employee &&
                data.evaluationSteps && (
                    <>
                        {/* Top Row */}
                        <div className="flex w-full gap-2 transition-all">
                            {data.employee && <Profile user={data.employee} />}
                            <Schedule fetch={fetchStep} />
                        </div>
                        {/* Main row */}
                        {(data.selectedEvaluationStep == 0 ||
                            data.selectedEvaluationStep == 1 ||
                            data.selectedEvaluationStep == 2) && (
                            <div className="flex w-full gap-2">
                                {/* Sidebar with objective list */}
                                <ObjectiveList
                                    employee={data.employee}
                                    onSubmit={postObjectives}
                                    objectives={data.objectivesLocal}
                                />
                                {/* Main objective form */}
                                <NewObjective
                                    employee={data.employee}
                                    objectives={data.objectivesLocal}
                                />
                                {/* List of comments of the supervisor */}
                                <CommentList
                                    user={user}
                                    employee={data.employee}
                                    objectives={data.objectivesLocal}
                                    // @ts-expect-error
                                    setComments={setComments}
                                    comments={comments}
                                    cache={data.comments}
                                    fetch={fetchComments}
                                />
                                {/* Version history of the objective */}
                                <HistoryList
                                    user={user}
                                    employee={data.employee}
                                    objectives={data.objectivesLocal}
                                />
                            </div>
                        )}

                        {(data.selectedEvaluationStep == 3 ||
                            data.selectedEvaluationStep == 4) && <Evaluation />}
                    </>
                )
            ) : (
                <></>
            )}
        </main>
        // </ProtectedRoute>
    );
}

function Profile({ user }: { user: Employee }) {
    return (
        <div className="ml-auto flex w-[400px] items-start justify-evenly gap-4 rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <Chip variant={"background"} className="font-mono">
                    {user.matricule}
                </Chip>
                <div className="te flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">
                    {user.firstName && user.lastName
                        ? user.lastName.charAt(0) + user.firstName.charAt(0)
                        : ""}
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        NAME
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {user.firstName && user.lastName
                            ? user.lastName + " " + user.firstName.split(" ")[0]
                            : ""}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        Position
                    </p>
                    <p className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-zinc-700">
                        {user.jobTitle ?? "..."}
                    </p>
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+1)
                    </p>
                    <p className="whitespace-nowrap text-xs font-bold text-zinc-700">
                        {user.supervisor
                            ? user.supervisor.lastName +
                              " " +
                              user.supervisor.firstName.split(" ")[0]
                            : "..."}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+2)
                    </p>
                    <p className="whitespace-nowrap text-xs font-bold text-zinc-700">
                        {user.supervisor && user.supervisor.supervisor
                            ? user.supervisor.supervisor.lastName +
                              " " +
                              user.supervisor.supervisor.firstName.split(" ")[0]
                            : "..."}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Step({
    step,
    postSteps,
    index,
}: {
    step: Step;
    postSteps: (number: number) => any;
    index: number;
}) {
    const data = useObjectivesDataStore();
    const activeStep = useObjectivesDataStore(selectActiveStep);
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        setIsOpen(false);
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [divRef]);

    return (
        <>
            {user && (
                <div className="relative flex items-center justify-center gap-4">
                    <Modal
                        show={isEditingMessage}
                        onClose={() => setIsEditingMessage(false)}
                    >
                        <EditStep
                            step={step}
                            onFormSubmit={(success) => {
                                if (success) {
                                    setIsEditingMessage(false);
                                } else {
                                }
                            }}
                        />
                    </Modal>

                    <button
                        onContextMenu={(e) => {
                            e.preventDefault();
                            if (user.role == "hr") {
                                setIsOpen(true);
                            }
                        }}
                        onClick={(e) => {
                            if (activeStep >= index) {
                                data.setSelectedEvaluationStep(index);
                            }
                        }}
                        className={cn(
                            "p-2 px-4 border-transparent rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-95 bg-transparent border-zinc-200 text-zinc-500 hover:bg-zinc-50 ",
                            `${activeStep < index && "opacity-50"}`,
                            `${
                                data.selectedEvaluationStep == index &&
                                "bg-white text-zinc-800 border-green-300 shadow-sm"
                            }`
                        )}
                    >
                        {step.name}
                        <p className="-mt-0 text-[8px]">
                            from{" "}
                            {step.dateFrom.substring(8, 10) +
                                "/" +
                                step.dateFrom.substring(5, 7)}{" "}
                            to{" "}
                            {step.dateTo.substring(8, 10) +
                                "/" +
                                step.dateTo.substring(5, 7)}
                        </p>
                    </button>

                    <div
                        ref={divRef}
                        className={
                            "absolute left-0 flex flex-col justify-start items-start min-w-full top-full mt-2 rounded-sm border border-zinc-200 bg-white shadow-sm transition-all z-10 " +
                            `${
                                isOpen
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 invisible -translate-y-4"
                            }`
                        }
                    >
                        <button
                            onClick={() => {
                                setIsEditingMessage(true);
                            }}
                            className={
                                "rounded-lg whitespace-nowrap p-2 px-3 text-xs font-bold transition-all hover:text-zinc-800 text-zinc-800 hover:bg-zinc-50 active:scale-90 flex items-center justify-between gap-4 group w-full "
                            }
                        >
                            Edit evaluation step
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 1024 1024"
                            >
                                <path
                                    fill="currentColor"
                                    d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32m-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function Schedule({ fetch }: { fetch: () => any }) {
    const data = useObjectivesDataStore();
    const activeStep = useObjectivesDataStore(selectActiveStep);
    const router = useRouter();
    const [year, setYear] = useQueryState("year");

    const { toast } = useToast();
    const postSteps = async (index: number) => {
        const id = data.evaluationSteps[index].stepId;
        await axios
            .put(`${process.env.NEXT_PUBLIC_API_URL}/api/steps/${id}/current`)
            .then((response) => {
                if (response.status == 200) {
                    fetch();
                    toast({
                        description: "Updated successfully",
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="flex w-full flex-1 items-center justify-between rounded-md border border-zinc-200 bg-white p-4 text-center shadow-sm transition-all">
            <div className="flex flex-col items-start justify-start gap-2">
                <div className="">
                    <Select
                        defaultValue={year ?? getYear(new Date()).toString()}
                        onValueChange={(value) => setYear(value)}
                    >
                        <SelectTrigger className="w-[120px] border border-zinc-100 shadow-sm">
                            <SelectValue placeholder="Pick term" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024-2025</SelectItem>
                            <SelectItem value="2023">2023-2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-full items-center justify-start gap-2 rounded-md bg-zinc-100 p-1">
                    {data.evaluationSteps
                        .sort((a, b) => a.stepId - b.stepId)
                        .map((stepObj, index) => (
                            <>
                                <Step
                                    key={stepObj.name}
                                    step={stepObj}
                                    postSteps={postSteps}
                                    index={index as number}
                                />
                                {/* {index < data.evaluationSteps.length - 1 && (
                                    <>
                                        <div
                                            className={
                                                "h-2 w-2 rounded-full" +
                                                (activeStep > index
                                                    ? " bg-zinc-300"
                                                    : " bg-zinc-100")
                                            }
                                        ></div>
                                    </>
                                )} */}
                            </>
                        ))}
                </div>
            </div>
        </div>
    );
}
