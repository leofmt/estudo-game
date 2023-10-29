import fastify from "fastify";
import { User } from "../src/User.js";
import { Auth } from "../src/Auth.js";
const server = fastify();


const classAuth = new Auth();
const classUser = new User();

//Executar autenticação
server.post('/auth', async (request, reply) => {
    const body = request.body;
    const ret = await classUser.login( body );
    return reply.status(ret.status).send( {message: ret.message} );
});

//Retornar usuário
server.get('/users/:id', async (request, reply) => {
    const userId = request.params.id;
    const ret = await classUser.list( userId );
    return reply.status(ret.status).send( {message: ret.message} );
});

//Retornar rota autenticada
server.get(
    '/verifyAuth',
    {
        preHandler: async (request, reply, done) => {
            //Bearer token
            const token = request.headers.authorization?.replace(/^Bearer /, "");
            if(!token){
                return reply.status(401).send({message: `Unauthorized: token missing`});
            }

            const userId = await classAuth.verifyToken(token);
            if(!userId){
                reply.status(404).send({message: "Usuário não identificado!"});
            }
            request.auth = {userId};

            done();
        }
    },
    async (request, reply) => {
        const userId = request.auth.userId;
        return reply.status(200).send( {message: userId} );
    }
);

//Incluir Usuários
server.post('/users', async (request, reply) =>{
    const body = request.body;
    const ret = await classUser.registrar(body);
    return reply.status(ret.status).send({message: ret.message});
});

server.listen({
    port: process.env.PORT ?? 3333
});