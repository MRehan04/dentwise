"use server";

import { currentUser } from "@clerk/nextjs/server";
import Prisma from "../prisma";

export async function syncUser() {

    try {
        const user = await currentUser();
        if (!user) return ;

        const existingUser = await Prisma.user.findUnique({ where: { clerk: user.id } });
        if (existingUser) return existingUser;

        const dbUser = await Prisma.user.create({
            data: {
                clerk: user.id,
                firstName: user.firstName,
                lastName: user.firstName,
                email: user.emailAddresses[0].emailAddress,
                phone: user.phoneNumbers[0]?.phoneNumber,
            }

        })

        return dbUser;

    } catch (error) {
        console.log("Error in syncUser server action", error);
    }
}