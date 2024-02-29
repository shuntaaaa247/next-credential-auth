import { useSession } from "next-auth/react"
import { getToken } from "next-auth/jwt"



const IsLogedIn = () => {
  const { data: session, status } = useSession();

  return(
    <>
      {
        (status === "authenticated") ?
          <div>
            <div>ログインしてる{session.user?.email ?? "わっしょい"}</div>
            <button onClick={() => console.log(session)}>sessionを確認する</button>
          </div>
        :
          <div>ログインしてない</div>
      }
    </>
  )
}
export default IsLogedIn