import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";


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

//emailでユーザーを取得
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if(!email) {
    return NextResponse.json({ message: "emailを指定してください" }, { status: 400 })
  }

  try {
    connect();
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if(user) {
      const { password, ...other } = user
      return NextResponse.json({ message: "取得完了", user: other }, { status: 200 });
    }
  } catch(err) {
    console.error(err);
    return NextResponse.json({ message: "取得失敗" }, { status: 500 });
  }
}