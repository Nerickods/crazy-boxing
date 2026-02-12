import LandingPageContent from "@/features/landing/components/LandingPageContent";
import { hoursService } from "@/features/facilities/services/hoursService";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const gymHours = await hoursService.getGymHours();

    return (
        <div className="dark">
            <LandingPageContent gymHours={gymHours} />
        </div>
    );
}
