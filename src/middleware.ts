export { default } from "next-auth/middleware"; //この1行でログインしていなければ/sign-in(authOptions.tsのpagesで設定)にredirectされるようになる。

export const config = {
  matcher: [
    "/", 
    "/profile"
    // "/(?!sign-in)"
  ],
};