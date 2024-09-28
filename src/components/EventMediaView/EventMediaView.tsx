import { PlusIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { MediaCard } from "../MediaCard/MediaCard";
import { ImageUploadModal } from "./ImageUploadModal";
import { useEvent } from "../../hooks/useEvent";
import { useParams } from "react-router-dom";
import { useOrg } from "../../hooks/useOrg";
import { useEventMedia } from "../../hooks/useEventMedia";

export function EventMediaView() {
  const [newMediaModalIsOpen, setNewMediaModalIsOpen] = useState(false);
  const { id } = useParams();
  const [org] = useOrg();
  const [event] = useEvent(id || "");
  const [data] = useEventMedia(id || "");

  function closeNewMediaModal() {
    setNewMediaModalIsOpen(false);
  }

  function openNewMediaModal() {
    setNewMediaModalIsOpen(true);
  }

  return (
    <>
      <div className="px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Media
            </h2>
            <p className="hidden md:block text-gray-700">
              Add media assets to your event
            </p>
          </div>

          <div>
            <button
              onClick={openNewMediaModal}
              className="bg-brand-500 flex items-center text-white p-2 rounded-md font-medium"
            >
              <PlusIcon
                aria-hidden="true"
                className="text-white h-5 w-5 mr-2"
              />
              Add Media
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 h-600 overflow-y-auto gap-x-16 gap-y-12 mt-16">
          {data?.media_web_bg_urls
            ? data?.media_web_bg_urls.map((imageUrl: string) => (
                <MediaCard
                  eventId={event?.id}
                  key={imageUrl}
                  imgUrl={`https://${imageUrl}`}
                />
              ))
            : null}
        </div>
      </div>
      <ImageUploadModal
        isOpen={newMediaModalIsOpen}
        eventId={event?.id}
        orgId={org?.id}
        closeModal={closeNewMediaModal}
      />
    </>
  );
}
