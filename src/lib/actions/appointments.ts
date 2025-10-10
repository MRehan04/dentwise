"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { AppointmentStatus } from "@prisma/client";

function transformAppointment(appointment: any) {
    return {
        ...appointment,
        patientName: `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
        patientEmail: appointment.user.email,
        doctorName: appointment.doctor.name,
        doctorimageUrl: appointment.doctor.imageUrl || "",
        date: appointment.date.toISOString().split("T")[0], // "YYYY-MM-DD"

    }
}
export async function getAppointments() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                doctor: { select: { name: true, imageUrl: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return appointments
    } catch (error) {
        console.log("Error fetching appointments:", error);
        throw new Error("Failed to fetch appointments")
    }

}

export async function getUserAppointments() {
    try {
        // get authenticated user from Clerk
        const { userId } = await auth();
        if (!userId) throw new Error("You must be logged in to view appointments");

        // find user by clerkId from authenticated session
        const user = await prisma.user.findUnique({ where: { clerk: userId } });
        if (!user) throw new Error("User not found. Please ensure your account is properly set up.");

        const appointments = await prisma.appointment.findMany({
            where: { userId: user.id },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                doctor: { select: { name: true, imageUrl: true } },
            },
            orderBy: [{ date: "asc" }, { time: "asc" }],
        });

        return appointments.map(transformAppointment);
    } catch (error) {
        console.error("Error fetching user appointments:", error);
        throw new Error("Failed to fetch user appointments");
    }
}


export async function getUserAppointmentStats() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("You must be authenticated");

        // these calls will run in parallel, instead of waiting each other
        const user = await prisma.user.findUnique({ where: { clerk: userId } });
        if (!user) throw new Error("User not found");

        const [totalCount, completedCount] = await Promise.all([
            prisma.appointment.count({
                where: { userId: user.id },
            }),
            prisma.appointment.count({
                where: {
                    userId: user.id,
                    status: "COMPLETED",
                },
            }),
        ]);

        return {
            totalAppointments: totalCount,
            completedAppointments: completedCount,
        }
    } catch (error) {
        console.log("Error fetching user appointment stats:", error);
        return { totalAppointments: 0, completedAppointments: 0 }
    }
}

export async function updateAppointmentStatus(input: { id: string; status: AppointmentStatus }) {
    try {
        const appointment = await prisma.appointment.update({
            where: { id: input.id },
            data: { status: input.status },
        });

        return appointment;
    } catch (error) {
        console.log("Error updating appointment status:", error);
        throw new Error("Failed to update appointment status");
    }
}