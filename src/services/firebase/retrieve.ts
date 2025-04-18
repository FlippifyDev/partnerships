// Local Imports
import { IUser } from "@/models/user";
import { firestore } from "@/lib/firebase/config";
import { createUser } from "./create";

// External Imports
import { doc, getDoc } from 'firebase/firestore';


/**
 * Retrieves a user from Firestore using their UID. If the user does not exist, it creates a new user.
 * 
 * @param {string} uid - The unique identifier of the user.
 * @param {string | null} [email] - The email address of the user (required if creating a new user).
 * @returns {Promise<IUser | void>} - Returns the user data if found or created, otherwise void.
 * @throws {Error} - Throws an error if email is required but not provided.
 */
async function retrieveUserAndCreate(uid: string, email?: string | null): Promise<IUser | void> {
    try {
        // Retrieve the user document from Firestore using the UID
        const userRef = doc(firestore, 'partners', uid);
        const userDoc = await getDoc(userRef);

        // Check if the user document exists
        if (userDoc.exists()) {
            // Return the user data as an IUser object
            const userData: IUser = userDoc.data() as IUser;
            return userData;
        } else {
            if (!email) {
                throw new Error('Email is required to create a new user');
            };
            return await createUser(uid, email)
        }
    } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
    }
}


export { retrieveUserAndCreate };