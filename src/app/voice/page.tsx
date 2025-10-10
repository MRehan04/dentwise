import { auth } from "@clerk/nextjs/server"
import Navbar from "@/components/Navbar";
import WelcomeSection from "@/components/voice/WelcomeSection";
import FeatureCards from "@/components/voice/FeatureCards";
import VapiWidget from "@/components/voice/VapiWidget";
import ProPlanRequired from "@/components/voice/ProPlanRequired";

async function Voicepage() {
    const { has } = await auth();

    const hasProPlan = has({ plan: "ai_basic" }) || has({ plan: "ai_pro" })

    if (!hasProPlan) return <ProPlanRequired />;

    return (
        <div className="min-h-screeen bg-background">
            <Navbar />

            <div className="">
                <WelcomeSection />
                <FeatureCards />
                <VapiWidget />
            </div>
        </div>
    )
}

export default Voicepage;
