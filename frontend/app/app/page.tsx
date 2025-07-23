'use client';
import { GoFileDirectoryFill } from "react-icons/go";
import ItemPasta, { IItemPasta } from "./components/itemPasta";
import { useEffect, useState } from "react";
import { getFiles, getPath } from "./api/api";
import { get } from "http";

export default function Root() {
  const [pathAtual, setPathAtual] = useState<string>(".");
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
    fetchPathFromAPI()
    getFilesFromAPI()
  }, [pathAtual])

  return (
    <main className="flex h-screen w-screen flex-col">
      <header className="flex w-full h-16 items-center justify-center">
        <nav>
          <h1>NEGOLAS SYSTEM HAHA</h1>
        </nav>
      </header>
      <section className="flex h-full p-28">
        <div className="flex w-full gap-2 bg-[#EEDDC0] flex-wrap p-4 custom-scrollbar overflow-y-auto p-">
          {files.map((file, index) => (
            <ItemPasta
              key={index}
              label={file.label}
              path={file.path}
              onClick={() => console.log(`Clicked on ${file.label}`)}
              onDoubleClick={(path) => console.log(`Double clicked on ${path}`)}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
