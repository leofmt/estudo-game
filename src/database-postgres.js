import { randomUUID } from "node:crypto";
import sql from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export class DatabaseProgress{
    async verifyToken(token){
        const decodedToken = jwt.verify(token, process.env.JWTTOKEN_DEV);
        const {userId} = decodedToken;
        return userId;
    }
    
    async list(userId){
        console.log(userId);
        const retSQL = await sql`SELECT NOME, ID_USER FROM USUARIOS WHERE ID_USER = ${userId}`;
        return {
            status: "200", 
            message: retSQL
        };
    }
    async auth(authObject){
        const user = authObject.usuario;
        const password = authObject.password;
        const retSQL = await sql`SELECT ID_USER, SENHA FROM USUARIOS WHERE USUARIO = ${user}`;

        if(retSQL.length > 0){
            const senhaBanco = retSQL[0].senha;

            const isSamePassword = bcrypt.compareSync(password, senhaBanco);
            if(!isSamePassword){
                return {
                    status: "401", 
                    message: "Senha não confere"
                };
            }

            const userId = retSQL[0].id_user;
            const token = jwt.sign({userId}, process.env.JWTTOKEN_DEV, {expiresIn: "1d"});

            return {
                status: "201", 
                message: `Autenticação válida. Token: ${token}`
            };
        }
        else{
            return {
                status: "401", 
                message: "Usuário não identificado"
            };
        }        
    }

    async create(user){
        const userId = await randomUUID();
        const { usuario, nome, senha, email, nascimento, psn, xbox, steam } = user;
        
        try{
            if( !usuario || !nome || !senha || !email || !nascimento){
                throw "Campo obrigatório não preenchido";
            }
            console.log(`Senha antes da criptografia: ${senha}`);
            const newSenha = bcrypt.hashSync(senha, 10);
            console.log(`Senha depois da criptografia: ${newSenha}`);
            await sql`insert into USUARIOS (ID_USER, USUARIO, NOME, SENHA, EMAIL, DATA_NASCIMENTO, ID_PSN, ID_XBOX, ID_STEAM) values (${userId}, ${usuario}, ${nome}, ${newSenha}, ${email}, ${nascimento}, ${psn??''}, ${xbox??''}, ${steam??''})`;

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

