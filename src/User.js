import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "./db.js";
import 'dotenv/config';

export class User{
    //Registrar novos usuários
    async registrar(user){
        const userId = await randomUUID();
        const { usuario, nome, senha, email, nascimento, psn, xbox, steam } = user;
        
        try{
            if( !usuario || !nome || !senha || !email || !nascimento){
                throw "Campo obrigatório não preenchido";
            }
            const newSenha = bcrypt.hashSync(senha, 10);
            const retSQL = await sql`
                INSERT INTO USUARIOS 
                    (ID_USER, USUARIO, NOME, SENHA, EMAIL, DATA_NASCIMENTO, ID_PSN, ID_XBOX, ID_STEAM) 
                VALUES 
                    (${userId}, ${usuario}, ${nome}, ${newSenha}, ${email}, ${nascimento}, ${psn??''}, ${xbox??''}, ${steam??''})
            `;
            
            return {
                status: "201",
                message: "Incluído com sucesso!"
            };
        }
        catch(e){
            console.log(e);
            return {
                status: "401",
                message: e.toString()
            }
        }
    }

    //Executar Login
    async login(loginObject){
        const user = loginObject.usuario;
        const password = loginObject.password;
        const retSQL = await sql`
            SELECT 
                ID_USER, SENHA
            FROM 
                USUARIOS 
            WHERE 
                USUARIO = ${user}
        `;

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

    //Listar informações do usuário
    async list(userId){
        const retSQL = await sql`
            SELECT 
                NOME, ID_USER 
            FROM 
                USUARIOS 
            WHERE 
                ID_USER = ${userId}
        `;
        
        if(retSQL.length > 0){
            return {
                status: "200", 
                message: retSQL
            };
        }
        
        return {
            status: "400",
            message: "Nenhum registro encontrado!"
        };
    }
}