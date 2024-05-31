import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios"

const postSettings = async (settings: Setting[]) => {
    try {
        const data = settings.reduce(
            (acc, setting) => {
                // @ts-ignore
                acc[setting.name] = setting.value;
                return acc;
            },
            {}
        )

        const response = await axios.put(
            process.env.NEXT_PUBLIC_API_URL + "/api/settings/",
            data
        );

        return response.data

    } catch (error) {
        console.log(error)
    }
}

export function usePostSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: Setting[]) => postSettings(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        }
    })
}