import { skipToken, useQuery } from "@tanstack/react-query";
import axios from "axios";

const getSubordinates = async (employeeId: number) => {
    const response = await axios.get<Employee[]>(
        process.env.NEXT_PUBLIC_API_URL +
            "/api/employees/" +
            employeeId +
            "/subordinates"
    );
    return response.data;
};

export function useGetSubordinates(employeeId: number | undefined) {
    return useQuery({
        queryKey: ["subordinates", employeeId],
        queryFn: employeeId ? () => getSubordinates(employeeId) : skipToken,
    });
}
