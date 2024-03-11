import Chip from "@/components/ui/Chip";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useEvaluationDataStore } from "../_store/useStore";
import { set } from "date-fns";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";

function EvaluationForm() {
    const { user } = useAuth();

    const { evaluators, selectedEmployeeId, employee } =
        useEvaluationDataStore();
    const evaluation = evaluators?.find(
        (obj) => obj.evaluatorId == selectedEmployeeId
    );

    if (
        (user?.employeeId == selectedEmployeeId ||
            user?.employeeId == employee?.supervisorId) &&
        evaluation
    )
        return (
            <div className="relative flex max-w-[1100px] flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
                <EvaluationHeader evaluation={evaluation} />
                <EvaluationInput evaluation={evaluation} />
            </div>
        );
}

function EvaluationHeader({ evaluation }: { evaluation: Evaluator360 }) {
    const { employee } = useEvaluationDataStore();
    return (
        <div className="flex w-full flex-col items-start justify-start gap-2">
            <div className="flex w-full items-center justify-between">
                <Chip variant="background">
                    Form
                    <Icon
                        icon="subway:write-1"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
                {evaluation.evaluatorStatus !== "evaluated" ? (
                    <Chip variant="primary">
                        Unsubmitted
                        <Icon
                            icon="ph:circle-dashed"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Chip>
                ) : (
                    <Chip variant="brand">
                        Sent
                        <Icon
                            icon="mdi:check-all"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Chip>
                )}
            </div>
            <p className="text-xl font-bold text-zinc-700">
                {employee?.firstName.split(" ")[0]}&apos;s evaluation
            </p>
        </div>
    );
}

