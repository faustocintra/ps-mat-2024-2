# ps-mat-2024-2
Repositório da disciplina Eletiva II - Programação de Scripts, 5º semestre ADS matutino Fatec Franca 2024/2

# Criação do projeto back-end
npx @aka-demy/create-express-app

Perguntas feitas pelo comando:
- OK to proceed? y
- Give a name for the app: back-end
- Language: Javascript
- Template engine: None
- Package manager: npm

# Instalação do Prisma (ORM)
npm install prisma --save-dev

# Inicialização do Prisma
npx prisma init --datasource-provider postgresql

# Executando uma migration no Prisma
npx prisma migrate dev --name create-cars

# Alterar tabela com Prisma
npx prisma migrate dev --name alter-cars

# Ver dados com o Prisma
npx prisma studio