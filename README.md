# Script Versionamento

🚀 **Gerenciador de Arquivos Web com Backend Python + Frontend Next.js**

> ---
>
>> Por [@levzxn](https://github.com/levzxn) e [@lucasfc-dev](https://github.com/lucasfc-dev)
>>
>
> ---

---

## ✨ Descrição

Um sistema web inspirado no Windows Explorer para gerenciar arquivos e diretórios, com upload, download, criação e deleção de pastas/arquivos, tudo via interface moderna e responsiva.

- **Frontend:** Next.js (React + TailwindCSS)
- **Backend:** FastAPI (Python)
- **Gerenciamento real de arquivos no servidor**

---

## 🖥️ Funcionalidades

- Visualização de arquivos e pastas em árvore
- Upload e download de arquivos
- Criação e deleção de diretórios

---

## 🚦 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/script_versionamento.git
cd script_versionamento
```

### 2. Instale as dependências do backend (Python)

```bash
pip install fastapi uvicorn
```

### 3. Instale as dependências do frontend (Node.js)

```bash
cd frontend/app
npm install
```

### 4. Rode o backend

```bash
uvicorn app:app --reload
```

### 5. Rode o frontend

```bash
cd frontend/app
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Estrutura do Projeto

```
script_versionamento/
├── app.py                # FastAPI backend
├── dir_manager.py        # Lógica de manipulação de arquivos
├── frontend/app/         # Next.js frontend
│   ├── components/       # Componentes React
│   └── ...
└── virtual_dir/          # Diretório gerenciado pelo sistema
```

---

## 📄 Licença

MIT
