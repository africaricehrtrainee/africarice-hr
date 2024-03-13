import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { useObjectivesDataStore } from "../../_store/useStore";
import { NewSelfEvaluation } from "../NewSelfEvaluation";
import { NewEvaluation } from "../NewEvaluation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";

function EvaluationForm() {
    const { employee, setEvaluation, setEvaluationLocal } =
        useObjectivesDataStore();
    const { user } = useAuth();
    const { toast } = useToast();
    const [step] = useQueryState<number>("step", {
        defaultValue: 0,
        parse: parseInt,
    });

    const fetchEvaluations = async () => {
        try {
            const response = await axios.get<Evaluation>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${
                    employee?.employeeId ?? ""
                }/evaluations`
            ); // Adjust the API endpoint
            if (response.data) {
                setEvaluation(response.data);
            } else {
                setEvaluationLocal({
                    employeeId: user?.employeeId,
                    evaluationYear: "2024",
                    supervisorId: employee?.supervisorId
                        ? employee?.supervisorId
                        : -1,
                    evaluationStatus: "draft",
                    selfEvaluationStatus: "draft",
                    supervisorJobTitle: employee?.supervisor?.jobTitle,
                });
            }
        } catch (error) {
            console.error("Error fetching evaluations:", error);
        }
    };

    const postEvaluations = async (evaluation: Partial<Evaluation>) => {
        try {
            axios
                .post(process.env.NEXT_PUBLIC_API_URL + "/api/evaluations/", {
                    evaluation,
                })
                .then((response) => {
                    if (response.status == 201) {
                        console.log("Successfully updated evaluations");
                        fetchEvaluations();
                        toast({
                            description: "Successfully updated evaluations",
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
        } catch (error) {}
    };

    if (!employee || !user) return null;

    return (
        <>
            {step == 3 && (
                <NewSelfEvaluation
                    employee={employee}
                    user={user}
                    onSubmit={postEvaluations}
                />
            )}
            {step == 4 && (
                <NewEvaluation
                    employee={employee}
                    user={user}
                    onSubmit={postEvaluations}
                />
            )}
        </>
    );
}

export default EvaluationForm;
