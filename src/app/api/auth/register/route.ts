import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { getToken } from 'next-auth/jwt'

//インスタンスを作成
const prisma = new PrismaClient();

//データベースに接続
const connect = async () => { //connect()はexportできない。build時にエラーになる
  try {
    //prismaでデータベースに接続
    prisma.$connect;
  } catch(err) {
    console.log(err);
    return Error("データベースに接続できませんでした")
  }
}

//一時的 jwtのトークンを出力する
// export async function GET(req: NextRequest) {
//   const token = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET ?? '',
//   })

//   console.log('token.accessToken: ', token?.accessToken)

//   return NextResponse.json({})
// }

export const POST = async (req: Request, res: NextResponse) => {
  const { username, email, password } = await req.json(); //req.body -> req.json()

  if(username === "" || username == null) {
    return NextResponse.json({ message: "usernameを入力してください" }, { status: 400 })
  }

  if(email === "" || email == null) {
    return NextResponse.json({ message: "メールアドレスを入力してください" }, { status: 400 })
  }

  if(password === "" || password == null) {
    return NextResponse.json({ message: "passwordを入力してください" }, { status: 400 })
  }

  try {
    await connect();
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: await bcrypt.hash(password, 10)
      }
    })

    return NextResponse.json({ message: "作成完了", user: user }, { status: 200 });
  } catch(err) {
    console.log(err);
    return NextResponse.json({ message: "作成失敗" }, { status: 500 });
  } finally {
    await prisma.$disconnect
  }
}