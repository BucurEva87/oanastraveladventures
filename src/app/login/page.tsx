import { getServerSession } from "next-auth"
import authOptions from "../../../auth/authOptions"
import { redirect } from "next/navigation"
import LoginForm from "./Form"

const Login = async () => {
  const session = await getServerSession(authOptions)

  if (session) redirect("/")

  return (
    <section className="container h-screen flex items-center justify-center">
      <div className="w-[800px]">
        <LoginForm />
      </div>
    </section>
  )
}
export default Login
