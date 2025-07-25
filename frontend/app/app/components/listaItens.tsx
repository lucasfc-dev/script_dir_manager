import { useEffect, useState } from "react";
import ItemPasta, { IItemPasta } from "./itemPasta";
import { createDirectory, downloadFileFromAPI, getFiles, setDirectory } from "../api/api";
import ItemNovoDir from "./itemNovoDir";

interface IListaItensProps {
    files: IItemPasta[];
    itemSelecionado?: IItemPasta | null;
    setItemSelecionado?: (item: IItemPasta | null) => void;
    setFiles: (files: IItemPasta[]) => void;
    pathAtual: string;
    setPathAtual: (path: string) => void;
    criandoDiretorio: boolean;
    setCriandoDiretorio: (criando: boolean) => void;
}

export default function ListaItens({ files, criandoDiretorio, setPathAtual, setFiles, setCriandoDiretorio, itemSelecionado, setItemSelecionado }: IListaItensProps) {
    const [nomeDiretorio, setNomeDiretorio] = useState<string>("");


    const handleClick = (file: IItemPasta) => {
        setItemSelecionado?.(file);
    }

    const handleDoubleClick = async (path: string) => {
        try {
            if (itemSelecionado?.type === 'file') {
                await downloadFileFromAPI(path);
                return;
            }
            setPathAtual(path);
            setDirectory(path);
            setFiles(await getFiles());
        }
        catch (error) {
            console.error("Error setting directory:", error);
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
            setFiles(await getFiles());
        } catch (error) {
            console.error("Error creating directory:", error);
        }
    }

    return (
        <div className="flex gap-2 flex-wrap p-4 p-4">
            <div className="flex flex-wrap gap-2">
                {files.length === 0 && !criandoDiretorio ? (
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
    )
}