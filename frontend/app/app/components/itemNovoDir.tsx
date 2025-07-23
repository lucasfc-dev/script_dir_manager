
import { GoFileDirectoryFill } from "react-icons/go";
import { useRef, useEffect } from "react";

export interface IItemNovoDir {
    onCreate: (name: string) => void;
    onCancel: () => void;
    onChange: (char: string) => void;
    nomeDiretorio: string;
}

export default function ItemNovoDir({ onCreate, onChange, nomeDiretorio, onCancel }: IItemNovoDir) {

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    return (
        <div className="flex flex-col items-center gap-3 p-4 justify-center h-32 bg-[#F0E4D7] rounded-lg shadow-md cursor-pointer hover:bg-[#EB9731]/80 transition-colors duration-200 w-full max-w-32">
            <GoFileDirectoryFill className="text-4xl text-[#EB9731]" size={48} />
            <input
                ref={inputRef}
                type="text"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onCreate(nomeDiretorio);
                    }
                    if (e.key === 'Escape') {
                        onCancel();
                    }
                }}
                value={nomeDiretorio}
                onChange={(e) => onChange(e.target.value)}
                placeholder="New Directory"
                className="w-full rounded text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EB9731] transition-all duration-150"
            />
        </div>
    )
}