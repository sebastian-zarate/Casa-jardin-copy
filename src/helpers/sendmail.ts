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

export const sendEmailCustom = async (email: string, titulo?: string, texto?: string): Promise<void> => {
  const response = await fetch("/api/sendMailcustom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receptor: email, titulo: titulo, texto: texto }),
  });

  if (!response.ok) {
    throw new Error("Error sending email");
  }
};