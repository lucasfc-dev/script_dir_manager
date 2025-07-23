'use client';
import { GoFileDirectoryFill } from "react-icons/go";
import ItemPasta, { IItemPasta } from "./components/itemPasta";
import { useEffect, useState } from "react";
import { getFiles, getPath, prevDirectory, setDirectory } from "./api/api";
import { get } from "http";
import { CiCirclePlus } from "react-icons/ci";
import { span } from "framer-motion/m";
import ItemNovoDir from "./components/itemNovoDir";

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
      const response = await fetch(`http://localhost:8000/create-directory?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create directory");
      }
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
        <header className="flex w-full bg-white text-black h-16 items-center justify-center">
          <nav className="flex items-center justify-between w-full px-4">
            <div>
              <input type="file" onChange={handleUpload} className="flex items-center gap-2 p-2 bg-[#F0E4D7] rounded-lg shadow-md hover:bg-[#EB9731] transition-colors duration-200" onClick={handleGoBack}>
              </input>
            </div>
            <div>
              <div onClick={handleCreateDirectory} className="flex items-center gap-2 p-2 bg-[#F0E4D7] rounded-lg shadow-md hover:bg-[#EB9731] transition-colors duration-200">
                <h2 className="text-black text-2xl font-bold mb-4">Criar diretório</h2>
              </div>
            </div>
          </nav>
        </header>
        <div className="flex w-full h-full gap-2 bg-[#EEDDC0] flex-wrap p-4 custom-scrollbar overflow-y-auto p-4">
          <div className="flex flex-wrap gap-2">
            <div onClick={handleGoBack} className="flex flex-col break-words items-center gap-2 p-4 justify-center w-32 h-32 bg-[#F0E4D7] rounded-lg shadow-md cursor-pointer hover:bg-[#EB9731] transition-colors duration-200">
              <h2 className="text-black text-2xl font-bold mb-4">[...]</h2>
            </div>
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
                onCreate={handleCreateDirectory}
                onChange={setNomeDiretorio}
                nomeDiretorio={nomeDiretorio}
              />
            )}
          </div>
        </div>

      </section>
    </main>
  )
}
