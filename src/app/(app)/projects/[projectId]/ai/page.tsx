import { ProjectAIAssistant } from '@/screens/project/ProjectAIAssistant';

export default function Page({ params }: { params: { projectId: string } }) {
    return <ProjectAIAssistant projectId={params.projectId} />;
}
