"use client";

import React, { useEffect, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
// import axios from "@/utils/axios";
import { usePathname, useRouter } from "next/navigation";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    subject: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname.endsWith("/")) {
      router.replace(pathname + "/");
    }
  }, [pathname, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // const schema = yup.object().shape({
  //   name: yup.string().required("Firstname is required"),
  //   email: yup.string().required("Lastname is required"),
  // })

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.public.post(
//         "user/contacts/addContactDetail",
//         formData
//       );
//       if (response.data.status === "success") {
//         setResponseMessage("Message Delivered Successfully");
//         setFormData({
//           name: "",
//           email: "",
//           mobile_no: "",
//           subject: "",
//           message: "",
//         });
//         setTimeout(() => setResponseMessage(""), 2000);
//       }
//     } catch (error) {
//       setResponseMessage("Failed to send message. Please try again.");
//       setTimeout(() => setResponseMessage(""), 2000);
//     }
//   };

  return (
    <div>
      {/* CustomSeo is optional for Next SEO handling */}
      {/* <CustomSeo id={3} /> */}

      <div className="relative mb-[70rem] z-10 lg:mb-[30rem] xl:mb-[30rem]">
        {/* Banner Section */}
        <div className="flex justify-center w-full text-white">
          <div
            className="relative h-[34rem] md:h-[650px] w-[90%] md:w-[95%] bg-cover bg-center rounded-bl-[50px] rounded-br-[50px] md:rounded-bl-[90px] md:rounded-br-[90px] flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url('/Areas/banner.png')",
            }}
          >
            <h1 className="text-2xl md:text-5xl font-newsLetter font-bold">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl font-montserrat">Home \ Contact Us</p>
          </div>
        </div>

        {/* Main Section */}
        <div className="absolute z-10 top-[80%] w-full md:w-full flex flex-col lg:flex-row justify-center items-stretch mx-auto p-5 gap8">
          {/* Left Panel */}
          <div className="w-full md:w-1/3 text-white p-8 rounded-t-3xl md:rounded-r-none md:rounded-l-3xl bg-[#555555] shadow-xl flex flex-col justify-center min-h-[500px]">
            <h3 className="text-3xl font-bold mb-4 font-montserrat">GET IN TOUCH</h3>
            <p className="mb-8 font-montserrat">
              Have questions or need assistance? We're here to help! Reach out to
              us, and we'll get back to you as soon as possible.
            </p>

            {/* Email */}
            <div className="flex items-center mb-6">
              <div className="border rounded-md p-1 mr-4">
                <TfiEmail className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <p className="font-bold font-montserrat">Email Address</p>
                <p className="font-montserrat">media@nextlevelrealestate.ae</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center mb-6">
              <div className="border rounded-md p-1 mr-4">
                <LuPhoneCall className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <p className="font-bold font-montserrat">Phone Number</p>
                <p className="font-montserrat">+(971) 4-454-2828</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center">
              <div className="border rounded-md p-1 mr-4">
                <IoLocationSharp className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <p className="font-bold font-montserrat">Office Address</p>
                <p className="font-montserrat">
                  1505, Opal Tower Burj Khalifa Boulevard - Business Bay - Dubai.
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/3 bg-white p-8 rounded-b-3xl md:rounded-l-none md:rounded-r-3xl shadow-xl min-h-[500px] flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4 text-[#8F8F8F] font-montserrat">
              CONTACT US
            </h3>
            <p className="mb-8 text-xs text-[#8F8F8F] font-montserrat">
              Need Support or Have Inquiries? We’re Just a Message Away!
            </p>

            <form  className="space-y-4 z-10 relative">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full h-10 p-3 font-montserrat border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full h-10 p-3 border font-montserrat border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2">
                  <input
                    type="tel"
                    name="mobile_no"
                    maxLength="15"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full h-10 p-3 border font-montserrat border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full h-10 p-3 border font-montserrat border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full resize-none p-3 border font-montserrat border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                rows="4"
              ></textarea>

              <button
                type="submit"
                className="h-10 font-montserrat bg-[#8F8F8F] hover:bg-transparent hover:text-[#8F8F8F] border hover:border-[#8F8F8F] text-white px-4 rounded-lg"
              >
                Send Message
              </button>

              {responseMessage && (
                <p className="text-center font-montserrat mt-4">{responseMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      <iframe
        className="w-full h-72 my-8"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d545.2317634754218!2d55.275131825499514!3d25.185046131987132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69d3345b4265%3A0x84561af444b75ead!2sNext%20Level%20Real%20Estate%20-%20Best%20Real%20Estate%20Agency%20in%20Dubai!5e0!3m2!1sen!2s!4v1739200401503!5m2!1sen!2s"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
