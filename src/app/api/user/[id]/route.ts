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

export const GET = async (req: Request, { params }: { params: Params }) => {
  try {
    const targetId: number = Number(params.id);
    await connect();
    const user = await prisma.user.findUnique({
      where: {
        id: targetId
      },
      include: { 
        posts: true //One To Manyで親(One)から子(many)を参照するには親の子要素配列フィールドをこのように設定してあげる必要がある。
      },
    });
    if(user) {
      console.log("ここだよ〜〜〜〜");
      const { password, ...other } = user;
      return NextResponse.json({ message: "取得完了", user: other }, { status: 200 });
      // return NextResponse.json({ message: "取得完了", posts: posts }, { status: 200 });
    }
    return NextResponse.json({ message: "ユーザーが見つかりませんでした" }, { status: 404 })
  } catch(err) {
    console.error(err);
    return NextResponse.json({ message: "取得失敗" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
