from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI,Request, UploadFile, File
from dir_manager import DirManager

app = FastAPI()
dir_manager = DirManager("./virtual_dir")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    dir_manager.setCurrentDir(path)
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