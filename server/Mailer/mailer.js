import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import env from 'dotenv';
env.config();
// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

// Load and compile HTML template with Handlebars
function loadTemplate(templateName, replacements) {
  const filePath = path.join(__dirname, 'templates', `${templateName}.html`);
  const source = fs.readFileSync(filePath, 'utf8');
  const template = handlebars.compile(source);
  return template(replacements);
}

// Exported async function to send an email
export default async function sendMail({ to, subject, templateName, replacements }) {
  const html = loadTemplate(templateName, replacements);
  
  
  const mailOptions = {
    from: `"Task Manager" <${process.env.MAIL}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

console.log(process.env.Mail);