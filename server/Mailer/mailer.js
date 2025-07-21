import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import env from "dotenv";
env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

function loadTemplate(templateName, replacements) {
  const filePath = path.join(__dirname, "templates", `${templateName}.html`);
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  return template(replacements);
}

export default async function sendMail({
  to,
  subject,
  templateName,
  replacements,
}) {
  const html = loadTemplate(templateName, replacements);

  const mailOptions = {
    from: `"Task Manager" <${process.env.MAIL}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}
