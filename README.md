# Criação do projeto back-end

npx @aka-demy/create-express-app

Perguntas feitas pelo comando:
* OK to proceed? y
* Give a name for the app: back-end
* Language: JavaScript
* Template engine: None
* Package manager: npm

# Execução do pojeto back-end

Executar no terminal 
* cd back-end
* npm run dev

# Instalação do Prisma (ORM)

npm install prisma --save-dev

# Inicialização do Prisma

npm prisma init --datasource-provider postgresql

# Executando uma migration no Prisma

npx prisma migrate dev --name create-cars

npx prisma migrate dev --name create-sellers