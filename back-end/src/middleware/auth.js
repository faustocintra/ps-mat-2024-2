import jwt from 'jsonwebtoken'

const bypassRoutes = [
    {url: '/users/login', method: 'POST'}
]


export default function(req, res, next){
    for(let route of bypassRoutes){
        if(route.url === req.url && route.method === req.method){
            next()
            return 
        }
    }

let token = null

const authHeader = req.headers['authorization']

if(! authHeader){
    console.error('*** ERRO: acesso negado por falta de cabeçalho de autorização***')
    return res.status(403).end()
}

token = authHeader.split(' ')[1]

jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
    if(error){
        console.error('*** ERRO: acesso negado; token inválido ou expirado***')
        return res.status(403).end
    }
})


req.authUser = user
next()

}