function EvaluationInput({ evaluation }: { evaluation: Evaluator360 }) {
    const { user } = useAuth();
    const data = useEvaluationDataStore();
    const [form, setForm] = useState<Evaluator360>(evaluation);
    const [index, setIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const fields = [
        {
            key: "interpersonalComment",
            question:
                "How does the individual interact with team members and other colleagues? To what extent does he promote collaboration, communication and conflict resolution?",
            questionFr:
                "Comment l'individu interagit-il avec les membres de l'équipe et les autres collègues? Dans quelle mesure favorise-t-il la collaboration, la communication et la résolution des conflits?",
        },
        {
            key: "collaborationComment",
            question:
                "How does the individual communicate with colleagues, peers and subordinates? To what extent does he or she foster a collaborative and open work environment?",
            questionFr:
                "Comment l'individu communique-t-il avec ses collègues, ses pairs et ses subordonnés? Dans quelle mesure favorise-t-il un environnement de travail collaboratif et ouvert?",
        },
        {
            key: "leadershipComment",
            question:
                "To what extent does the individual demonstrate leadership and initiative within the organization? Can you cite situations where he or she has taken proactive steps to solve problems or improve processes?",
            questionFr:
                "Dans quelle mesure l'individu fait-il preuve de leadership et d'initiative au sein de l'organisation? Pouvez-vous citer des situations où il ou elle a pris des mesures proactives pour résoudre des problèmes ou améliorer des processus?",
        },
        {
            key: "commitmentComment",
            question:
                "How does the individual encourage professional and personal development within the team? To what extent does he show an interest in the well-being and growth of his colleagues?",
            questionFr:
                "Comment l'individu encourage-t-il le développement professionnel et personnel au sein de l'équipe? Dans quelle mesure montre-t-il un intérêt pour le bien-être et la croissance de ses collègues?",
        },
        {
            key: "teamworkComment",
            question:
                "How does the individual communicate team goals and individual roles clearly ?",
            questionFr:
                "Comment l'individu communique-t-il clairement les objectifs de l'équipe et les rôles individuels?",
        },
    ];

    async function updateEvaluator360(evaluator: Evaluator360) {
        try {
            if (form && data.evaluation && data.evaluation.evaluation360Id) {
                const id = data.evaluation.evaluation360Id;
                setLoading(true);
                const result = await axios
                    .put(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/evaluator360/${evaluation.evaluator360Id}`,
                        {
                            evaluator,
                        }
                    )
                    .then((res) => {
                        if (res.status == 200) {
                            data.fetchEvaluators(id.toString());
                            toast({
                                title: "Evaluation Sent!",
                                description:
                                    "Successfully sent your evaluation!",
                            });
                            return true;
                        }
                    })
                    .catch((err) => {
                        toast({
                            variant: "destructive",
                            title: "Oops!",
                            description: "Failed to send your evaluation!",
                        });
                        console.log(err);
                        return false;
                    })
                    .finally(() => {
                        setLoading(false);
                    });

                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setForm(evaluation);
    }, [evaluation]);

    return (
        <div className="w-full">
            <div className="mt-1 flex w-full flex-col items-start justify-start gap-2">
                <div className="flex w-full items-start justify-start gap-1">
                    {fields.map((field, i) => {
                        return (
                            <Button
                                onClick={() => setIndex(i)}
                                variant={"outline"}
                                disabled={index == i}
                                type="button"
                                key={i}
                                className="relative flex items-center justify-center rounded-md p-1 px-2 text-xs font-semibold"
                            >
                                {/* @ts-ignore */}
                                {!form[field.key] ? (
                                    <div className="absolute -bottom-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-red-400"></div>
                                ) : (
                                    <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-green-400"></div>
                                )}
                                Section {i + 1}
                            </Button>
                        );
                    })}
                </div>
                <label className="mt-3 text-[10px] font-medium text-zinc-300">
                    EVALUATION SECTION QUESTION
                </label>
                <div className="flex w-full items-center justify-start gap-1">
                    <p className="text-sm font-bold text-zinc-700">
                        {fields[index].question}
                    </p>
                    <p className="text-end text-sm font-bold text-zinc-700">
                        {fields[index].questionFr}
                    </p>
                </div>
                <label className="text-[10px] font-medium text-zinc-300">
                    EVALUATION COMMENT
                    <span className="text-[8px] text-brand">* (required)</span>
                </label>
                <textarea
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={
                        user?.employeeId != evaluation.evaluatorId ||
                        evaluation.evaluatorStatus == "evaluated"
                    }
                    // @ts-ignore
                    value={form[fields[index]["key"]] ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const f = { ...form };
                        // @ts-ignore
                        f[fields[index].key] = e.target.value;
                        setForm(f);
                    }}
                    placeholder={`Answer this question for this staff member`}
                    className="h-[150px] w-full rounded-md border border-zinc-200 p-2 px-3 text-start text-sm font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                />
                <div className="mt-4 flex w-full items-center justify-between">
                    <div className="flex items-center justify-center gap-1">
                        <Button
                            onClick={() => {
                                setIndex(index - 1);
                            }}
                            disabled={index == 0}
                            variant="outline"
                            type="button"
                        >
                            <Icon icon="mdi:arrow-left" fontSize={14} />
                            Previous
                        </Button>
                        <Button
                            type="button"
                            disabled={index == 4}
                            onClick={() => {
                                setIndex(index + 1);
                            }}
                            variant="outline"
                        >
                            Next
                            <Icon icon="mdi:arrow-right" fontSize={14} />
                        </Button>
                    </div>
                    {user?.employeeId == evaluation.evaluatorId && (
                        <div className="flex items-start justify-end gap-1">
                            <Button
                                onClick={() => {
                                    updateEvaluator360(form);
                                }}
                                variant="outline"
                                disabled={
                                    JSON.stringify(form) ===
                                    JSON.stringify(evaluation)
                                }
                                type="button"
                            >
                                Save for later
                                <Icon
                                    icon="material-symbols:download"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    const f = { ...form };
                                    f.evaluatorStatus = "evaluated";
                                    updateEvaluator360(f);
                                }}
                                loading={loading}
                                disabled={
                                    !form.interpersonalComment ||
                                    !form.collaborationComment ||
                                    !form.leadershipComment ||
                                    !form.commitmentComment ||
                                    !form.teamworkComment ||
                                    form.evaluatorStatus == "evaluated"
                                }
                                type="button"
                            >
                                Submit evaluation
                                <Icon
                                    icon="mdi:check-all"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default EvaluationForm;
