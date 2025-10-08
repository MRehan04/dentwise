"use server";

import { prisma } from "../prisma";
import { Gender } from "@prisma/client";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

export async function getDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                _count: { select: { appointments: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return doctors.map((doctor) => ({
            ...doctor,
            appointmentCount: doctor._count.appointments,
        }));
    } catch (error) {
        console.log("Error fetching doctors:", error);
        throw new Error("Failed to fetch doctors");
    }
}

interface createDoctorInput {
    name: string;
    email: string;
    phone: string;
    speciality: string;
    gender: string;
    isActive: boolean;
}
export async function createDoctor(input: createDoctorInput) {
    try {
        if (!input.name || !input.email) throw new Error("Name and email are required")

        const doctor = await prisma.doctor.create({
            data: {
                ...input,
                gender: input.gender as Gender,
                imageUrl: generateAvatar(input.name, input.gender as "MALE" | "FEMALE")
            },
        });

        revalidatePath("/admin");

        return doctor;
    } catch (error: any) {
        console.log("Error creating doctor:", error);

        //handle unique constraint vialation (email already exist)
        if (error?.code === "P2002") {
            throw new Error("A doctor with this email already exists")
        }
    }

}

interface updateDoctorInput extends Partial<createDoctorInput> {
    id: string;
}


export async function updateDoctor(input: updateDoctorInput) {
    try {
        // validate
        if (!input.name || !input.email) throw new Error("Name and email are required");

        const currentDoctor = await prisma.doctor.findUnique({
            where: { id: input.id },
            select: { email: true },
        });

        if (!currentDoctor) throw new Error("Doctor not found ");

        // if emial is changing, check if the email already exists        
        if (input.email !== currentDoctor.email) {
            const existingDoctor = await prisma.doctor.findUnique({
                where: { email: input.email },
            });

            if (existingDoctor) {
                throw new Error("A doctor")
            }
        }

        const doctor = await prisma.doctor.update({
            where: { id: input.id },
            // ...input is going to trigger the unique constraint violation for email
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                speciality: input.speciality,
                gender: input.gender as Gender,
                isActive: input.isActive,
            },
        });

        return doctor;
    } catch (error) {
        console.error("Error updating doctor:", error);
        throw new Error("Failed to update doctor");
    }
}

export async function getAvailableDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { appointments: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return doctors.map((doctor) => ({
            ...doctors,
            appointmentCount: doctor._count.appointments,
        }));
    } catch (error) {
        console.error("Error fetching available doctors:", error);
        throw new Error("Failed to fetch available doctors");
    }
}