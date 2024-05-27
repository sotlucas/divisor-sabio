import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  bcc,
  subject,
  html,
}: {
  to?: string;
  bcc?: string[];
  subject: string;
  html: string;
}) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transport.verify();
    console.log("Conectado al servidor SMTP");
  } catch (error) {
    console.log("Error al conectar al servidor SMTP", error);
  }

  try {
    await transport.sendMail({
      from: `Divisor Sabio ${process.env.SMTP_EMAIL}`,
      bcc,
      to,
      subject,
      html,
    });
    console.log("Email enviado");
  } catch (error) {
    console.log("Error al enviar email", error);
  }
};
