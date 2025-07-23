from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, UploadFile, File, HTTPException
import os
from fastapi.responses import FileResponse
from dir_manager import DirManager

app = FastAPI()
dir_manager = DirManager("./virtual_dir")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

@app.get("/directory-contents")
def get_directory_contents():
    contents = dir_manager.viewDirectoryContents()
    return contents

@app.get("/current-directory")
def get_current_directory():    
    current_dir = dir_manager.getCurrentDir()
    return {"path": current_dir}

@app.get("/previous-directory")
def get_previous_directory():  
    previous_dir = dir_manager.goToPreviousDir()
    return {"path": previous_dir}

@app.get('/set-directory/')
async def set_directory(path: str):
    msg = dir_manager.setCurrentDir(path)
    if msg:
        return msg
    return {"path": dir_manager.getCurrentDir()}

@app.post("/upload-file/")
async def upload_file(request: Request, file: UploadFile = File(...)):
    file_content = await file.read()
    msg = dir_manager.uploadFile(file.filename, file_content)
    return {"message": msg}

@app.post("/create-directory/")
async def create_directory(request: Request, dir_name: str):
    response = dir_manager.createDirectory(dir_name)
    return {"message": response}

@app.delete("/delete-directory/")
async def delete_directory(request: Request, rel_path: str):
    response = dir_manager.deleteDirectory(rel_path)
    return {"message": response}
 
@app.get("/download-file/")
async def download_file(rel_path: str):
    # Resolve the absolute path
    full_path = os.path.join(dir_manager.base_dir, rel_path)
    # Verify the file exists and is not a directory
    if not os.path.exists(full_path) or not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    # Stream the file as an attachment
    filename = os.path.basename(full_path)
    print(filename)
    return FileResponse(full_path, filename=filename, media_type="application/octet-stream")

