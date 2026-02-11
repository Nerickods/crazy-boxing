import DisciplinesTab from "@/features/training/components/admin/DisciplinesTab";
import { scheduleService } from "@/features/training/services/scheduleServerService";

export default async function DisciplinesPage() {
    const schedule = await scheduleService.getAllClasses();

    return (
        <div className="h-full">
            <DisciplinesTab initialSchedule={schedule} />
        </div>
    );
}
