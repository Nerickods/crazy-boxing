import { enrollmentService } from "@/features/enrollment/services/enrollmentServerService";
import EnrollmentsTab from "@/features/enrollment/components/admin/EnrollmentsTab";

export default async function EnrollmentsPage() {
    const enrollments = await enrollmentService.getAllEnrollments();

    return (
        <div className="h-full">
            <EnrollmentsTab initialData={enrollments} />
        </div>
    );
}
