import { skipToken, useQuery } from "@tanstack/react-query";
import axios from "axios";

const getEvaluations = async (employeeId: number, year: string) => {
	try {
		const response = await axios.get<Evaluation>(
			process.env.NEXT_PUBLIC_API_URL +
				"/api/employees/" +
				employeeId +
				"/evaluations",
			{
				params: {
					year,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export function useGetEvaluations(
	employeeId: number | undefined,
	year: string | undefined
) {
	let curYear = year ?? new Date().getFullYear().toString();
	return useQuery({
		queryKey: ["evaluations", employeeId, year],
		queryFn: employeeId
			? () => getEvaluations(employeeId, curYear)
			: skipToken,
	});
}
