import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// ✅ 1. Import the new icon from lucide-react
import { CheckCircle } from "lucide-react";

const ViewProductToast = ({ t }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    // Navigate to the product list page
    navigate(`/admin/products/list`);
    toast.dismiss(t.id);
  };

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-lg w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5 text-green-500">
            {/* ✅ 2. Use the new CheckCircle component */}
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-base font-semibold text-gray-900">
              Product Created!
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Product was added successfully. Do you want to view it?
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-l border-gray-200">
        <button
          onClick={handleViewClick}
          className="w-full h-1/2 border-b border-gray-200 rounded-none rounded-tr-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          View Products
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full h-1/2 border border-transparent rounded-none rounded-br-lg p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ViewProductToast;
