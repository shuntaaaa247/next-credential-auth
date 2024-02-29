import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

//全投稿を取得
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const autherId = searchParams.get("autherId");

  if(!autherId) {//全投稿を取得
    try { 
      connect();
      const posts = await prisma.post.findMany();
      return NextResponse.json({ message: "(全件)取得完了", posts }, { status: 200 });
    } catch(err) {
      return NextResponse.json({ message: "(全件)取得失敗" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };

  try { 
    connect();
    const posts = await prisma.post.findMany({
      where: {
        autherId: Number(autherId)
      }
    });
    return NextResponse.json({ message: `(auhterId=${autherId})取得完了`, posts }, { status: 200 });
  } catch(err) {
    return NextResponse.json({ message: `(auhterId=${autherId})取得失敗` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

//新規投稿
export const POST = async (req: Request) => {
  const { description, autherId } = await req.json();

  if (!description) {
    return NextResponse.json({ message: "内容を追加してください" }, { status: 400 });
  }
  if (!autherId) {
    return NextResponse.json({ message: "作成者のIDを追加してください" }, { status: 400 });
  }

  try {
    connect();
    const post = await prisma.post.create({
      data: {
        description: description,
        autherId: autherId
      }
    })
    return NextResponse.json({ message: "投稿完了", post }, { status: 200 });
  } catch(err) {
    console.log(err);
    return NextResponse.json({ message: "投稿失敗" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}