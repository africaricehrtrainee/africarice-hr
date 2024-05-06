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
        initialData: {
            SETTING_MIN_OBJ: "3",
            SETTING_MAX_OBJ: "5",
            SETTING_MIN_CHAR: "200",
            SETTING_MAX_CHAR: "250",
            EVALUATION_QUESTION_1: "",
            EVALUATION_QUESTION_2: "",
            EVALUATION_QUESTION_3: "",
            EVALUATION_QUESTION_4: "",
            EVALUATION_QUESTION_5: "",
        }
    });
}
