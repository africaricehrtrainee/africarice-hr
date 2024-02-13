import React, { useEffect } from "react";
import EvaluationSidebar from "./EvaluationSidebar";
import { useObjectivesDataStore } from "../../_store/useStore";
import EvaluationForm from "./EvaluationForm";
import { NewObjective } from "../NewObjective";

function Evaluation() {
    const {
        selectedObjectiveIndex,
        employee,
        objectivesLocal,
        setSelectedObjectiveIndex,
    } = useObjectivesDataStore();

    useEffect(() => {
        setSelectedObjectiveIndex(-1);
        return () => {
            setSelectedObjectiveIndex(-1);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!employee) return null;
    return (
        <div className="flex h-full w-full justify-start gap-2">
            {/* Sidebar w/ ObjectiveList & Evaluation */}
            <EvaluationSidebar />
            {/* Main Component */}
            <div className="relative flex h-[600px] w-full flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
                {selectedObjectiveIndex !== -1 ? (
                    <NewObjective
                        className="h-full w-full border-none p-0 shadow-none"
                        employee={employee}
                        objectives={objectivesLocal}
                    />
                ) : (
                    <EvaluationForm />
                )}
            </div>
        </div>
    );
}

export default Evaluation;
