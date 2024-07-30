const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv");
dotenv.config();

let DBInstance = null;


// const env = {
//     DB_URI: process.env.DB_URI,
//     DB_NAME: process.env.DB_NAME,
//     PORT: process.env.PORT,
//     BUILD_MODE: process.env.BUILD_MODE
// }
const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

const CONNECT_DB = async () => {
    try {
        await client.connect();
        DBInstance = client.db(process.env.DB_NAME);
    } catch (error) {
        console.error('Lỗi khi kết nối đến MongoDB:', error);
        throw error; // Xử lý hoặc lan truyền lỗi tùy vào từng trường hợp
    }
};

const GET_DB = () => {
    if (!DBInstance) throw new Error('Phải kết nối đến cơ sở dữ liệu trước!');
    return DBInstance;
};

exports.module = {CONNECT_DB, GET_DB}
