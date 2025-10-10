import ActivityOverview from "@/components/dashboard/ActivityOverview"
import WelcomeSection from "@/components/voice/WelcomeSection"
import MainActions from "@/components/dashboard/MainActions"
import Navbar from "@/components/Navbar"

function Dashboardpage() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <WelcomeSection />
        <MainActions />
        <ActivityOverview />
        Dashboard
      </div>
    </>
  )
}

export default Dashboardpage;
