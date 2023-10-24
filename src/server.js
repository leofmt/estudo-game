import fastify from "fastify";
import { DatabaseProgress } from "../src/database-postgres.js";
const server = fastify();

const database = new DatabaseProgress();

//Retornar usuário
server.get('/users/:id', function(request, reply){
    const userId = request.params.id;
    database.list( userId );



    return reply.status(200).send( ret );
});

//Incluir Usuários
server.post('/users', async function(request, reply){
    const body = request.body;
    console.log(body);

    const ret = await database.create(body);
    if(ret.status == "401"){
        return reply.status(401).send(ret.message);
    }

    return reply.status(201).send("Incluído com sucesso!");
});

//Atualizar usuários
server.put('/users', function(request, reply){
    return reply.status(204).send();
});

server.listen({
    port: 3333
});