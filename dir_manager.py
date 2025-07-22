import os
import shutil

class DirManager:
    def __init__(self, base_dir):
        self.base_dir = os.path.abspath(base_dir)
        self.current_dir = self.base_dir

    def setCurrentDir(self, path_dir):
        if not os.path.exists(path_dir):
            return 'Directory does not exist'
        if not path_dir.startswith(self.base_dir):
            return 'Cannot navigate outside the base directory'
        os.chdir(path_dir)
        self.current_dir = os.getcwd()

    def goToPreviousDir(self):
        previous_dir = self.getPreviousDir()
        if self.current_dir == self.base_dir:
            return 'Already in the base directory'
        self.setCurrentDir(previous_dir)

    def getCurrentDir(self):
        full_path = os.path.abspath(self.current_dir)
        rel_path = os.path.relpath(full_path, self.base_dir)
        return rel_path

    def getPreviousDir(self):
        return os.path.dirname(self.current_dir)

    def createDirectory(self, dir_name):
        path_dir = os.path.join(self.current_dir, dir_name)
        if not os.path.exists(path_dir):
            os.mkdir(path_dir)
            return 'Directory created successfully'
        return 'Directory already exists'

    def viewDirectoryContents(self):
        contents = os.listdir(self.current_dir)
        formated_contents = []
        for item in contents:
            full_path = os.path.join(self.current_dir, item)
            # path relativo à base_dir, para não expor caminhos absolutos
            rel_path = os.path.relpath(full_path, self.base_dir)
            if os.path.isdir(full_path):
                formated_contents.insert(0, {'label': f'[DIR] {item}', 'path': rel_path})
            else:
                formated_contents.append({'label': item, 'path': rel_path})

        return formated_contents
    

    def createFile(self, file_name, content):
        file_path = os.path.join(self.current_dir, file_name)
        with open(file_path, 'w') as f:
            f.write(content)
        return 'File created successfully'

    def uploadFile(self, file_path):
        with open(file_path,'r') as file:
            content = file.read()
            filename = file.name.split('/')[-1]
        with open(os.path.join(self.current_dir, filename), 'w') as f:
            f.write(content)
        return 'File uploaded successfully'

    def deleteDirectory(self, dir_name):
        path_dir = os.path.join(self.current_dir, dir_name)
        if os.path.exists(path_dir):
            if os.path.isdir(path_dir):
                shutil.rmtree(path_dir)
                return 'Directory deleted successfully'
            os.remove(path_dir)
            return 'File deleted successfully'
        return 'Directory does not exist'
    
    def join_full_path(self, *args):
        return os.path.join(self.current_dir, *args)
