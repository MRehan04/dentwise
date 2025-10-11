"use-client";

import { createDoctor, getDoctors, updateDoctor, getAvailableDoctors } from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetDoctors() {
    const result = useQuery({
        queryKey: ["getDoctors"],
        queryFn: getDoctors,
    });
    return result;

}

export function useCreateDoctor() {
    const queryClient = useQueryClient();

    const result = useMutation({
        mutationFn: createDoctor,
        onSuccess: () => {
            // invalide related queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
        },
        onError: () => console.log("Error while creating a doctor"),
    });

    return result;
}

// get available doctors for appointments
export function useAvailableDoctors() {
    const result = useQuery({
        queryKey: ["getAvailableDoctors"],
        queryFn: getAvailableDoctors,
    });

    return result;
}

export function useUpdateDoctor() {
    const queryClient = useQueryClient();

    const result = useMutation({
        mutationFn: updateDoctor,
        onSuccess: () => {
            // invalide related queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableDoctors"] });
        },
        onError: (error) => console.error("Faoled to update doctor:",error),
    });

    return result;
}