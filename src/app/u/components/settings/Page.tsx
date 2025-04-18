"use client";

import { useState } from "react";
import { IUser } from "@/models/user";
import { auth, firestore } from "@/lib/firebase/config";
import {
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateStripeCustomerEmail } from "@/services/stripe/update";
import { validateEmailInput } from "@/utils/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


// Helper Functions (unchanged)
async function updateUserEmail(
    newEmail: string,
    currentPassword: string,
    setNewEmailMessage: (value: string) => void,
    setEmailSuccessfullyUpdated: () => void
): Promise<{ success: boolean; error?: string }> {
    let success = false;
    let error = "";

    if (!auth.currentUser) {
        return { success, error: "No authenticated user found." };
    }

    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        setNewEmailMessage("Please verify your new email address.");
        await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

        const interval = setInterval(async () => {
            await auth.currentUser?.reload();
            if (auth.currentUser?.emailVerified) {
                clearInterval(interval);
                const userRef = doc(firestore, "partners", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                const user = userDoc.data() as IUser;
                await updateStripeCustomerEmail(user.stripeCustomerId, newEmail);
                await updateDoc(userRef, {
                    email: newEmail,
                });
                setNewEmailMessage("");
                setEmailSuccessfullyUpdated();
                success = true;
            }
        }, 5000);
    } catch (err) {
        error = `Error updating email: ${err}`;
    }

    return { success, error };
}

async function updateUserPassword(
    newPassword: string,
    currentPassword: string,
    setNewPasswordMessage: (value: string) => void,
    setPasswordSuccessfullyUpdated: () => void
): Promise<{ success: boolean; error?: string }> {
    let success = false;
    let error = "";

    if (!auth.currentUser) {
        return { success, error: "No authenticated user found. If you just changed your email you must sign out and back in again." };
    }

    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        setPasswordSuccessfullyUpdated();
        success = true;
    } catch (err) {
        error = `Error updating password: ${err}`;
    }

    return { success, error };
}

// UpdateEmail Component (unchanged)
const UpdateEmail = () => {
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    const handleUpdate = async () => {
        setErrorMessage("")
        if (!newEmail || !password) {
            setErrorMessage("Please provide the new email and current password.");
            return;
        }
        const { success, error } = await updateUserEmail(newEmail, password, setMessage, () => {
            setMessage("Email Successfully Updated");
        });
        if (!success) {
            setErrorMessage(error ?? "An unknown error occurred while updating your email.");
        }
    };

    const handleInput = (value: string, type: string) => {
        if (type === "email") {
            setNewEmail(value);
            setIsValidEmail(validateEmailInput(value));
        } else if (type === "password") {
            setPassword(value);
            setIsValidPassword(true); 
        }
    };

    return (
        <div className="text-sm">
            <label className="block text-gray-400 font-semibold mb-2 mt-4" htmlFor="password">
                Current Password
            </label>
            <Input
                type="password"
                placeholder="Current Password"
                value={password}
                onChange={(e) => handleInput(e.target.value, "password")}
                className=""
            />
            <label className="block text-gray-400 font-semibold mb-2 mt-4" htmlFor="email">
                New Email
            </label>
            <Input
                type="email"
                placeholder="New Email Address"
                value={newEmail}
                onChange={(e) => handleInput(e.target.value, "email")}
                className=""
            />
            <span className="text-sm text-gray-500 ml-1">{message}</span>
            <span className="text-red-500 text-sm">{errorMessage}</span>
            <div className="flex justify-end gap-4 mt-6">
                <Button
                    type="button"
                    onClick={handleUpdate}
                    disabled={!isValidEmail || !isValidPassword}
                    className=""
                >
                    Update Email
                </Button>
            </div>
        </div>
    );
};

// UpdatePassword Component (unchanged)
const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleUpdate = async () => {
        if (!newPassword || !currentPassword || newPassword !== confirmedPassword) {
            setErrorMessage("Please provide the new password and confirm it.");
            return;
        }
        const { success, error } = await updateUserPassword(newPassword, currentPassword, setMessage, () => {
            setMessage("Password Successfully Updated");
        });
        if (!success) {
            setErrorMessage(error ?? "An unknown error occurred while updating your password.");
        }
    };

    const handleInput = (value: string, type: string) => {
        if (type === "currentPassword") {
            setCurrentPassword(value);
        } else if (type === "newPassword") {
            setNewPassword(value);
        } else if (type === "confirmedPassword") {
            setConfirmedPassword(value);
        }
    };

    return (
        <div className="text-sm">
            <label className="block text-gray-400 font-semibold mb-2" htmlFor="currentPassword">
                Current Password
            </label>
            <Input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => handleInput(e.target.value, "currentPassword")}
                className=""
            />
            <label className="block text-gray-400 font-semibold mb-2 mt-4" htmlFor="newPassword">
                New Password
            </label>
            <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => handleInput(e.target.value, "newPassword")}
                className=""
            />
            <label className="block text-gray-400 font-semibold mb-2 mt-4" htmlFor="confirmedPassword">
                Confirm New Password
            </label>
            <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmedPassword}
                onChange={(e) => handleInput(e.target.value, "confirmedPassword")}
                className=""
            />
            <span className="text-sm text-gray-500">{message}</span>
            <span className="text-red-500 text-sm">{errorMessage}</span>
            <div className="flex justify-end gap-4 mt-6">
                <Button
                    type="button"
                    onClick={handleUpdate}
                    disabled={!((newPassword !== "") && (confirmedPassword !== "") && (newPassword === confirmedPassword))}
                >
                    Update Password
                </Button>
            </div>
        </div>
    );
};

// Page Component
const Page = () => {

    return (
        <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="relative">
                    Update Email
                </CardHeader>
                <CardContent>
                    <UpdateEmail />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="relative">
                    Update Password
                </CardHeader>
                <CardContent>
                    <UpdatePassword />
                </CardContent>
            </Card>

        </div>
    );
};

export default Page;