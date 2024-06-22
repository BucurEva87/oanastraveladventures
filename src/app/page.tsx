export default async function Home() {
  return (
    <>
      <h1>Welcome to Oana&apos;s!</h1>
      <ul>
        <li>{process.env.GOOGLE_CLIENT_ID}</li>
        <li>{process.env.GOOGLE_CLIENT_SECRET}</li>
        <li>{process.env.FACEBOOK_CLIENT_ID}</li>
        <li>{process.env.FACEBOOK_CLIENT_SECRET}</li>
      </ul>
    </>
  )
}
