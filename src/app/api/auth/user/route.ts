import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

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

//全てのユーザーを取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    connect();
    const users = await prisma.user.findMany();
    return NextResponse.json({ users }, { status: 200 })
  } catch(err) {
    console.log(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

//ログイン時にユーザーを取得
export const POST = async (req: Request, res: NextResponse) => {
  const { email, password } = await req.json(); //req.body -> req.json()

  if(email === "" || email == null) {
    return NextResponse.json({ message: "メールアドレスを入力してください" }, { status: 400 })
  }

  if(password === "" || password == null) {
    return NextResponse.json({ message: "passwordを入力してください" }, { status: 400 })
  }

  try {
    await connect();
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        // password: await bcrypt.hash(password, 10)
      }
    });

    if( user && await bcrypt.compare(password, user?.password)) { //bcrypt.compare("平文のパスワード", "ハッシュ化済みのパスワード")
      return NextResponse.json({ user: user }, { status: 200 });
    } else {
      throw new Error("パスワードが違います")
    }
  } catch(err) {
    console.log(err);
    return NextResponse.json({ message: "ユーザーが見つかりませんでした" }, { status: 401 });
  } finally {
    await prisma.$disconnect
  }
}