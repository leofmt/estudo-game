import fastify from "fastify";
import { DatabaseProgress } from "../src/database-postgres.js";
const server = fastify();

const database = new DatabaseProgress();

//Executar autenticação
server.post('/auth', async (request, reply) => {
    const body = request.body;
    const ret = await database.auth( body );
    if(ret.status == "200"){
        return reply.status(200).send( ret );
    }
    else{
        return reply.status(401).send( ret );
    }
    
});


//Retornar usuário
server.get('/users/:id', async (request, reply) => {
    const userId = request.params.id;
    console.log("userId consulta");
    const ret = await database.list( userId );
    console.log(ret);
    return reply.status(200).send( ret );
});

//Retornar rota autenticada
server.get(
    '/testAuthorization',
    {
        preHandler: async (request, reply, done) => {
            //Bearer token
            const token = request.headers.authorization?.replace(/^Bearer /, "");
            if(!token){
                return reply.status(401).send({message: `Unauthorized: token missing`});
            }

            const userId = await database.verifyToken(token);
            if(!userId){
                reply.status(404).send({message: "Usuário não identificado!"});
            }
            request.auth = {userId};

            done();
        }
    },
    async (request, reply) => {
        const userId = request.auth.userId;
        return reply.status(200).send( userId );
    }
);

//Incluir Usuários
server.post('/users', async (request, reply) =>{
    const body = request.body;
    const ret = await database.create(body);
    if(ret.status == "401"){
        return reply.status(401).send(ret.message);
    }

    return reply.status(201).send("Incluído com sucesso!");
});

//Atualizar usuários
server.put('/users', (request, reply) =>{
    return reply.status(204).send();
});

server.listen({
    port: 3333
});