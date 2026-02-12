import LandingPageContent from "@/features/landing/components/LandingPageContent";

export const dynamic = 'force-dynamic';

export default async function Home() {
    return (
        <div className="dark">
            <LandingPageContent />
        </div>
    );
}
