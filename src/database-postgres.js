import { randomUUID } from "node:crypto";
import sql from "./db.js";

export class DatabaseProgress{
    async list(search){
        
    }
    async create(user){
        const userId = await randomUUID();
        const { usuario, nome, senha, email, nascimento, psn, xbox, steam } = user;
        
        try{
            if( !usuario || !nome || !senha || !email || !nascimento){
                throw "Campo obrigatório não preenchido";
            }

            await sql`insert into USUARIOS (ID_USER, USUARIO, NOME, SENHA, EMAIL, DATA_NASCIMENTO, ID_PSN, ID_XBOX, ID_STEAM) values (${userId}, ${usuario}, ${nome}, ${senha}, ${email}, ${nascimento}, ${psn??''}, ${xbox??''}, ${steam??''})`;

            return {
                status: "201",
                message: "Incluído com sucesso!"
            };
        }
        catch(e){
            console.log(e);
            return {
                status: "401",
                message: e
            }
        }
    }
    async update(id, user){

    }
    async delete(id){

    }
}

