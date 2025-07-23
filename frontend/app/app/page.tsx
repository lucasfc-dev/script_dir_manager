'use client';
import ItemPasta, { IItemPasta } from "./components/itemPasta";
import { useEffect, useState } from "react";
import { createDirectory, getFiles, getPath, prevDirectory, setDirectory } from "./api/api";
import ItemNovoDir from "./components/itemNovoDir";
import Header from "./components/header";

export default function Root() {
  const [pathAtual, setPathAtual] = useState<string>("");
  const [criandoDiretorio, setCriandoDiretorio] = useState<boolean>(false);
  const [nomeDiretorio, setNomeDiretorio] = useState<string>("");
  const [files, setFiles] = useState<IItemPasta[]>([]);

  const fetchPathFromAPI = async () => {
    try {
      const response = await getPath()
      setPathAtual(response.path);
      console.log("Path atual:", response.path);
    } catch (error) {
      console.error("Error fetching path:", error)
    }
  }

  const getFilesFromAPI = async () => {
    try {
      const response = await getFiles()
      setFiles(response);
    } catch (error) {
      console.error("Error fetching files:", error)
    }
  }

  useEffect(() => {
    fetchPathFromAPI();
  }, []);

  useEffect(() => {
    console.log(pathAtual)
    getFilesFromAPI()
  }, [pathAtual])

  const handleClick = (file: IItemPasta) => {
    return
  }

  const handleDoubleClick = async (path: string) => {
    try {
      setPathAtual(path);
      setDirectory(path)
      await getFilesFromAPI();
    }
    catch (error) {
      console.error("Error setting directory:", error);
    }
  }

  const handleGoBack = async () => {
    try {
      const response = await prevDirectory();
      setPathAtual(response.path);
      await getFilesFromAPI();
    } catch (error) {
      console.error("Error going back to previous directory:", error);
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`http://localhost:8000/upload-file`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      await getFilesFromAPI();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const handleCreateDirectory = async () => {
    setCriandoDiretorio(true)
    setNomeDiretorio("")
  }

  const uploadNewDirectory = async (name: string) => {
    if (!name.trim()) {
      console.error("Directory name cannot be empty");
      return;
    }
    try {
      await createDirectory(name);
      setCriandoDiretorio(false);
      setNomeDiretorio("");
      await getFilesFromAPI();
    } catch (error) {
      console.error("Error creating directory:", error);
    }
  }

  return (
    <main className="flex h-screen w-screen flex-col">
      <section className="flex h-full flex-col p-28">
        <div className="bg-[#EEDDC0] w-full h-full custom-scrollbar overflow-y-auto">
          <Header
            pathAtual={pathAtual}
            handleGoBack={handleGoBack}
            handleUpload={handleUpload}
            handleCreateDirectory={handleCreateDirectory}
          />
          <div className="flex gap-2 flex-wrap p-4 p-4">
            <div className="flex flex-wrap gap-2">
              {files.map((file: IItemPasta, index) => (
                <ItemPasta
                  type={file.type}
                  key={index}
                  label={file.label}
                  path={file.path}
                  onClick={() => handleClick(file)}
                  onDoubleClick={() => handleDoubleClick(file.path)}
                />
              ))}
              {criandoDiretorio && (
                <ItemNovoDir
                  onCreate={uploadNewDirectory}
                  onChange={setNomeDiretorio}
                  nomeDiretorio={nomeDiretorio}
                />
              )}
            </div>
          </div>
        </div>


      </section>
    </main>
  )
}
