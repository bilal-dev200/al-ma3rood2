"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { userApi } from "@/lib/api/user";
import { Image_URL } from "@/config/constants";
import {
  Mail,
  MapPin,
  User,
  ShieldCheck,
  Calendar,
  User2,
} from "lucide-react";
import Reviews from "@/components/WebsiteComponents/UserProfile/Reviews";

export default function ProfilePage({ params }) {
  const { slug } = params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userApi.getJobProfile(slug);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center py-10 text-gray-500">No profile found.</p>;
  }

    return (
  <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 md:px-10">
       <div className="w-full rounded-xl overflow-hidden bg-white">
        {/* Cover Image */}
        <div className="relative h-40 sm:h-48 md:h-56 w-full">
            {profile?.user?.background_photo ? (
        <Image
          src={`${Image_URL}${profile?.user?.background_photo}`}
          alt="Cover"
          fill
          onError={() => setImgError(true)}   // <-- handle broken image
          className="object-cover"
        />
      ) : (
        /* Fallback if no image OR if image crashed */
        <div className="w-full h-full bg-gray-300" />
      )}
          {/* Profile Image */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-8 ">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 border-4 border-white overflow-hidden shadow-md">
              {profile?.user?.profile_photo ? (
                            <Image
                              src={`${Image_URL}${profile?.user?.profile_photo}`}
                              alt="Profile"
                              fill
                              sizes="128px"
                              className="object-contain rounded-full"
                            />
                          ) : (
                            profile?.user?.name?.charAt(0)?.toUpperCase()
                          )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="pt-16 sm:pt-20 pb-8 px-4 sm:px-6 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold">{profile?.user?.username}</h2>

          <div className="mt-5 space-y-5 text-sm sm:text-base">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-wrap sm:flex-row sm:items-center gap-3 sm:gap-2 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <User2 size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {profile?.user?.name}
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-wrap sm:flex-row sm:items-center gap-3 sm:gap-2 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md break-all">
                  {profile?.user?.email}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">Location:</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {profile?.user?.governorate_name
                    ? `${profile?.user?.governorate_name}, ${profile?.user?.region_name}`
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">
                  Member Since:
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {new Date(profile?.user?.member_since).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* MAIN CONTENT SECTIONS */}
    <div className="mt-10 space-y-8">

      {/* JOB PROFILE */}
      <section className="bg-white rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Job Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Summary:</strong> {profile.job_profile?.summary || "N/A"}</p>
          <p><strong>Industry:</strong> {profile.job_profile?.industry || "N/A"}</p>
          <p>
            <strong>Preferred Role:</strong>{" "}
            {profile.job_profile?.preferred_role?.join(", ") || "N/A"}
          </p>
          <p><strong>Minimum Pay:</strong> {profile.job_profile?.minimum_pay_amount} / {profile.job_profile?.minimum_pay_type}</p>
          <p><strong>Notice Period:</strong> {profile.job_profile?.notice_period}</p>
          <p>
  <strong>Work Type:</strong>{" "}
  {profile.job_profile?.work_type
    ?.replace(/_/g, " ")        // replace _ with space
    .replace(/\b\w/g, (c) => c.toUpperCase())}  {/* capitalize words */}
</p>

        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-white rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Experience</h3>

        {profile.experiences?.length ? (
          profile.experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-lg mb-3 bg-gray-50">
              <h4 className="font-bold text-gray-800">{exp.job_title}</h4>
              <p className="text-sm text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-600">{exp.country}</p>
              <p className="mt-2 text-gray-700">{exp.description}</p>

              <p className="text-sm mt-2">
                <strong>Start:</strong> {exp.start_date} •{" "}
                <strong>End:</strong>{" "}
                {exp.currently_working ? "Currently Working" : exp.end_date}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No experience added.</p>
        )}
      </section>

      {/* SKILLS */}
      <section className="bg-white rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Skills</h3>

        {profile.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills added.</p>
        )}
      </section>

      {/* EDUCATION */}
      <section className="bg-white rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Education</h3>

        {profile.educations?.length ? (
          profile.educations.map((edu) => (
            <div key={edu.id} className="p-4 rounded-lg bg-gray-50 mb-3">
              <p><strong>{edu.education_provider}</strong></p>
              <p>{edu.qualification}</p>
              <p className="text-sm mt-1">
                <strong>Start:</strong> {edu.start_date} •{" "}
                <strong>End:</strong>{" "}
                {edu.currently_studying ? "Present" : edu.end_date}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No education added.</p>
        )}
      </section>

      {/* CERTIFICATES */}
      <section className="bg-white rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Certificates</h3>

        {profile.certificates?.length ? (
          profile.certificates.map((cert) => (
            <div key={cert.id} className="p-4 bg-gray-50 rounded mb-3">
              <p><strong>{cert.certificate_name}</strong></p>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
              <p className="text-sm">Issued: {cert.issue_date}</p>
              <p className="text-sm">
                Expiry: {cert.no_expiry ? "No Expiry" : cert.expiry_date}
              </p>

              <a
                href={`${Image_URL}${cert.document_path}`}
                target="_blank"
                className="text-blue-600 underline text-sm mt-2 inline-block"
              >
                View Document
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No certificates uploaded.</p>
        )}
      </section>

      {/* CV */}
      <section className="bg-white rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">CV</h3>

        {profile.cvs ? (
          <a
            href={`${Image_URL}${profile.cvs.file_path}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View CV
             {/* ({profile.cvs.type}) */}
          </a>
        ) : (
          <p className="text-gray-500">No CV uploaded.</p>
        )}
      </section>

      
    </div>
  </div>
);

  // );
}
