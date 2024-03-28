import { skipToken, useQuery } from "@tanstack/react-query";
import axios from "axios";

const getObjectives = async (employeeId: number, year: string) => {
    try {
        const response = await axios.get<Objective[]>(
            process.env.NEXT_PUBLIC_API_URL +
                "/api/employees/" +
                employeeId +
                "/objectives", {
                    params: {
                        year
                    }
                }
        );
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export function useGetObjectives(employeeId: number | undefined, year: string | undefined) {
    year = year || new Date().getFullYear().toString();
    return useQuery({
        queryKey: ["objectives", employeeId, year],
        queryFn: employeeId ? () => getObjectives(employeeId, year) : skipToken,
    });
}