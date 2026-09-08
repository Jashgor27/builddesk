import { ProjectExpenses } from '@/screens/project/ProjectExpenses';

export default function Page({ params }: { params: { projectId: string } }) {
    return <ProjectExpenses projectId={params.projectId} />;
}
