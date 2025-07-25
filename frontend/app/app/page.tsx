'use client';
import { IItemPasta } from "./components/itemPasta";
import { useEffect, useState } from "react";
import { deleteItem, getFiles, getPath, prevDirectory, setDirectory, uploadFile } from "./api/api";
import Header from "./components/header";
import ListaItens from "./components/listaItens";

export default function Root() {
  const [pathAtual, setPathAtual] = useState<string>("");
  const [criandoDiretorio, setCriandoDiretorio] = useState<boolean>(false);
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

  const handleSetPath = async (newPath: string) => {
    try {
      if (!newPath.includes('.')) {
        newPath = '.' + newPath;
      }
      setPathAtual(newPath);
      await setDirectory(newPath) 
      setFiles(await getFiles());
    } catch (error) {
      console.error("Error setting path:", error);
    }
  }

  useEffect(() => {
    fetchPathFromAPI();
  }, []);

  useEffect(() => {
    (async () => {
      setFiles(await getFiles());
      setCriandoDiretorio(false);
    })();
  }, [pathAtual]);


  const handleGoBack = async () => {
    try {
      const response = await prevDirectory();
      setPathAtual(response.path);
      setFiles(await getFiles());
    } catch (error) {
      console.error("Error going back to previous directory:", error);
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
    if (!file) return;
    await uploadFile(file)
    setFiles(await getFiles());
    event.target.value = "";
  }

  const handleDelete = async (item: IItemPasta | null) => {
    if (!item) return;
    try {
      await deleteItem(item.path);
      setItemSelecionado(null);
      setFiles(await getFiles());
    } catch (error) {
      console.error("Error deleting file:", error);
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
            handleCreateDirectory={() => setCriandoDiretorio(true)}
            handleSetPath={handleSetPath}
          />
          <ListaItens
            files={files}
            itemSelecionado={itemSelecionado}
            setItemSelecionado={setItemSelecionado}
            criandoDiretorio={criandoDiretorio}
            setPathAtual={setPathAtual}
            pathAtual={pathAtual}
            setFiles={setFiles}
            setCriandoDiretorio={setCriandoDiretorio}
          />
        </div>
      </section>
    </main>
  )
}
