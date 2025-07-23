import { CiCirclePlus } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";

interface IHeaderProps {
    pathAtual: string;
    handleGoBack: () => void;
    handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreateDirectory: () => void;
}

export default function Header({ pathAtual, handleGoBack, handleUpload, handleCreateDirectory }: IHeaderProps) {
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
                            {idx < arr.length - 1 && <span className="text-gray-400">&#8250;</span>}
                        </span>
                    ))}
                </div>

                <label className="flex items-center gap-2 p-2 bg-[#F0E4D7] rounded-lg shadow-md hover:bg-[#EB9731] transition-colors duration-200 cursor-pointer mr-2">
                    <input type="file" onChange={handleUpload} className="hidden" />
                    <span className="font-medium">Upload</span>
                </label>

                <button
                    onClick={handleCreateDirectory}
                    className="flex items-center gap-2 p-2 bg-[#F0E4D7] rounded-lg shadow-md hover:bg-[#EB9731] transition-colors duration-200"
                >
                    <CiCirclePlus className="text-2xl" />
                    <span className="font-bold">Criar diretório</span>
                </button>
            </nav>
        </header>
    )
}