import { useState } from "react";
import { GoFileDirectoryFill } from "react-icons/go";

export interface IItemPasta {
    label: String;
    path: string;
    onClick?: () => void;
    onDoubleClick?: (path: string) => void;
}

export default function ItemPasta({ label, path, onClick, onDoubleClick }: IItemPasta) {

    return (
        <div onClick={onClick} onDoubleClick={() => onDoubleClick?.(path)} className="flex flex-col items-center justify-center w-32 h-32 bg-[#F0E4D7] rounded-lg shadow-md cursor-pointer hover:bg-[#EB9731] transition-colors duration-200">
            <GoFileDirectoryFill className="text-4xl text-[#EB9731]" size={48} />
            <span className="text-black">{label}</span>
        </div>
    )
}
