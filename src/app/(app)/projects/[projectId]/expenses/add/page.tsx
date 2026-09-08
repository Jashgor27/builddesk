import { AddExpense } from '@/screens/project/AddExpense';

export default function Page({ params }: { params: { projectId: string } }) {
    return <AddExpense projectId={params.projectId} />;
}
