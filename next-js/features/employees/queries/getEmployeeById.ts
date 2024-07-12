import axios from "axios";
import { skipToken, useQuery } from "@tanstack/react-query";

export const getEmployeeById = async (employeeId: number) => {
	try {
		const response = await axios.get<Employee>(
			`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${employeeId}`
		);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export function useGetEmployeeById(employeeId: number | undefined) {
	return useQuery({
		queryKey: ["employee", employeeId],
		queryFn: employeeId ? () => getEmployeeById(employeeId) : skipToken,
	});
}
