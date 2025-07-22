from fastapi import FastAPI
from dir_manage import DirManager

app = FastAPI()
dir_manager = DirManager("./virtual_dir")

@app.get("/directory-contents")
def get_directory_contents():
    return {"contents": dir_manager.viewDirectoryContents()}