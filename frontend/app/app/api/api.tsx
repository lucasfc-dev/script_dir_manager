import { NextResponse } from "next/server";
import { IItemPasta } from "../components/itemPasta";

export const getPath = async () => {
    const response = await fetch(`http://localhost:8000/current-directory`);
    if (!response.ok) {
        throw new Error("Failed to fetch path");
    }
    return await response.json();
}


export const setDirectory = async (path: string) => {
    const response = await fetch(`http://localhost:8000/set-directory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
    });
    if (!response.ok) {
        throw new Error("Failed to set directory");
    }
    return await response.json();
}


export const getFiles = async () : Promise<IItemPasta[]> => {
    const response = await fetch(`http://localhost:8000/directory-contents`);
    if (!response.ok) {
        throw new Error("Failed to fetch files");
    }
    const itens = await response.json() as IItemPasta[]
    console.log(itens)
    return itens
}