import { PrismaClient } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

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

// postのidで一つの投稿を取得する
export const GET = async (req: Request, { params }: { params: Params }) => {
  try {
    const targetId: number = Number(params.id);

    await connect();

    const post = await prisma.post.findUnique({
      where: {
        id: targetId
      }
    })

    if (!post) {
      return NextResponse.json({ message: "投稿が見つかりませんでした" }, { status: 404 })
    }

    return NextResponse.json({ message: "取得完了", post }, { status: 200 })
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "取得失敗" }, { status: 500 })
  } finally {
    await prisma.$disconnect();
  }
}
