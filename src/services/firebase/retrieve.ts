// Local Imports
import { IUser } from "@/models/user";
import { firestore } from "@/lib/firebase/config";

// External Imports
import { doc, getDoc } from 'firebase/firestore';


/**
 * Retrieves a user from Firestore using their UID. If the user does not exist, it creates a new user.
 * 
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<IUser | void>} - Returns the user data if found or created, otherwise void.
 * @throws {Error} - Throws an error if email is required but not provided.
 */
async function retrieveUser(uid: string): Promise<IUser | void> {
    try {
        // Retrieve the user document from Firestore using the UID
        const userRef = doc(firestore, 'partners', uid);
        const userDoc = await getDoc(userRef);

        // Check if the user document exists
        if (userDoc.exists()) {
            // Return the user data as an IUser object
            return userDoc.data() as IUser;
        } else {
                throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
    }
}


export { retrieveUser };