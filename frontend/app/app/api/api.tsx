import { IItemPasta } from "../components/itemPasta";

export const getPath = async () => {
    const response = await fetch(`http://localhost:8000/current-directory`);
    if (!response.ok) {
        throw new Error("Failed to fetch path");
    }
    return await response.json();
}


export const setDirectory = async (path: string) => {
    const response = await fetch(`http://localhost:8000/set-directory/?path=${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error("Failed to set directory");
    }
    return await response.json();
}

export const prevDirectory = async () => {
    const response = await fetch(`http://localhost:8000/previous-directory`);
    if (!response.ok) {
        throw new Error("Failed to fetch previous directory");
    }
    return await response.json()
}

export const getFiles = async (): Promise<IItemPasta[]> => {
    const response = await fetch(`http://localhost:8000/directory-contents`);
    if (!response.ok) {
        throw new Error("Failed to fetch files");
    }
    const itens = await response.json() as IItemPasta[]
    console.log(itens)
    return itens
}

export const createDirectory = async (name: string) => {
    const response = await fetch(`http://localhost:8000/create-directory/?dir_name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error("Failed to create directory");
    }
}

export const deleteItem = async (path: string) => {
    const response = await fetch(`http://localhost:8000/delete-directory/?rel_path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete item");
    }
}