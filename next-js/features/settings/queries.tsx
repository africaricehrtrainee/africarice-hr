import { skipToken, useQuery } from "@tanstack/react-query";
import axios from "axios";

const getSettings = async () => {
    try {
        const response = await axios.get<Settings>(
            process.env.NEXT_PUBLIC_API_URL +
            "/api/settings/",
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export function useGetSettings(
) {
    return useQuery({
        queryKey: ["settings"],
        queryFn: () => getSettings(),
    });
}
