import Page from "../../components/dashboard/Page";
import Layout from "../../components/layout/Layout";

export const metadata = {
    title: 'Partner - Flippify',
    description: '',
};


export default function Dashboard() {
    return (
        <Layout title="Dashboard">
            <Page />
        </Layout>
    );
}
