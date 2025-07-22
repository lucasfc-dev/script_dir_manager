import os
from io import BytesIO
import shutil
import tkinter as tk

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
            path = os.path.join(self.getCurrentDir(), item)
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

class App(tk.Tk):
    def __init__(self, dir_manager):
        super().__init__()
        self.title('Gerenciador de Diretórios e Arquivos')
        self.geometry('700x600')
        self.dir_manager = DirManager(os.path.abspath('./virtual_dir'))

        # Diretório atual
        self.lbl_dir = tk.Label(self, text=f'Diretório atual: {self.dir_manager.getCurrentDir()}', font=('Arial', 12, 'bold'))
        self.lbl_dir.pack(pady=10)

        # Visualizar conteúdo (Listbox para navegação)
        self.lst_contents = tk.Listbox(self, height=15, width=70, font=('Arial', 10))
        self.lst_contents.pack(pady=10)
        self.lst_contents.bind('<Double-Button-1>', self.on_item_double_click)

        # Barra de botões
        self.btn_frame = tk.Frame(self)
        self.btn_frame.pack(pady=10)
        self.btn_newdir = tk.Button(self.btn_frame, text='Criar Diretório', width=15, command=self.show_newdir)
        self.btn_newdir.grid(row=0, column=0, padx=5)
        self.btn_deldir = tk.Button(self.btn_frame, text='Deletar Diretório/Arquivo', width=20, command=self.show_deldir)
        self.btn_deldir.grid(row=0, column=1, padx=5)
        self.btn_createfile = tk.Button(self.btn_frame, text='Criar Arquivo', width=15, command=self.show_createfile)
        self.btn_createfile.grid(row=0, column=2, padx=5)
        self.btn_upload = tk.Button(self.btn_frame, text='Upload Arquivo', width=15, command=self.show_upload)
        self.btn_upload.grid(row=0, column=3, padx=5)
        self.btn_setdir = tk.Button(self.btn_frame, text='Mudar Diretório', width=15, command=self.show_setdir)
        self.btn_setdir.grid(row=0, column=4, padx=5)

        # Frames de entrada (inicialmente ocultos)
        self.frame_newdir = tk.Frame(self)
        self.entry_newdir = tk.Entry(self.frame_newdir, width=30)
        self.entry_newdir.pack(side=tk.LEFT, padx=5)
        self.btn_confirm_newdir = tk.Button(self.frame_newdir, text='Confirmar', command=self.create_dir)
        self.btn_confirm_newdir.pack(side=tk.LEFT, padx=5)

        self.frame_deldir = tk.Frame(self)
        self.entry_deldir = tk.Entry(self.frame_deldir, width=30)
        self.entry_deldir.pack(side=tk.LEFT, padx=5)
        self.btn_confirm_deldir = tk.Button(self.frame_deldir, text='Confirmar', command=self.delete_dir)
        self.btn_confirm_deldir.pack(side=tk.LEFT, padx=5)

        self.frame_createfile = tk.Frame(self)
        self.entry_filename = tk.Entry(self.frame_createfile, width=20)
        self.entry_filename.pack(side=tk.LEFT, padx=5)
        self.txt_filecontent = tk.Text(self.frame_createfile, height=4, width=30)
        self.txt_filecontent.pack(side=tk.LEFT, padx=5)
        self.btn_confirm_createfile = tk.Button(self.frame_createfile, text='Confirmar', command=self.create_file)
        self.btn_confirm_createfile.pack(side=tk.LEFT, padx=5)

        self.frame_upload = tk.Frame(self)
        self.entry_upload = tk.Entry(self.frame_upload, width=30)
        self.entry_upload.pack(side=tk.LEFT, padx=5)
        self.btn_confirm_upload = tk.Button(self.frame_upload, text='Confirmar', command=self.upload_file)
        self.btn_confirm_upload.pack(side=tk.LEFT, padx=5)

        self.frame_setdir = tk.Frame(self)
        self.entry_setdir = tk.Entry(self.frame_setdir, width=30)
        self.entry_setdir.pack(side=tk.LEFT, padx=5)
        self.btn_confirm_setdir = tk.Button(self.frame_setdir, text='Confirmar', command=self.set_dir)
        self.btn_confirm_setdir.pack(side=tk.LEFT, padx=5)

        # Mensagem de status
        self.lbl_status = tk.Label(self, text='', font=('Arial', 11), fg='blue')
        self.lbl_status.pack(pady=10)

        self.view_contents()
        self.hide_all_frames()

    def hide_all_frames(self):
        self.frame_newdir.pack_forget()
        self.frame_deldir.pack_forget()
        self.frame_createfile.pack_forget()
        self.frame_upload.pack_forget()
        self.frame_setdir.pack_forget()

    def show_newdir(self):
        self.hide_all_frames()
        self.frame_newdir.pack(pady=5)

    def show_deldir(self):
        self.hide_all_frames()
        self.frame_deldir.pack(pady=5)

    def show_createfile(self):
        self.hide_all_frames()
        self.frame_createfile.pack(pady=5)

    def show_upload(self):
        self.hide_all_frames()
        self.frame_upload.pack(pady=5)

    def show_setdir(self):
        self.hide_all_frames()
        self.frame_setdir.pack(pady=5)

    def update_dir_label(self):
        self.lbl_dir.config(text=f'Diretório atual: {self.dir_manager.getCurrentDir()}')

    def view_contents(self):
        self.lst_contents.delete(0, tk.END)
        # Adiciona diretório especial '...'
        self.lst_contents.insert(tk.END, '[DIR] ...')
        contents = self.dir_manager.viewDirectoryContents()
        for item in contents:
            self.lst_contents.insert(tk.END, item)
    def on_item_double_click(self, event):
        selection = self.lst_contents.curselection()
        if not selection:
            return
        item_text = self.lst_contents.get(selection[0])
        if item_text == '[DIR] ...':
            self.dir_manager.goToPreviousDir()
            self.update_dir_label()
            self.view_contents()
        elif item_text.startswith('[DIR] '):
            dir_name = item_text[6:]
            self.dir_manager.setCurrentDir(os.path.join(self.dir_manager.getCurrentDir(), dir_name))
            self.update_dir_label()
            self.view_contents()

    def create_dir(self):
        dir_name = self.entry_newdir.get()
        msg = self.dir_manager.createDirectory(dir_name)
        self.lbl_status.config(text=msg)
        self.update_dir_label()
        self.view_contents()

    def delete_dir(self):
        dir_name = self.entry_deldir.get()
        msg = self.dir_manager.deleteDirectory(dir_name)
        self.lbl_status.config(text=msg)
        self.update_dir_label()
        self.view_contents()

    def create_file(self):
        file_name = self.entry_filename.get()+'.txt'
        print(file_name)
        content = self.txt_filecontent.get('1.0', tk.END)
        msg = self.dir_manager.createFile(file_name, content)
        self.lbl_status.config(text=msg)
        self.view_contents()

    def upload_file(self):
        file_path = self.entry_upload.get()
        try:
            msg = self.dir_manager.uploadFile(file_path)
        except Exception as e:
            msg = f'Erro: {e}'
        self.lbl_status.config(text=msg)
        self.view_contents()

    def set_dir(self):
        path_dir = self.entry_setdir.get()
        msg = self.dir_manager.setCurrentDir(path_dir)
        if msg:
            self.lbl_status.config(text=msg)
        self.update_dir_label()
        self.view_contents()

def main():
    BASE_DIR = os.path.abspath('./virtual_dir')
    dir_manager = DirManager(BASE_DIR)
    app = App(dir_manager)
    app.mainloop()

if __name__ == '__main__':
    main()