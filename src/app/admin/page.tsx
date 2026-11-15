import { OwnerDashboard } from "@/components/owner-dashboard";

export const metadata = { title: "Owner Dashboard" };

export default function Admin() {
  return <section className="wrap inner-page owner-page"><OwnerDashboard /></section>;
}
