// este middleware interpreta todas as rotas e verifica se um token de autenticação foi enviado junto com a request

import jwt from 'jsonwebtoken'
// algumas rotas, como user ou login poderao ser acessadas sem a necessidade de apresentação do token
const bypassRoutes =[
    {url: '/users/login', method: 'POST' }
 ]

export default function(req,res,next){
    // verifica se a rota interpretada corresponde a alguma das exceções cadastradas acima, Sendo o caso, permite continuar sem verificar a autenticaão.
    for (let route of bypassRoutes){
        if(route.url === req.url && route.method === req.method){
            next()
            return
        }
    }
    // processo de verificação do token de autorização 
    let token = null
    // o token é enviado por meio do cabeçalho 'autorization' da request

    const authHeader = req.headers['authorization']
    console.log({HEADERS : req.headers})

    // o cabecalho authorization nao existe retorna HTTP 403 : forbiden

    if(!authHeader){
        console.error('*** ERRO: acesso negado por falta de cabeçalho de autorização ***')
        return res.status(403).end()
    }
    // o cabeçalho de autorização tem o formato "Bearer : xxxxxxx", 
    // onde xxxxxxxx é um token.Portanto precisamos dividir esse cabeçalho em duas partes 
    // cortando-o onde esta o carcter de espaço e aproveitar apenas a segunda parte

    token = authHeader.split(' ')[1]
    // validação do token
    jwt.verify(token, process.env.TOKEN_SECRET,(error,user)=>{
        // token invalido ou expirado, retorna 
        //HTTP 403: Forbideden
        if (error){
            console.error('***ERRO: Acesso negado; token inválido ou expirado***')
            return res.status(403).end()
        
        }
        // se chegarmos até aqui o token esta ok e temos as informações do usuario logado no paramentro 'user'
        // vamos guardar isso dentro da 'req' para usar depois
        req.authUser = user
        // continua para a rota normal
        next()
    })
}