from dir_manager import DirManager
from app_interface import App
import os 

def main():
    BASE_DIR = './virtual_dir'
    dir_manager = DirManager(BASE_DIR)
    app = App(dir_manager)
    app.mainloop()

if __name__ == '__main__':
    main()