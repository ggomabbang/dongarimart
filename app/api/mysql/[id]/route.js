import { NextResponse } from "next/server";
import { resolve } from "styled-jsx/css";

const mysql = require('mysql2/promise');

const connection1 = await mysql.createConnection({
    host: 'localhost',    // MySQL 호스트명
    user: 'root',     // 사용자 이름
    password: '', // 비밀번호
    database: 'test'    // 데이터베이스 이름
}); 

export async function GET(request) {
    const id = request.url.slice(request.url.lastIndexOf('/') + 1);
    let [rows, fields] = await connection1.query(`SELECT * FROM users WHERE id = ${id}`);
    console.log(rows);
    return NextResponse.json(rows);
}
