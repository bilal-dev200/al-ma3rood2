// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { authApi } from "@/lib/api/auth";

// export default function VerificationPage() {
// const [code, setCode] = useState(["", "", "", "", "", ""]);
// const router = useRouter();

// const handleChange = (value, index) => {
//     if (/^[0-9]?$/.test(value)) {
//     const newCode = [...code];
//     newCode[index] = value;
//     setCode(newCode);

//     // Auto move to next input
//     if (value && index < 5) {
//         document.getElementById(`code-${index + 1}`).focus();
//     }
//     }
// };

// const handleSubmit = (e) => {
//     e.preventDefault();
//     const enteredCode = code.join("");
//     console.log("Entered Verification Code:", enteredCode);

//     // Yahan API call karo backend par verify karne ke liye
//     if (enteredCode.length === 6) {
//     alert("Code Verified Successfully ✅");
//     router.push("/login"); // Verification ke baad login page
//     } else {
//     alert("Please enter full 6-digit code");
//     }
// };

// return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//     <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Verify Your Account</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
//         <div className="flex justify-between">
//             {code.map((digit, index) => (
//             <input
//                 key={index}
//                 id={`code-${index}`}
//                 type="text"
//                 maxLength="1"
//                 value={digit}
//                 onChange={(e) => handleChange(e.target.value, index)}
//                 className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//             ))}
//         </div>
//         <button
//             type="submit"
//             className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
//         >
//             Verify
//         </button>
//         </form>
//         <p className="mt-4 text-center text-sm text-gray-600">
//         Didn’t receive the code? <button className="text-green-600">Resend</button>
//         </p>
//     </div>
//     </div>
// );
// }
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { toast } from "react-toastify";

export default function VerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // 6 digits
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // email from query

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // move forward if input added
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = code.join("");

    if (enteredCode.length === 6) {
      try {
        const res = await authApi.verifyuser({
          email,
          verification_code: enteredCode,
        });

        if (res?.success) {
          toast.success(res.message || "Note Added Successfully.")
          // alert("Code Verified Successfully ✅");
          router.push("/login");
        } else {
          toast.error("Note Added Successfully.")
          // alert(res?.message || "Invalid Code ❌");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        if (err.data.success === false) {
          toast.error(err.data.message || "Note Added Successfully.")
        }
        // alert("Something went wrong");
      }
    } else {
      alert("Please enter full 6-digit code");
    }
  };

  const handleResend = async () => {
    try {
      const res = await authApi.resendCode({ email });
      alert(res?.message || "Code resent ✅");
    } catch (err) {
      console.error("Resend failed:", err);
      alert("Failed to resend code ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Verify
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Didn’t receive the code?{" "}
          <button onClick={handleResend} className="text-green-600 font-medium">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
