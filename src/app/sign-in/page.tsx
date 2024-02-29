"use client"
import { useForm, SubmitHandler } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import IsLogedIn from './isLogedIn'
import { useRouter } from 'next/navigation'

type Inputs = {
  email: string,
  password: string
}

const SignIn = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmitFunc: SubmitHandler<Inputs> = async (data) => {
    console.log("data = ", data);
    const result = await signIn("user", {
      redirect: false,
      email: data.email,
      password: data.password
    });

    if (result?.error) {
      // ログイン失敗時処理
      console.log("ログイン失敗")
    } else {
      // ログイン成功時トップページへリダイレクト
      router.push("/")
      console.log("result = ", result)
      alert("成功")
    }
  }

  return(
    <div className="flex min-h-screen flex-col items-center p-24">
      <form onSubmit={handleSubmit(onSubmitFunc)}>
        <div>
          <label htmlFor="">email</label>
          <br />
          <input type="email" {...register("email", {required: true })} placeholder='xxx@yyy.com'/>
        </div>
        <div>
          <label htmlFor="">password</label>
          <br />
          <input type='password' {...register("password", {required: true })} placeholder='password'/>
        </div>
        <button type='submit'>ボタン</button>
      </form>
      <SessionProvider>
        <IsLogedIn />
      </SessionProvider>
      
    </div>
  )
}

export default SignIn