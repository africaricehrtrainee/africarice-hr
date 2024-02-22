import React, { useState } from "react";

interface HistoryListProps {
    user: Employee;
    employee: Employee;
    objectives: Partial<Objective>[];
}

function HistoryList({ user, employee, objectives }: HistoryListProps) {
    const [previousObjectives, setPreviousObjectives] = useState<
        Partial<Objective>[]
    >([]);
    if (previousObjectives.length == 0) return null;
    return <div>HistoryList</div>;
}

export default HistoryList;
