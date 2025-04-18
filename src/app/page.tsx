import { Suspense } from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Page from "./components/login/Page";
import Layout from "./components/layout/Layout";


export default function Home() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Layout>
                <Page />
            </Layout>
        </Suspense>
    );
}
