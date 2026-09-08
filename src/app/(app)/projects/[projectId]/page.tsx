import { ProjectOverview } from '@/screens/project/ProjectOverview';

export default function Page({ params }: { params: { projectId: string } }) {
    return <ProjectOverview projectId={params.projectId} />;
}
