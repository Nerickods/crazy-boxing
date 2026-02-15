import LandingPageContent from "@/features/landing/components/LandingPageContent";
import { hoursService } from "@/features/facilities/services/hoursService";
import { galleryService } from "@/features/facilities/services/galleryService";
import { createClient } from "@/shared/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const supabase = await createClient();
    const [gymHours, galleryImages] = await Promise.all([
        hoursService.getGymHours(supabase),
        galleryService.getGalleryImages(supabase),
    ]);

    return (
        <div className="dark">
            <LandingPageContent gymHours={gymHours} galleryImages={galleryImages} />
        </div>
    );
}
