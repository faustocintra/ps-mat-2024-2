# ps-mat-2024-2
Repositório da disciplina Eletiva II - Programação de Scripts, 5º semestre ADS matutino Fatec Franca 2024/2
npx @aka-demy/create-express-app

Peerguntas feitas pelo comando:
OK to proceed? y
Give a name fo the app: back-end
Language: JavaScript
Template engine: none
Package manager: npm

# Execução do projeto back-end

Executar no terminal:
* cd back-end
* npm run dev

# Instalação do prisma (ORM)

npm install prisma --save-dev

# Inicialização do prisma

npx prisma init --datasource-provider postgresql

# Executando ima migration no Prisma

npx prisma migrate dev --name create-cars