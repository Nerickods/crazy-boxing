import LandingPageContent from "@/features/landing/components/LandingPageContent";
import { hoursService } from "@/features/facilities/services/hoursService";
import { galleryService } from "@/features/facilities/services/galleryService";
import { createClient } from "@/shared/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const supabase = await createClient();
    let gymHours: any[] = [];
    let galleryImages: any[] = [];

    try {
        const [hoursData, imagesData] = await Promise.all([
            hoursService.getGymHours(supabase),
            galleryService.getGalleryImages(supabase),
        ]);
        gymHours = hoursData || [];
        galleryImages = imagesData || [];
    } catch (error) {
        console.error('CRITICAL: Failed to fetch initial data for Landing Page:', error);
        if (error instanceof Error) {
            console.error('Stack:', error.stack);
        }
        // Fallback to empty/default data - prevents 500 error page
    }

    return (
        <div className="dark">
            <LandingPageContent gymHours={gymHours} galleryImages={galleryImages} />
        </div>
    );
}
