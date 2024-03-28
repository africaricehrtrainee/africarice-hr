"use client";

import React, { useEffect } from "react";
import { useEvaluationDataStore } from "./_store/useStore";
import { useAuth } from "@/hooks/useAuth";
import EvaluatorsList from "./_components/EvaluatorsList";
import ProfileCard from "@/features/employees/components/ProfileCard";
import EvaluationForm from "./_components/EvaluationForm";
import { useQueryState } from "nuqs";

function Evaluation360({ params }: { params: { userId: string } }) {
    const {
        evaluation,
        evaluators,
        employee,
        setEvaluation,
        setEvaluators,
        fetchEvaluation,
        fetchEvaluators,
        fetchEmployee,
    } = useEvaluationDataStore();

    const { user } = useAuth();
    const [year, setYear] = useQueryState("year", {
        defaultValue: new Date().getFullYear().toString(),
    });

    useEffect(() => {
        fetchEvaluation(params.userId, year);
        fetchEmployee(params.userId);

        return () => {
            setEvaluation(null);
            setEvaluators(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    useEffect(() => {
        if (evaluation) {
            fetchEvaluators(evaluation.evaluation360Id.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [evaluation]);

    if (!employee) {
        return <div>loading...</div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start gap-2 p-4 px-8">
            <div className="flex w-full items-start justify-start gap-2 transition-all">
                <ProfileCard user={employee} />
                <EvaluatorsList evaluation={evaluation} />
            </div>
            <div className="flex w-full items-start justify-center gap-2">
                <EvaluationForm />
            </div>
        </main>
    );
}

export default Evaluation360;
