import { CiCirclePlus } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import React, { use, useEffect, useState } from "react";
import { IItemPasta } from "./itemPasta";
import path from "path";
import { setDirectory,getFiles } from "../api/api";

interface IHeaderProps {
    pathAtual: string;
    handleGoBack: () => void;
    handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreateDirectory: () => void;
    handleDelete: () => void;
    handleSetPath: (newPath: string) => void;
}

export default function Header({ pathAtual, handleGoBack, handleUpload, handleCreateDirectory, handleDelete, handleSetPath }: IHeaderProps) {
    const [editingPath, setEditingPath] = useState(pathAtual);
    const [isEditing, setIsEditing] = useState(false);

    function handleEdit() {
        setIsEditing(true);
        setEditingPath(pathAtual);
    }

    function handleCancelEdit() {
        setIsEditing(false);
        setEditingPath(pathAtual);
    }

    async function handleSaveEdit() {
        setIsEditing(false);
        handleSetPath(editingPath);
    }

    const segments = pathAtual === '.'
        ? ['.']
        : ['.'].concat(pathAtual.split(/\\|\//).filter(Boolean));
    return (
        <header className="flex w-full bg-white text-black h-16 items-center px-4 shadow-md">
            <nav className="flex items-center w-full gap-4">
                {pathAtual !== '.' && (
                    <button
                        onClick={handleGoBack}
                        className="flex items-center justify-center w-10 h-10 bg-[#F0E4D7] rounded-md shadow hover:bg-[#EB9731] transition-colors duration-200 mr-2"
                        title="Voltar"
                    >
                        <IoIosArrowBack />
                    </button>
                )}
                <div onDoubleClick={() => handleEdit()} className="flex items-center flex-1 w-full overflow-x-auto whitespace-nowrap text-lg font-medium">
                    {isEditing ? (
                        <input
                            id="editingPath"
                            autoFocus
                            type="text"
                            value={editingPath}
                            onChange={e => setEditingPath(e.target.value)}
                            onBlur={() => handleCancelEdit()}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleSaveEdit();
                                }
                            }}
                            className="inset-0 w-full h-full bg-transparent z-10 px-1 focus:outline-none"
                        />
                    ) : (
                        segments.map((p, idx) => (
                            <span key={idx} className="flex items-center">
                                <span className="w-full px-1">{p}</span>
                                {idx < segments.length - 1 && <span className="w-full text-gray-900 font-bold text-xl">&#8250;</span>}
                            </span>
                        ))
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <label className="flex items-center gap-2 p-2 bg-[#F0E4D7] rounded-lg shadow-md hover:bg-[#EB9731] transition-colors duration-200 cursor-pointer">
                        <input type="file" onChange={handleUpload} className="hidden" />
                        <CiCirclePlus className="text-lg" />
                        <span className="font-medium">New file</span>
                    </label>
                    <button
                        onClick={handleCreateDirectory}
                        className="flex cursor-pointer items-center gap-2 p-2 bg-[#F0E4D7] rounded-lg shadow-md hover:bg-[#EB9731] transition-colors duration-200"
                    >
                        <CiCirclePlus className="text-lg" />
                        <span className="">New dir</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex cursor-pointer items-center gap-2 p-2 bg-[#F0E4D7] rounded-lg shadow-md hover:bg-[#EB9731] transition-colors duration-200"
                    >
                        <FaTrash className="text-lg" />
                        <span className="">Delete</span>
                    </button>
                </div>

            </nav>
        </header>
    )
}