# Criação do projeto back-end:
npx @aka-demy/create-express-app

perguntas feitas pelo comando:
*OK to proceed? y
Give a name for the app: back-end
Language: Javascript
Template engine: None
Package manager: npm

# Executar no terminal:
cd back-end
npm run dev

# Instalação do Prisma (ORL):
npm install prisma --save-dev

# inicialização do Prisma:
npx prisma init --datasource-provider postgresql

# Executando uma migration no Prisma 

npx prisma migrate dev --name create-cars (criando a tabela cars)

npx prisma migrate dev --name create-customers (criando a tabela customers)