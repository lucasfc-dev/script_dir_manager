import os
from io import BytesIO
import shutil
import tkinter as tk

BASE_DIR = os.path.abspath('./virtual_dir')

class DirManager:
    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.current_dir = base_dir

    def setCurrentDir(self, path_dir):
        if not os.path.exists(path_dir):
            return 'Directory does not exist'
        os.chdir(path_dir)
        self.current_dir = os.getcwd()

    def goToPreviousDir(self):
        previous_dir = self.getPreviousDir()
        if self.current_dir == self.base_dir:
            return 'Already in the base directory'
        self.setCurrentDir(previous_dir)

    def getCurrentDir(self):
        return self.current_dir

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
            path = os.path.join(dir_manager.getCurrentDir(), item)
            if os.path.isdir(path):
                formated_contents.insert(0, f'[DIR] {item}')
            else:
                formated_contents.append(item)

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


# Interface Tkinter
dir_manager = DirManager(BASE_DIR)

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('Gerenciador de Diretórios e Arquivos')
        self.geometry('600x800')

        # Diretório atual
        self.lbl_dir = tk.Label(self, text=f'Diretório atual: {dir_manager.getCurrentDir()}')
        self.lbl_dir.pack(pady=5)

        # Visualizar conteúdo (Listbox para navegação)
        self.lst_contents = tk.Listbox(self, height=12, width=60)
        self.lst_contents.pack(pady=5)
        self.lst_contents.bind('<Double-Button-1>', self.on_item_double_click)

        # Criar diretório
        self.entry_newdir = tk.Entry(self)
        self.entry_newdir.pack(pady=5)
        self.btn_newdir = tk.Button(self, text='Criar Diretório', command=self.create_dir)
        self.btn_newdir.pack(pady=5)

        # Deletar diretório
        self.entry_deldir = tk.Entry(self)
        self.entry_deldir.pack(pady=5)
        self.btn_deldir = tk.Button(self, text='Deletar Diretório', command=self.delete_dir)
        self.btn_deldir.pack(pady=5)

        # Criar arquivo
        self.entry_filename = tk.Entry(self)
        self.entry_filename.pack(pady=5)
        self.txt_filecontent = tk.Text(self, height=4, width=40)
        self.txt_filecontent.pack(pady=5)
        self.btn_createfile = tk.Button(self, text='Criar Arquivo', command=self.create_file)
        self.btn_createfile.pack(pady=5)

        # Upload arquivo
        self.entry_upload = tk.Entry(self)
        self.entry_upload.pack(pady=5)
        self.btn_upload = tk.Button(self, text='Upload Arquivo', command=self.upload_file)
        self.btn_upload.pack(pady=5)

        # Mudar diretório
        self.entry_setdir = tk.Entry(self)
        self.entry_setdir.pack(pady=5)
        self.btn_setdir = tk.Button(self, text='Mudar Diretório', command=self.set_dir)
        self.btn_setdir.pack(pady=5)

        # Mensagem de status
        self.lbl_status = tk.Label(self, text='')
        self.lbl_status.pack(pady=10)

        self.view_contents()

    def update_dir_label(self):
        self.lbl_dir.config(text=f'Diretório atual: {dir_manager.getCurrentDir()}')

    def view_contents(self):
        self.lst_contents.delete(0, tk.END)
        # Adiciona diretório especial '...'
        self.lst_contents.insert(tk.END, '[DIR] ...')
        contents = dir_manager.viewDirectoryContents()
        for item in contents:
            self.lst_contents.insert(tk.END, item)
    def on_item_double_click(self, event):
        selection = self.lst_contents.curselection()
        if not selection:
            return
        item_text = self.lst_contents.get(selection[0])
        if item_text == '[DIR] ...':
            dir_manager.goToPreviousDir()
            self.update_dir_label()
            self.view_contents()
        elif item_text.startswith('[DIR] '):
            dir_name = item_text[6:]
            dir_manager.setCurrentDir(os.path.join(dir_manager.getCurrentDir(), dir_name))
            self.update_dir_label()
            self.view_contents()

    def create_dir(self):
        dir_name = self.entry_newdir.get()
        msg = dir_manager.createDirectory(dir_name)
        self.lbl_status.config(text=msg)
        self.update_dir_label()
        self.view_contents()

    def delete_dir(self):
        dir_name = self.entry_deldir.get()
        msg = dir_manager.deleteDirectory(dir_name)
        self.lbl_status.config(text=msg)
        self.update_dir_label()
        self.view_contents()

    def create_file(self):
        file_name = self.entry_filename.get()+'.txt'
        print(file_name)
        content = self.txt_filecontent.get('1.0', tk.END)
        msg = dir_manager.createFile(file_name, content)
        self.lbl_status.config(text=msg)
        self.view_contents()

    def upload_file(self):
        file_path = self.entry_upload.get()
        try:
            msg = dir_manager.uploadFile(file_path)
        except Exception as e:
            msg = f'Erro: {e}'
        self.lbl_status.config(text=msg)
        self.view_contents()

    def set_dir(self):
        path_dir = self.entry_setdir.get()
        msg = dir_manager.setCurrentDir(path_dir)
        if msg:
            self.lbl_status.config(text=msg)
        self.update_dir_label()
        self.view_contents()

if __name__ == '__main__':
    app = App()
    app.mainloop()