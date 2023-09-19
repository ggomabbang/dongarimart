import { NextResponse } from "next/server";
import { resolve } from "styled-jsx/css";

const mysql = require('mysql2/promise');

const connection1 = await mysql.createConnection({
    host: '127.0.0.1',    // MySQL 호스트명
    user: 'root',     // 사용자 이름
    password: 'ILoveForkBelly123!', // 비밀번호
    database: 'wave'    // 데이터베이스 이름
}); 

function addNew({username, email}) {
    const newUser = { username: username, email: email };
    connection1.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) {
        console.error('Error inserting data:', err);
        return 99;
        }
        console.log('Inserted new user with ID:', result.insertId);
        return 0;
    });
}

export async function GET() {
    let [rows, fields] = await connection1.query('SELECT * FROM clublist');
    console.log(rows);
    return NextResponse.json(rows);
}

export async function DELETE(request) {
    const { username, email } = await request.json();

    if (!username || !email) return NextResponse.json({ 'message': "missing required data"});

    connection1.query(`DELETE FROM users WHERE username='${username}' AND email='${email}'`,  (err, result) => {
        if (err) {
        console.error('Error deleting data:', err);
        return 99;
        }
        console.log('Deleted.');
    });

    return NextResponse.json({ "message": "deleted"})
}

export async function POST(request) {
    const { username, email } = await request.json();

    if (!username || !email) return NextResponse.json({ 'message': "missing required data"});

    if (addNew({username, email}) === 99) {
        return NextResponse.json({ 'message': "Err: Failed to insert"})
    }

    return NextResponse.json({ 'message': "added"});
}

export async function PUT(request) {
    const { username, email } = await request.json();

    return NextResponse.json({'message': "working in progress"});
}