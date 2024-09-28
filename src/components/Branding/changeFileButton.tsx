import React, { Dispatch, ReactNode, SetStateAction, forwardRef } from "react";

type changeFileButtonProps = {
  children: ReactNode;
  setState: Dispatch<SetStateAction<File | undefined>>;
  mutationReference?: string;
  handleSubmit: (
    fileState: File | undefined,
    mutationReference: string
  ) => void;
};

const onButtonClick = (ref: any) => {
  // `current` points to the mounted file input element
  ref?.current?.click();
};

export const ChangeFileButton = forwardRef<
  HTMLInputElement,
  changeFileButtonProps
>(({ children, setState, mutationReference, handleSubmit }, ref) => {
  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: Dispatch<SetStateAction<File | undefined>>
  ) => {
    if (!e.target.files) return;

    setState(e.target.files[0]);

    if (e.target.files[0] && mutationReference) {
      handleSubmit(e.target.files[0], mutationReference);
    }
  };

  return (
    <>
      <input
        type="file"
        id="file"
        ref={ref}
        className="hidden"
        onChange={(e) => handleFileInput(e, setState)}
      />
      <button
        type="button"
        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => onButtonClick(ref)}
      >
        {children}
      </button>
    </>
  );
});
