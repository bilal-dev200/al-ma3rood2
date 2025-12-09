import JobsListClient from './JobsListClient';

export const metadata = {
  title: "Job List | Ma3rood",
  description:
    "Create and manage your professional Job List on Ma3rood. Showcase your skills, experience, and qualifications to attract top employers and find your next opportunity.",
  robots: "index, follow",
};

export default function Page() {
  return <JobsListClient />;
}