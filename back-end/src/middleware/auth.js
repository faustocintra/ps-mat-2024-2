/*
Este middleware intercepta todas as rotas e verifica
se um token de autenticação foi enviado junto com a 
request
*/
import jwt from 'jsonwebtoken';

/*
Algumas rotas não precisam de autenticação
*/
const bypassRoutes = [
    {url: '/users/login', method: 'POST'}
];

export default function(req, res, next) {
    /*
    Verificamos se a rota inteceptada corresponde a alguma das
    exceções cadastradas acima, sendo o caso, permite continuar
    sem verificar a autenticação
    */
   for(let route of bypassRoutes) {
        if(route.url === req.url && route.method === req.method) {
            next();
            return;
        }
    }

    
    // PROCESSO DE VERIFICAÇÃO DO TOKEN DE AUTORIZAÇÃO
    let token = null;
    
    // O token é enviado por meio do cabeçalho Authorization da request
    const authHeader = req.headers['authorization'];

    // O cabeçalho Authorization não existe, retorna HTTP 403: Forbidden
    if(!authHeader) {
        console.error('*** ERRO: acesso negado por falta de token de autorização ***');
        res.status(403).end();
        return;
    }

    // O cabeçalho de autorização tem o formato "Bearer XXXXXXXX"
    // onde XXXXXXXX é o token de autorização, portanto, precisamos dividir
    // esse cabeçalho em duas partes, cortando onde está o espaço
    // e aproveitando a segunda parte, que é o token
    token = authHeader.split(' ')[1];

    // Verifica se o token é válido
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        // Se o token não é válido, retorna HTTP 403: Forbidden
        if(error) {
            console.error('*** ERRO: acesso negado; token invalido ou expirado ***');
            res.status(403).end();
            return;
        }

        req.authUser = user;

        // Se o token é válido, permite continuar
        next();
    });
};

// PROCESSO DE VERIFICAÇÃO DO TOKEN DE AUTORIZAÇÃO
