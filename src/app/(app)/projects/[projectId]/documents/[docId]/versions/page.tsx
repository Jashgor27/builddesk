import { DocumentVersionHistory } from '@/screens/project/DocumentVersionHistory';

export default function Page({ params }: { params: { projectId: string; docId: string } }) {
    return <DocumentVersionHistory projectId={params.projectId} docId={params.docId} />;
}
