"use server"


import { IUser } from "@/models/user";
import { firestoreAdmin } from "@/lib/firebase/config-admin";

async function retrieveUserAdmin(uid: string): Promise<IUser | void> {
    const userDocRef = firestoreAdmin.collection('partners').doc(uid)
    const userDocSnapshot = await userDocRef.get();

    if (userDocSnapshot.exists) {
        return userDocSnapshot.data() as IUser;
    } else {
        console.error('User document not found.');
    }
}


export { retrieveUserAdmin }