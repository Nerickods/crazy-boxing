import LandingPageContent from "@/features/landing/components/LandingPageContent";
import { hoursService } from "@/features/facilities/services/hoursService";
import { createClient } from "@/shared/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const supabase = await createClient();
    const gymHours = await hoursService.getGymHours(supabase);

    return (
        <div className="dark">
            <LandingPageContent gymHours={gymHours} />
        </div>
    );
}
