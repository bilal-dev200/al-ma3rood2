import ProfileClient from './ProfileClient';

export const metadata = {
  title: "Job Profile | Ma3rood",
  description:
    "Create and manage your professional Job Profile on Ma3rood. Showcase your skills, experience, and qualifications to attract top employers and find your next opportunity.",
  robots: "index, follow",
};

export default function Page() {
  return <ProfileClient />;
}