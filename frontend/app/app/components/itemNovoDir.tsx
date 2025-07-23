import { GoFileDirectoryFill } from "react-icons/go";

export default function ItemNovoDir({ onCreate, onChange, nomeDiretorio }: { onCreate: (name: string) => void, onChange: (char: string) => void, nomeDiretorio: string }) {
    return (
        <div className="flex flex-col items-center gap-3 p-4 justify-center h-32 bg-[#F0E4D7] rounded-lg shadow-md cursor-pointer hover:bg-[#EB9731]/80 transition-colors duration-200 w-full max-w-32">
            <GoFileDirectoryFill className="text-4xl text-[#EB9731]" size={48} />
            <input
                type="text"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onCreate(nomeDiretorio);
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