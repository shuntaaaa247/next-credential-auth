const fetchUser = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/user/${id}`, { cache: "no-store" });//第二引数で{ cache: "no-store" }を指定しないと古いデータベースからデータを取得してしまうっぽい(なぜ)
  const json = await res.json();
  console.log(json);
  return json.user;
}

const Profile = async ({ params }: { params: { id: string } }) => {
  const user = await fetchUser(params.id);
  const posts = user.posts;
  return(
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1>Profile</h1>
      <p>{user.id}</p>
      <p>{user.username}</p>
      <p>{user.email}</p>
      {posts ? (
        <div>
          <hr />
          <h2>Posts</h2>
          <ul>
            {posts.map((post: any) => (
              <li key={post.id}>{post.description}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No posts found</p>
      )}
    </div>
  )
}

export default Profile;
