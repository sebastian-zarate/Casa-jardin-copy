export const sendEmail = async (email: string): Promise<void> => {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receptor: email }),
    });
  
    if (!response.ok) {
      throw new Error("Error sending email");
    }
  };