import { FormSync } from '@/screens/project/FormSync';

export default function Page({ params }: { params: { projectId: string } }) {
    return <FormSync projectId={params.projectId} />;
}
