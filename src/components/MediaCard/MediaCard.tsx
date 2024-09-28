import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { DeleteConfirmationModal } from "../EventMediaView/DeleteConfirmationModal";
import { EditMediaModal } from "../EventMediaView/EditMediaModal";

type MediaCardProps = {
  imgUrl: string;
  eventId: string;
};

export function MediaCard({ imgUrl, eventId }: MediaCardProps) {
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] =
    useState(false);
  const [editMediaModalIsOpen, setEditMediaModalIsOpen] = useState(false);

  function closeConfirmDeleteModal() {
    setConfirmDeleteModalIsOpen(false);
  }

  function openConfirmDeleteModal() {
    setConfirmDeleteModalIsOpen(true);
  }

  function closeEditMediaModal() {
    setEditMediaModalIsOpen(false);
  }

  function openEditMediaModal() {
    setEditMediaModalIsOpen(true);
  }

  return (
    <>
      <div className="group relative bg-brand-200 rounded-lg w-full h-80">
        <img
          src={imgUrl}
          alt="media asset for gallery"
          className="object-cover h-full w-full rounded-lg"
        />
        <div className="opacity-0 group-hover:opacity-100 transition-all rounded-lg duration-300 absolute flex bottom-0 w-full h-1/4 bg-gradient-to-t from-gray-700 space-x-4 justify-end p-6">
          <button
            onClick={openEditMediaModal}
            className="shadow"
            title="Edit Media"
          >
            <PencilIcon
              aria-hidden="true"
              className="text-gray-500 bg-white p-1.5 h-8 w-8 rounded-lg"
            />
          </button>
          <button
            onClick={openConfirmDeleteModal}
            className="shadow"
            title="Delete media"
          >
            <TrashIcon
              aria-hidden="true"
              className="text-gray-500 bg-white p-1.5 h-8 w-8 rounded-lg"
            />
          </button>
        </div>
      </div>
      <DeleteConfirmationModal
        imgUrl={imgUrl}
        isOpen={confirmDeleteModalIsOpen}
        closeModal={closeConfirmDeleteModal}
        eventId={eventId}
      />
      <EditMediaModal
        imgUrl={imgUrl}
        isOpen={editMediaModalIsOpen}
        closeModal={closeEditMediaModal}
      />
    </>
  );
}
