"use client";
import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";
import DetailsForm from "./components/DetailsForm";
import DetailsView from "./components/DetailsView";
import ExperienceForm from "./components/ExperienceForm";
import ExperienceView from "./components/ExperienceView";
import EducationForm from "./components/EducationForm";
import EducationView from "./components/EducationView";
import CertificationForm from "./components/CertificationForm";
import CertificationView from "./components/CertificationView";
import CvForm from "./components/CvForm";
import CvView from "./components/CvView";
import SkillsForm from "./components/SkillsForm";
import SkillsView from "./components/SkillsView";
import { profileDeleteApi, deleteApi, getApi } from "@/lib/api/jobs-profile";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import PersonalDetailsView from "./components/PersonalDetailsView";
import { toast } from "react-toastify";

const items = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Job Profile" },
];

const tabs = [
  "Personal_Details",
  "Professional_Details",
  "Experience",
  "Education",
  "CV",
  "Certifications",
  "Skills",
];

const ProfileClient = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Personal_Details");
  const [userDetail, setUserDetail] = useState(null);
  const [jobProfile, setJobProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);

  // Editing States
  const [editingSection, setEditingSection] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [editingSkills, setEditingSkills] = useState(false);

  // Fetch job profile data
  useEffect(() => {
    const fetchJobProfile = async () => {
      try {
        const res = await getApi("user/job/profile");
        setUserDetail(res?.user);
        setJobProfile(res?.job_profile);
        setEducation(res?.educations || []);
        setExperience(res?.experiences || []);
        setCertifications(res?.certificates || []);
        setCvs(res?.cvs || []);
        setSkills(res?.skills || []);
      } catch (error) {
        console.error("Failed to fetch job profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobProfile();
  }, []);

  const renderForm = () => {
    switch (activeTab) {
      case "Professional_Details":
        return editingSection === "Professional_Details" ? (
          <DetailsForm
            defaultData={jobProfile}
            onCancel={() => setEditingSection(null)}
            onSuccess={async () => {
              const res = await getApi("user/job/profile");
              setJobProfile(res.job_profile);
              setEditingSection(null);
            }}
          />
        ) : (
          <DetailsView
            data={jobProfile}
            onAdd={() => setEditingSection("Professional_Details")}
            onEdit={() => setEditingSection("Professional_Details")}
          />
        );
      case "Personal_Details":
        return editingSection === "Personal_Details" ? (
          <PersonalDetailsForm
            defaultData={userDetail}
            onCancel={() => setEditingSection(null)}
            onSuccess={async () => {
              const res = await getApi("user/job/profile");
              setUserDetail(res?.user);
              setEditingSection(null);
            }}
          />
        ) : (
          <PersonalDetailsView
            data={userDetail}
            onEdit={() => setEditingSection("Personal_Details")}
            onAdd={() => setEditingSection("Personal_Details")}
          />
        );

      case "Experience":
        if (editingExperience) {
          return (
            <ExperienceForm
              defaultData={editingExperience}
              onCancel={() => setEditingExperience(null)}
              onSuccess={async () => {
                const res = await getApi("user/job/profile");
                setExperience(res.experiences || []);
                setEditingExperience(null);
              }}
            />
          );
        }
        return (
          <ExperienceView
            data={experience}
            onDelete={async (id) => {
              try {
                await profileDeleteApi(`user/job-experience/${id}/destroy`);
                toast.success("Experience deleted successfully!")
                const res = await getApi("user/job/profile");
                setExperience(res.experiences || []);
              } catch (err) {
                toast.error(
                  err?.message || "Failed to delete experience!"
                );
                console.error("Delete failed:", err);
              }
            }}
            onEdit={(exp) => setEditingExperience(exp)}
            onAdd={() => setEditingExperience({})}
          />
        );

      case "Education":
        if (editingEducation) {
          return (
            <EducationForm
              defaultData={editingEducation}
              onCancel={() => setEditingEducation(null)}
              onDelete={async (id) => {
                try {
                  await profileDeleteApi(`user/education/${id}800/destroy`);
                  toast.success("Experience deleted successfully!")
                  const res = await getApi("user/job/profile");
                  setEducation(res.educations || []);
                } catch (err) {
                 toast.error(
        err?.response?.message || "Failed to delete experience!"
      );
                  console.error("Delete failed:", err);
                }
              }}
              onSuccess={async () => {
                const res = await getApi("user/job/profile");
                setEducation(res.educations || []);
                setEditingEducation(null);
              }}
            />
          );
        }
        return (
          <EducationView
            data={education}
            onEdit={(edu) => setEditingEducation(edu)}
            onAdd={() => setEditingEducation({})}
            onDelete={async (id) => {
                try {
                  await profileDeleteApi(`user/education/${id}/destroy`);
                  toast.success("Experience deleted successfully!")
                  const res = await getApi("user/job/profile");
                  setEducation(res.educations || []);
                } catch (err) {
                 toast.error(
        err?.message || "Failed to delete experience!"
      );
                  console.error("Delete failed:", err);
                }
              }}
          />
        );

      case "Certifications":
        if (editingCertification) {
          return (
            <CertificationForm
              defaultData={editingCertification}
              onCancel={() => setEditingCertification(null)}
              onSuccess={async () => {
                const res = await getApi("user/job/profile");
                setCertifications(res.certificates || []);
                setEditingCertification(null);
              }}
            />
          );
        }
        return (
          <CertificationView
            data={certifications}
            onEdit={(c) => setEditingCertification(c)}
            onAdd={() => setEditingCertification({})}
            onDelete={async (id) => {
              try {
                await profileDeleteApi(`user/job-certificate/${id}/destroy`);
                toast.success("Certificate deleted successfully!")
                const res = await getApi("user/job/profile");
                setCertifications(res.certificates || []);
              } catch (err) {
                toast.error(
                  err?.message || "Failed to delete certificate!"
                );
                console.error("Delete failed:", err);
              }
            }}
          />
        );

      case "CV":
        if (editingSection === "cv") {
          return (
            <CvForm
              onCancel={() => setEditingSection(null)}
              onSuccess={async () => {
                const res = await getApi("user/job/profile");
                setCvs(res.cvs || []);
                setEditingSection(null);
              }}
            />
          );
        }
        return (
          <CvView
            data={cvs}
            onAdd={() => setEditingSection("cv")}
            onDelete={async (id) => {
              try {
                await profileDeleteApi(`user/job-cv/${id}/destroy`);
                toast.success("CV deleted successfully!")
                const res = await getApi("user/job/profile");
                setCvs(res.cvs || []);
              } catch (err) {
                toast.error(
                  err?.message || "Failed to delete CV!"
                );
                console.error("Delete failed:", err);
              }
            }}
          />
        );

      case "Skills":
        if (editingSkills) {
          return (
            <SkillsForm
              defaultData={skills}
              onCancel={() => setEditingSkills(false)}
              onSuccess={async () => {
                const res = await getApi("user/job/profile");
                setSkills(res.skills || []);
                setEditingSkills(false);
              }}
            />
          );
        }
        return (
          <SkillsView data={skills} onEdit={() => setEditingSkills(true)} />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Breadcrumbs
        items={items.map((item) => ({ ...item, label: t(item.label) }))}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />

      <div className="mt-5 min-h-screen font-sans w-full mx-auto">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          {t("Job Profile")}
        </h1>

        {/* Tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-200 mb-6 scrollbar-hide">
          <div className="flex space-x-4 px-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setEditingSection(null);
                  setEditingExperience(null);
                  setEditingEducation(null);
                  setEditingCertification(null);
                  setEditingSkills(false);
                }}
                className={`px-4 py-2 text-sm font-semibold flex-shrink-0 ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {t(tab.replace(/_/g, " "))}
              </button>
            ))}
          </div>
        </div>

        {/* Render Section */}
        <div className="bg-white shadow p-6 rounded-lg">{renderForm()}</div>
      </div>
    </>
  );
};

export default ProfileClient;
