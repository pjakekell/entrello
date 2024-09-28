import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Group } from "@mantine/core";
import { PencilIcon, UploadIcon, XCircleIcon } from "@heroicons/react/outline";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";

type EditMediaModalProps = {
  isOpen: boolean;
  imgUrl: string;
  closeModal: () => void;
};

export function EditMediaModal({
  isOpen,
  closeModal,
  imgUrl,
}: EditMediaModalProps) {
  const [file, setFile] = useState<File[]>([]);

  function dropImage(imgFile: File[]) {
    setFile(imgFile);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 text-gray-900"
                >
                  Edit Media
                </Dialog.Title>

                <div className="mt-4 flex flex-col items-center justify-center space-y-5">
                  <div className="mt-8">
                    <Dropzone
                      className="group relative"
                      accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
                      multiple={false}
                      onDrop={(imgFile) => {
                        dropImage(imgFile);
                      }}
                      onReject={(files) => console.log("rejected files", files)}
                      maxSize={3 * 1024 ** 2}
                    >
                      {() => (
                        <Group
                          position="center"
                          spacing="xl"
                          style={{ minHeight: 220, pointerEvents: "none" }}
                        >
                          {file.length !== 0 ? (
                            <img src={URL.createObjectURL(file[0])} alt="" />
                          ) : (
                            <img src={imgUrl} alt="" />
                          )}
                          <div className="absolute w-full h-full inset-0 opacity-0 group-hover:opacity-50 bg-gray-700 transition-all flex justify-center items-center">
                            <PencilIcon
                              aria-hidden="true"
                              className="text-gray-100 h-10 w-10"
                            />
                          </div>
                        </Group>
                      )}
                    </Dropzone>
                  </div>
                  <div className="w-full flex justify-end space-x-4 my-4">
                    <button className="bg-brand-500 flex items-center text-white p-2 rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500">
                      <UploadIcon
                        aria-hidden="true"
                        className="text-white h-5 w-5 mr-2"
                      />
                      Save Media
                    </button>
                    <button
                      onClick={() => {
                        closeModal();
                        setFile([]);
                      }}
                      className="flex items-center p-2 text-gray-900 bg-gray-200 border transition-all border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    >
                      <XCircleIcon
                        aria-hidden="true"
                        className="text-gray-900 h-5 w-5 mr-2"
                      />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
