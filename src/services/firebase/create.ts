"use server";

// Local Imports
import { IUser } from '@/models/user';
import { firestoreAdmin } from '@/lib/firebase/config-admin';
import { retrieveStripeCustomer } from '@/services/stripe/retrieve';
import { generateRandomChars } from '@/utils/generate-random';


// This function will run when a new user signs up using Firebase Auth
async function createUser(uid: string, email: string): Promise<IUser | void> {
    try {
        const referralCode = generateRandomChars(7);
        const randomUsername = generateRandomChars(10);
        const customerId = await retrieveStripeCustomer(null, email, referralCode);

        // Get the user document reference
        const userRef = firestoreAdmin.collection('partners').doc(uid);

        // Create an empty user object with default values
        const emptyUser: IUser = {
            id: uid,
            username: randomUsername,
            email: email,
            stripeCustomerId: customerId,
            authentication: {
                emailVerified: 'verified',
                onboarding: true
            },
            metaData: {
                createdAt: new Date().toISOString(),
            },
        };

        // Use Firestore Admin to write to Firestore (bypasses security rules)
        await userRef.set(emptyUser);

        console.log('User successfully created in Firestore!');
        return emptyUser;
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
    }
}


export { createUser }