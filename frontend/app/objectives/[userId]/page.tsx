"use client";
import Chip from "@/components/ui/Chip";
import { useEffect, useState } from "react";
import ObjectiveList from "@/features/objectives/components/ObjectiveList";
import { NewObjective } from "../../../features/objectives/components/NewObjective";
import { CommentList } from "../../../features/comments/components/CommentList";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useObjectivesDataStore } from "./_store/useStore";
import { useToast } from "@/components/ui/use-toast";
import Evaluation from "../../../features/evaluations/components/Evaluation/Evaluation";
import { useQueryState } from "nuqs";
import ProfileCard from "@/features/employees/components/ProfileCard";
import { Schedule } from "../../../features/steps/components/Schedule";

export default function Objectives({ params }: { params: { userId: string } }) {
    const { toast } = useToast();
    const { user } = useAuth();

    const [comments, setComments] = useState<Comment[] | null>(null);
    const [year, setYear] = useQueryState("year");
    const [step, setStep] = useQueryState<number>("step", {
        defaultValue: 0,
        parse: (value) => parseInt(value),
    });
    const data = useObjectivesDataStore();

    async function fetchStep() {
        axios
            .get<Step[]>(process.env.NEXT_PUBLIC_API_URL + "/api/steps/", {})
            .then((response) => {
                if (response.data) {
                    console.log("steps", response.data);
                    data.setEvaluationSteps(
                        response.data.sort((a, b) => a.stepId - b.stepId)
                    );
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (data.employee.supervisorId === user?.employeeId) {
                if (step === 0) {
                    setStep(1);
                }
            }
            if (data.employee.employeeId === user?.employeeId) {
                if (step === 1) {
                    setStep(0);
                }
            }
            fetchEvaluations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.employee, user]);


    return (
        // <ProtectedRoute>
        <main className="flex min-h-screen flex-col items-start justify-start gap-2 p-4 px-8">
            {data.objectivesLocal !== null &&
                data.employee !== null &&
                comments !== null ? (
                data.evaluationLocal != null &&
                user &&
                data.employee &&
                data.evaluationSteps.length > 0 && (
                    <>
                        {/* Top Row */}
                        <div className="flex w-full gap-2 transition-all">
                            {data.employee && (
                                <ProfileCard user={data.employee} />
                            )}
                            <Schedule fetch={fetchStep} />
                        </div>
                        {/* Main row */}
                        {(step == 0 || step == 1 || step == 2) && (
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
                                {step !== 2 ? (
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
                                ) : (
                                    <></>
                                )}
                            </div>
                        )}

                        {(step == 3 || step == 4) && <Evaluation />}
                    </>
                )
            ) : (
                <></>
            )}
        </main>
    );
}
