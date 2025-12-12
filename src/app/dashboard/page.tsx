import AllEvents from "../components/AllEvents"
import FeaturedMap from "../components/FeaturedMap";

export default function DashboardPage() {
  return (
    <main className="p-6">
      {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
      <FeaturedMap/>
      <AllEvents/>
    </main>
  );
}
