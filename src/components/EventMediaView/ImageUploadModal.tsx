import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Group, Text, useMantineTheme } from "@mantine/core";
import {
  PhotographIcon,
  TrashIcon,
  UploadIcon,
  XCircleIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useMutation } from "@apollo/client";
import { CREATE_EVENT_MEDIA_ITEM, FILE_UPLOAD } from "../../graphql/mutations";
import { FETCH_EVENT_BY_ID } from "../Event/logic";

type ImageUploadModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  eventId: string;
  orgId: string;
};

function ImageUploadIcon({ status, ...props }: any) {
  if (status.accepted) {
    return <UploadIcon {...props} />;
  }

  if (status.rejected) {
    return <XCircleIcon {...props} />;
  }

  return <PhotographIcon {...props} />;
}

function getIconColor(status: any, theme: any) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

export function ImageUploadModal({
  isOpen,
  closeModal,
  eventId,
  orgId,
}: ImageUploadModalProps) {
  const theme = useMantineTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [duplicatedImage, setDuplicatedImage] = useState(false);
  const [FileUpload] = useMutation(FILE_UPLOAD);
  const [CreateEventMediaItem] = useMutation(CREATE_EVENT_MEDIA_ITEM);
  const [loading, setLoading] = useState(false);
  // const [configImage, setConfigImage] = useState<ImageFilePros | undefined>();

  useEffect(() => {
    setTimeout(() => setDuplicatedImage(false), 4000);
  }, [duplicatedImage]);

  const onSubmit = async () => {
    if (files.length > 0) {
      setLoading(true);
      try {
        FileUpload({
          variables: {
            file: files[0],
          },
          onCompleted: (value) => {
            CreateEventMediaItem({
              variables: {
                input: {
                  event_id: eventId,
                  url: value.FileUpload.url,
                  org_id: orgId,
                  pos: 1,
                  teaser: false,
                },
              },
              refetchQueries: [
                {
                  query: FETCH_EVENT_BY_ID,
                  variables: { id: eventId },
                },
              ],
            }).then(() => {
              setLoading(false);
              setFiles([]);
              closeModal();
            });
          },
        });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

  function dropImage(imgFile: File[]) {
    const hasDuplicates = files.filter(({ name: id1 }) =>
      imgFile.some(({ name: id2 }) => id2 === id1)
    );

    if (!Boolean(hasDuplicates.length)) {
      setFiles([...files, ...imgFile]);
    } else {
      setDuplicatedImage(true);
    }
  }

  function handleDelete(name: string) {
    const newList = files.filter((item) => item.name !== name);
    setFiles(newList);
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
              <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex w-full h-full">
                  <div className="flex flex-col w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg text-center font-medium leading-6 text-gray-900"
                    >
                      Upload your image
                    </Dialog.Title>
                    <div className="mt-8">
                      <Dropzone
                        multiple={false}
                        accept={[
                          MIME_TYPES.png,
                          MIME_TYPES.jpeg,
                          MIME_TYPES.svg,
                        ]}
                        onDrop={(imgFile) => {
                          dropImage(imgFile);
                        }}
                        onReject={(files) =>
                          console.log("rejected files", files)
                        }
                        maxSize={3 * 1024 ** 2}
                      >
                        {(status) => (
                          <Group
                            position="center"
                            spacing="xl"
                            style={{ minHeight: 220, pointerEvents: "none" }}
                          >
                            <ImageUploadIcon
                              status={status}
                              style={{
                                width: 80,
                                height: 80,
                                color: getIconColor(status, theme),
                              }}
                            />

                            <div>
                              <Text size="xl" inline>
                                Drag image here or click to select file
                              </Text>
                              <Text size="sm" color="dimmed" inline mt={7}>
                                Attach you image, file should not exceed 5mb
                              </Text>
                            </div>
                          </Group>
                        )}
                      </Dropzone>
                    </div>
                    <div className="h-32 w-auto mt-8 flex overflow-x-auto flex-nowrap space-x-4 py-2">
                      {/* When multi file upload is ready you can delete from this list ultil the line with the text "Hey, it's me" below */}
                      {files.length > 0 ? (
                        <div
                          key={files[0].name}
                          className="group relative w-40 h-full flex-shrink-0"
                        >
                          <img
                            src={URL.createObjectURL(files[0])}
                            alt="with name"
                            className="h-full w-full object-cover"
                          />
                          <div
                            className="absolute z-10 h-full w-full inset-0 bg-transparent cursor-pointer"
                            // onClick={() => setConfigImage(file)}
                            title="Config media"
                          />
                          <div className="absolute z-0 flex opacity-0 group-hover:opacity-100 transition-all duration-300 bottom-0 w-full h-1/2 bg-gradient-to-t from-gray-700 justify-end p-6" />

                          <button
                            onClick={() => handleDelete(files[0].name)}
                            className="shadow z-20 absolute opacity-0 group-hover:opacity-100 transition-all duration-300 right-4 bottom-4"
                            title="Delete media"
                          >
                            <TrashIcon
                              aria-hidden="true"
                              className="text-gray-500 bg-white p-1.5 h-8 w-8 rounded-lg"
                            />
                          </button>
                        </div>
                      ) : null}

                      {/* Hey, it's me! Delete, until this line */}

                      {/* !!! Now you can uncomment and use the code below to render a list of multi images */}
                      {/* {files
                        ? files.map((file) => {
                            return (
                              <div
                                key={file.name}
                                className="group relative w-40 h-full flex-shrink-0"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="with name"
                                  className="h-full w-full object-cover"
                                />
                                <div
                                  className="absolute z-10 h-full w-full inset-0 bg-transparent cursor-pointer"
                                  // onClick={() => setConfigImage(file)}
                                  title="Config media"
                                />
                                <div className="absolute z-0 flex opacity-0 group-hover:opacity-100 transition-all duration-300 bottom-0 w-full h-1/2 bg-gradient-to-t from-gray-700 justify-end p-6" />

                                <button
                                  onClick={() => handleDelete(file.name)}
                                  className="shadow z-20 absolute opacity-0 group-hover:opacity-100 transition-all duration-300 right-4 bottom-4"
                                  title="Delete media"
                                >
                                  <TrashIcon
                                    aria-hidden="true"
                                    className="text-gray-500 bg-white p-1.5 h-8 w-8 rounded-lg"
                                  />
                                </button>
                              </div>
                            );
                          })
                        : null} */}
                    </div>
                    <div className="w-full flex justify-end space-x-4 my-4">
                      {duplicatedImage ? (
                        <div className="flex items-center">
                          <ExclamationIcon
                            aria-hidden="true"
                            className="text-red-800 h-5 w-5 mr-2"
                          />
                          <p className="text-red-800">
                            You can't upload duplicated images
                          </p>
                        </div>
                      ) : null}
                      <button
                        onClick={onSubmit}
                        className={`${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-brand-500"
                        } flex items-center text-white p-2 rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500`}
                      >
                        {loading ? (
                          <svg
                            role="status"
                            className="mr-2 w-5 h-5 text-white animate-spin dark:text-gray-600 fill-gray-400"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          <UploadIcon
                            aria-hidden="true"
                            className="text-white h-5 w-5 mr-2"
                          />
                        )}
                        Save Media
                      </button>
                      <button
                        onClick={() => {
                          closeModal();
                          setFiles([]);
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
                  {/* <div className="bg-gray-200 ml-4 w-1/4 rounded">
                    {configImage ? (
                      <div className="p-4">
                        <img
                          src={URL.createObjectURL(configImage.mediaFile)}
                          alt="with name"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div> */}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
