import { ProjectDocuments } from '@/screens/project/ProjectDocuments';

export default function Page({ params }: { params: { projectId: string } }) {
    return <ProjectDocuments projectId={params.projectId} />;
}
