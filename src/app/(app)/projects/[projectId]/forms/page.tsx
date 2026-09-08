import { ProjectForms } from '@/screens/project/ProjectForms';

export default function Page({ params }: { params: { projectId: string } }) {
    return <ProjectForms projectId={params.projectId} />;
}
