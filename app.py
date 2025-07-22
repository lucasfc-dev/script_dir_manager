from fastapi import FastAPI,Request
from dir_manager import DirManager

app = FastAPI()
dir_manager = DirManager("./virtual_dir")

@app.get("/directory-contents")
def get_directory_contents():
    contents = dir_manager.viewDirectoryContents()
    return contents

@app.get("/current-directory")
def get_current_directory():    
    current_dir = dir_manager.getCurrentDir()
    return {"path": current_dir}

@app.get('/set-directory/')
async def set_directory(request: Request):
    data = await request.json()
    path = data['path']
    dir_manager.setCurrentDir(dir_manager.join_full_path(path))
    return {"path": dir_manager.getCurrentDir()}
