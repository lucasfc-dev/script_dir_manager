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

export const uploadFile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`http://localhost:8000/upload-file`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to upload file");
        }
    } catch (error) {
        throw new Error("Error uploading file: " + error);
    }
}

export const downloadFileFromAPI = async (filePath: string) => {
    try {
        const response = await fetch(`http://localhost:8000/download-file?rel_path=${encodeURIComponent(filePath)}`);
        const contentDisposition = response.headers.get("content-disposition");
        let filename = "download";
        if (contentDisposition) {
            const match = contentDisposition.match(/filename\*=utf-8''([^;\n]*)/i);
            if (match && match[1]) {
                filename = decodeURIComponent(match[1]);
            } else {
                const fallback = contentDisposition.match(/filename="?([^";\n]*)"?/i);
                if (fallback && fallback[1]) {
                    filename = fallback[1];
                }
            }
        }
        if (!response.ok) {
            throw new Error("Failed to download file");
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error("Error downloading file:", error);
    }
}