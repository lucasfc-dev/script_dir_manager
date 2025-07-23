import { useState } from "react";
import { FaFile } from "react-icons/fa";
import { GoFile, GoFileDirectoryFill } from "react-icons/go";
import { MdInsertDriveFile } from "react-icons/md";

export interface IItemPasta {
    label: String;
    path: string;
    type: 'file' | 'directory';
    onClick?: () => void;
    onDoubleClick?: (path: string) => void;
}

export default function ItemPasta({ label, path, type, onClick, onDoubleClick }: IItemPasta) {

    return (
        <div onClick={onClick} onDoubleClick={() => onDoubleClick?.(path)} className="flex flex-col break-words items-center gap-2 p-4 justify-center w-32 h-32 bg-[#F0E4D7] rounded-lg shadow-md cursor-pointer hover:bg-[#EB9731] transition-colors duration-200">
            {type === 'file' ? (
                <GoFileDirectoryFill className="text-4xl text-[#EB9731]" size={48} />
            ) : (
                <MdInsertDriveFile className="text-4xl text-gray-700" size={46} />
            )}
            <div className="truncate w-full text-center">
                <span className="text-black">{label}</span>
            </div>
        </div>
    )
}
