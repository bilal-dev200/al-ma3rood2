import ServicesBookingsClient from "./ServicesBookingsClient";

export const metadata = {
  title: "Service bookings | Ma3rood",
  description: "Manage the services you have booked on Ma3rood.",
};

export default function Page() {
  return <ServicesBookingsClient />;
}


