import Image from "next/image";
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth/authOptions'
import NextLink from "next/link";
import { revalidatePath } from 'next/cache'

const fetchPosts = async () => {
  const res = await fetch("http://localhost:3000/api/post", { cache: "no-store" });
  const json = await res.json();
  return json.posts;
}

const fetchLoginedUser = async (email: string) => {
  const res = await fetch(`http://localhost:3000/api/user?email=${email}`, { cache: "no-store" });
  const json = await res.json();
  return json.user;
}

export default async function Home() {

  const session = await getServerSession(authOptions);
  const posts = await fetchPosts();

  const user = session?.user?.email ? 
    await fetchLoginedUser(session?.user?.email) :
    null

  const post = async (formData: FormData) => {
    "use server"
    const description = formData.get("description");//name="description"のinput, textareaから入力内容を取得

    try {
      const res = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description,
          autherId: user?.id
        }),
      })
      console.log(await res.json())
      revalidatePath('/'); //ページを更新
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Home</h1>
      {session?.user?.email}
      {posts.map((post: any) => {
        return(
          <div key={post.id}>
            <h1>{post.description}</h1>
          </div>
        )
      })}

      <div className="mt-10">
        <h2>ログイン中のユーザー</h2>
        <p>{user.id}</p>
        <p>{user.username}</p>
        <p>{user.email}</p>
        { user ? <NextLink href={`/profile/${user.id}`}>あなたのプロフィールへ</NextLink> : <></>}
      </div>

      <div className="mt-10">
        <h2>投稿フォーム</h2>
        <form action={post}>
          <textarea name="description" id="description" className="bg-stone-100"></textarea>
          <button>投稿する</button>
        </form>
      </div>
    </main>
  );
}
