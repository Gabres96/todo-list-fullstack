
# 🚀 To-Do List Fullstack

Aplicação Fullstack para gerenciamento de tarefas.

O sistema permite que usuários criem contas, gerenciem tarefas, organizem tarefas por categorias, compartilhem tarefas com outros usuários e consumam uma API externa para exibição de informações complementares.
## 📌 Sobre o Projeto

A aplicação foi construída utilizando:
- Python
- Frontend: React + TypeScript + Vite
- Backend: Django + Django REST Framework
- Banco de Dados: PostgreSQL
- Containerização: Docker + Docker Compose
- Autenticação: JWT (JSON Web Token)
- Testes Backend: Pytest
- Testes Frontend: Selenium
- CI/CD: GitHub Actions
## ✨ Funcionalidades Implementadas
#### 👤 Usuários
- Cadastro de usuários
-Login autenticado com JWT
- Logout
#### ✅ Tarefas
- Criar tarefa
- Editar tarefa
- Excluir tarefa
- Listar tarefas
- Marcar tarefa como concluída
- Marcar tarefa como pendente
#### 📁 Categorias
- Criar categoria
- Listar categorias
- Excluir categoria
- Associar tarefas a categorias
#### 🤝 Compartilhamento
- Compartilhar tarefas com outros usuários através do username
#### 🔎 Filtros
- Filtrar por status:
- Todas
- Pendentes
- Concluídas
- Filtrar por categoria
#### 📄 Paginação
- Paginação de tarefas utilizando recursos nativos do Django REST Framework
#### 🌦️ Integração Externa

A aplicação consome uma API externa de clima para exibir informações meteorológicas no Dashboard.
## 🏗️ Arquitetura
O projeto foi dividido em três serviços independentes:

 - Frontend = React/Vite
 - Backend = Django REST 
 - Banco de dados = PostgreSQL

  Todos os serviços são orquestrados pelo Docker Compose.
## 🛠️ Todas as Tecnologias Utilizadas
#### Backend
- Python 3
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- Pytest
- Docker
#### Frontend
- React
- TypeScript
- Vite
- Axios
- React Router
#### Infraestrutura
- Docker
- Docker Compose
- GitHub Actions
## 📥 Clonando o Projeto
```bash
git clone https://github.com/Gabres96/todo-list-fullstack.git
```
```bash
cd todo-list-fullstack
```
## ⚙️ Executando o Projeto
#### Pré-requisitos

Instale:

- Docker Desktop
- Git

#### Subindo toda a aplicação

Na raiz do projeto execute:
```bash
docker compose up --build
```

#### Após a inicialização:

Serviço	| URL
- Frontend | http://localhost:5173
- Backend | http://localhost:8000
- Admin Django | http://localhost:8000/admin

#### Encerrando os containers
```bash
docker compose down
```
## 🔑 Fluxo de Utilização
#### Criar Usuário

Acesse:

http://localhost:5173/register

Crie um usuário informando:

- Username
- Email
- Senha

#### Login

Acesse:

http://localhost:5173/login

Após autenticação você será redirecionado para o Dashboard.
## 📡 API REST
#### Autenticação
```bash
POST /api/users/register/
```
#### Login
```bash
GET /api/tasks/
```
#### Tarefas Listar tarefas
```bash
POST /api/tasks/
```
#### Criar tarefa
```bash
POST /api/token/
```
#### Atualizar tarefa
```bash
PUT /api/tasks/{id}/
```
#### Excluir tarefa
```bash
DELETE /api/tasks/{id}/
```
#### Compartilhar tarefa
```bash
POST /api/tasks/{id}/share/
```
#### Listar categorias
```bash
GET /api/categories/
```
#### Criar categoria
```bash
POST /api/categories/
```
#### Excluir categoria
```bash
DELETE /api/categories/{id}/
```
## 🧪 Testes
#### Backend
```bash
pytest ou python -m pytest
```
#### Frontend (Selenium)
```bash
python -m pytest
```
#### Resultado esperado:
```bash
3 passed
```
#### Testes implementados:

- Cadastro de usuário
- Login
- Criação de tarefa
## 🔄 CI/CD
O projeto possui pipeline automatizada utilizando GitHub Actions.

Fluxos executados:

- Build da aplicação
- Execução dos testes
- Validação de qualidade antes do merge
