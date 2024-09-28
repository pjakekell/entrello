import React from "react";

interface ISaveBtn {
  onClick?: () => void
}

const SaveBtn = ({ onClick }: ISaveBtn) => (
  <div className="col-span-6 text-right">
    <button
      type="submit"
      className="inline-flex justify-center py-2 px-10 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
      onClick={onClick}
    >
      Save
    </button>
  </div>
);

export default SaveBtn;
