import { FiFile } from "react-icons/fi";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { deleteFile, getFileContents, getFiles } from "@/utils/octokit";
import EditModel from "./components/EditModel";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import Loader from "./components/Loader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleConfirmDelete = (filePath: string) => {
    setFilePath(filePath);
    setConfirmDelete(true);
  };

  const cencelDeleteHandler = () => {
    setFilePath("");
    setConfirmDelete(false);
  };

  useEffect(() => {
    getFiles().then((data: any) => {
      setFiles(data);
      setIsLoading(false);
    });
  }, []);

  const deleteSelectedFile = () => {
    deleteFile(filePath, deleteFile).then((response: any) => {
      if (response) {
        cencelDeleteHandler();
      }
    });
  };

  async function getFileContent(filePath: string) {
    const fileContent: any = await getFileContents(filePath);
    setFileContent(fileContent);
    setFilePath(filePath);
    setIsEditModalOpen(true);
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <main className="mx-4 xl:mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold underline my-8">
              Files in Repository
            </h1>

            <ul>
              {files
                .filter((file) => file.type !== "dir")
                .map((file) => (
                  <li
                    key={file.name}
                    className="block shadow rounded md:flex justify-between items-center my-4 p-2"
                  >
                    <div className="flex items-center">
                      <FiFile className="text-2xl text-gray-600 mr-2" />
                      <a href={file.html_url} className="text-xl text-black">
                        {file.name}
                      </a>
                    </div>
                    <div className="flex mt-4 mb-2 md:my-0 items-center justify-end">
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800
                   font-medium rounded text-sm px-5 py-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 "
                        onClick={() => getFileContent(file.path)}
                      >
                        Edit
                      </button>
                      {!confirmDelete && (
                        <button
                          className="text-white bg-red-700 hover:bg-red-800 font-medium rounded text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700"
                          onClick={() => handleConfirmDelete(file.path)}
                        >
                          Delete
                        </button>
                      )}
                      {confirmDelete && (
                        <DeleteConfirmationModal
                          filePath={filePath}
                          onCancelDelete={cencelDeleteHandler}
                          onDeleteFile={deleteSelectedFile}
                        />
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </main>
          <EditModel
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editModalFilePath={filePath}
          />
        </>
      )}
    </>
  );
}
