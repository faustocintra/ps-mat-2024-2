# Criação do projeto back-end

npx @aka-demy/create-express-app

Perguntas feitas pelo comando:
* OK to proceed? y
* Give a name for the app: back-end
* Language: Javascript
* Template engine: None
* Package manager: npm

# Execução do projeto back-end

Executar no terminal:
* cd back-end
* npm run dev

# Instalação do Prisma (ORM)

npm install prisma --save-dev

# Inicialização do Prisma

npx prisma init --datasource-provider postgresql

# Executando uma migration no Prisma

npx prisma migrate dev --name create-cars