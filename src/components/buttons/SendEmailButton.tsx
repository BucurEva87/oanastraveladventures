"use client"

import { notify } from "../Notification"

const SendEmailButton = () => {
  const handleClick = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/resend`,
        { method: "POST" }
      )

      if (!response.ok) {
        notify({
          type: "error",
          title: "Oups! There was an error",
          description: "Some error occurred and the response is not ok",
        })
        return
      }
    } catch (error) {
      notify({
        type: "error",
        title: "Oups! There was an error",
        description: error as string,
      })
    }

    notify({
      type: "success",
      title: "Yahoo! You did it!",
      description: "The email was successfully sent",
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
    >
      Send test email
    </button>
  )
}

export default SendEmailButton
