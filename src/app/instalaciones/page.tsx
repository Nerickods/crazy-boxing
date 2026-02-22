import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import FacilitiesSection from "@/features/facilities/components/FacilitiesSection";
import { hoursService } from "@/features/facilities/services/hoursService";
import { galleryService } from "@/features/facilities/services/galleryService";
import { createClient } from "@/shared/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function InstalacionesPage() {
    const supabase = await createClient();
    const [gymHours, galleryImages] = await Promise.all([
        hoursService.getGymHours(supabase),
        galleryService.getGalleryImages(supabase),
    ]);

    return (
        <div className="dark min-h-screen bg-black">
            <Header />
            <main className="pt-20">
                <FacilitiesSection gymHours={gymHours} galleryImages={galleryImages} />
            </main>
            <Footer />
        </div>
    );
}
