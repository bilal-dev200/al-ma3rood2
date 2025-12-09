import { AiOutlineCheckCircle } from "react-icons/ai";

const SuccessToast = () => {
  return (
    <div className="fixed top-0 left-3 w-full bg-green-100 border-b border-green-400 text-green-800 text-sm px-6 py-3 flex items-center shadow z-50">
      <AiOutlineCheckCircle className="mr-2 text-xl text-green-600" />
      <span>Your listing is now live!</span>
    </div>
  );
};

export default SuccessToast;
