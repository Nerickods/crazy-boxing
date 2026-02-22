import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import MissionSection from "@/features/mission/components/MissionSection";

export default function MisionPage() {
    return (
        <div className="dark min-h-screen bg-black">
            <Header />
            <main className="pt-20">
                <MissionSection />
            </main>
            <Footer />
        </div>
    );
}
