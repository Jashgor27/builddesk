import { ProjectMaterials } from '@/screens/project/ProjectMaterials';

export default function Page({ params }: { params: { projectId: string } }) {
    return <ProjectMaterials projectId={params.projectId} />;
}
