import postgres from 'postgres'
import 'dotenv/config'

const sql = postgres({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${process.env.ENDPOINT_ID}`,
    },
});

//const sql = {teste: "teste"}

/*async function getPostgresVersion() {
const response = await sql`select version()`;
    console.log(response);
}
  
getPostgresVersion();*/

export default sql