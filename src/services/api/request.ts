import { IFirebaseConfig } from "@/models/config";

export async function retrieveStatus(): Promise<IFirebaseConfig | void> {
    // Set up headers with the access token
    const headers = {
        "Accept": "*/*",
        "Origin": "https://partnerships.flippify.io",
        "Referer": "https://partnerships.flippify.io/",
        "Content-Type": "application/json",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
    };

    const url = new URL(`https://api.flippify.io/status`);
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch status info | ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data as IFirebaseConfig;

    } catch (error) {
        console.error(error)
    }
}