export type EmailVerification = "unverified" | "verifying" | "verified";

interface IUser {
    id: string;
    username: string;
    email: string;
    code: string;
    stripeCustomerId: string;
    authentication: IAuthentication;
    metaData: IMetaData;
}

interface IAuthentication {
    emailVerified: EmailVerification;
    onboarding?: boolean
}

interface IMetaData {
    image?: string;
    createdAt: string;
}

export type { IUser }