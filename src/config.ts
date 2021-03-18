/* ------------ Choosing Env ------------ */
// choosing which env to use before proceed
if (process.env["NODE_ENV"] === 'production') {
    require('custom-env').env(process.env.NODE_ENV);
    console.log(`server running on ${process.env["NODE_ENV"]} mode`);
} else {
    require('dotenv').config();
    console.log(`server running on ${process.env["NODE_ENV"]} mode`);
}


/**
 * @namespace PORT port number to establish connection
 */
export const PORT: number = Number(process.env.PORT) || 6060;
/**
 * @namespace HOST name of host to connect with
 */
export const HOST: string = String(process.env.HOST) || 'localhost';
