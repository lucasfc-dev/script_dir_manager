'use client';
import ItemPasta, { IItemPasta } from "./components/itemPasta";
import { useEffect, useState } from "react";
import { createDirectory, deleteItem, getFiles, getPath, prevDirectory, setDirectory } from "./api/api";
import ItemNovoDir from "./components/itemNovoDir";
import Header from "./components/header";

export default function Root() {
  const [pathAtual, setPathAtual] = useState<string>("");
  const [criandoDiretorio, setCriandoDiretorio] = useState<boolean>(false);
  const [nomeDiretorio, setNomeDiretorio] = useState<string>("");
  const [files, setFiles] = useState<IItemPasta[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<IItemPasta | null>(null);

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

  const downloadFile = async (filePath: string) => {
    try {
      const response = await fetch(`http://localhost:8000/download-file?rel_path=${encodeURIComponent(filePath)}`);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  useEffect(() => {
    fetchPathFromAPI();
  }, []);

  useEffect(() => {
    console.log(pathAtual)
    getFilesFromAPI()
    setCriandoDiretorio(false);
  }, [pathAtual])

  const handleClick = (file: IItemPasta) => {
    setItemSelecionado(file);
  }

  const handleDoubleClick = async (path: string) => {
    try {
      if (itemSelecionado?.type === 'file') {
        await downloadFile(path);
        return;
      }
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

  const handleDelete = async (item: IItemPasta | null) => {
    if (!item) return;
    try {
      await deleteItem(item.path);
      setItemSelecionado(null);
      await getFilesFromAPI();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
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
        <div className="bg-[#EEDDC0] shadow-xl rounded w-full h-full custom-scrollbar overflow-y-auto">
          <Header
            pathAtual={pathAtual}
            handleDelete={() => handleDelete(itemSelecionado)}
            handleGoBack={handleGoBack}
            handleUpload={handleUpload}
            handleCreateDirectory={handleCreateDirectory}
          />
          <div className="flex gap-2 flex-wrap p-4 p-4">
            <div className="flex flex-wrap gap-2">
              {files.length === 0 ? (
                <div className="text-gray-500">
                  <span>Nenhum arquivo ou diretório encontrado.</span>
                </div>
              ) : null}
              {files.map((file: IItemPasta, index) => (
                <ItemPasta
                  selecionado={itemSelecionado === file}
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
                  onCancel={() => setCriandoDiretorio(false)}
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
