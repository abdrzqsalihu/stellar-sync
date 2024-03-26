import React, { useState } from "react";
import { CircleCheck, X } from "lucide-react";

function Alert({ alert }) {
  const [visible, setVisible] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };
  // Set up effect to show alert when 'alert' prop changes
  React.useEffect(() => {
    if (alert && alert.status && alert.msg) {
      setVisible(true);
      // Automatically close the alert after 3 seconds
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    }
  }, [alert]);

  return (
    <>
      <div
        role="alert"
        className={`rounded-xl border border-gray-100 bg-white p-4 absolute right-0 top-16 transform transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start gap-4">
          <span className="text-green-600">
            <CircleCheck />
          </span>

          <div className="flex-1">
            <strong className="block font-medium text-gray-900">
              {" "}
              {alert.status}{" "}
            </strong>

            <p className="mt-1 text-sm text-gray-700">{alert.msg}</p>
          </div>

          <button
            className="text-gray-500 transition hover:text-gray-600"
            onClick={handleClose}
          >
            <span className="sr-only">Dismiss popup</span>
            <X size={18} className="text-red-500" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Alert;
