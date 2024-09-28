import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DELETE_MEDIA_ITEM } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { FETCH_EVENT_BY_ID } from "../Event/logic";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  imgUrl: string;
  eventId: string;
};

export function DeleteConfirmationModal({
  isOpen,
  closeModal,
  imgUrl,
  eventId,
}: DeleteConfirmationModalProps) {
  const [FileDelete] = useMutation(DELETE_MEDIA_ITEM);

  function handleDelete() {
    FileDelete({
      variables: {
        id: eventId,
        type: "EventWebBg",
        url: imgUrl.substring("https://".length),
      },
      refetchQueries: [
        {
          query: FETCH_EVENT_BY_ID,
          variables: { id: eventId },
        },
      ],
      onCompleted: () => {
        closeModal();
      },
    });
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 text-gray-900"
                >
                  Are you sure you want to delete this image?
                </Dialog.Title>

                <div className="mt-4 flex flex-col items-center justify-center space-y-5">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                    onClick={() => handleDelete()}
                  >
                    Yes, delete!
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
