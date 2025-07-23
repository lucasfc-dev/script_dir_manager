import { CiCirclePlus } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IItemPasta } from "./itemPasta";

interface IHeaderProps {
    pathAtual: string;
    handleGoBack: () => void;
    handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreateDirectory: () => void;
    handleDelete: () => void;
}

export default function Header({ pathAtual, handleGoBack, handleUpload, handleCreateDirectory, handleDelete }: IHeaderProps) {
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
                <div className="flex items-center flex-1 overflow-x-auto whitespace-nowrap text-lg font-medium">
                    {pathAtual.split(/\\|\//).filter(Boolean).map((p, idx, arr) => (
                        <span key={idx} className="flex items-center">
                            <span className="px-1">{p}</span>
                            {idx < arr.length - 1 && <span className="text-gray-900 font-bold text-xl">&#8250;</span>}
                        </span>
                    ))}
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