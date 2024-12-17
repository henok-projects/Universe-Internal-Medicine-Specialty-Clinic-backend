require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ['https://universe-internal-medicine-specialty-clinic-xvy6.vercel.app', 'http://localhost:3000'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
);
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  const htmlTemplate = `
  <div style="width:800px; margin:0 auto; background-color:rgb(8, 24, 94); font-family:Arial, sans-serif; color:#fff;">
    <table cellpadding="10" cellspacing="0" border="0" width="100%" style="border:1px solid #ddd; background:#fff;">
      <!-- Header Section -->
      <tr>
        <td style="background:rgb(8, 24, 94); padding:15px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:24px;">Universe Internal Medicine Specialty Clinic</h1>
          <p style="margin:5px 0; font-size:14px;">Your Health, Our Priority</p>
        </td>
      </tr>

      <!-- Welcome Banner -->
      <tr>
       <td style="padding:20px; margin-left:10px;">
          <img src="cid:logo" alt="Clinic Logo" style="width:50px; height:50px; margin-bottom:10px; border-radius:50%; object-fit:cover;" />
       </td>
      </tr>

      <!-- Message Section -->
      <tr>
        <td style="padding:20px;">
          <h2 style="font-size:18px; color:rgb(8, 24, 94); margin:0 0 15px;">Hello ${firstName},</h2>
          <p style="font-size:14px; line-height:22px; margin:0 0 20px; color:#333;">
            Thank you for reaching out to Universe Internal Medicine Specialty Clinic. We appreciate your interest and will get back to you shortly.
          </p>
          <p style="font-size:14px; margin:0 0 10px; color:#333;">Here is a copy of your message:</p>
          <div style="border-left:4px solid rgb(8, 24, 94); padding-left:15px; margin:10px 0; background:#f4f4f4; color:#333;">
            <p style="margin:0; font-size:14px;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin:10px 0 0; font-size:14px;"><strong>Message:</strong> ${message}</p>
          </div>
          <p style="font-size:14px; margin:20px 0 5px;">Best regards,</p>
          <p style="font-size:14px; font-weight:bold; margin:0; color:#333;">Universe Internal Medicine Specialty Clinic</p>
        </td>
      </tr>

      <!-- Footer Section -->
      <tr>
        <td style="background:rgb(8, 24, 94); text-align:center; color:#fff; padding:15px;">
          <p style="margin:5px 0;">For support, call: <strong>0116390354</strong></p>
          <p style="margin:5px 0;">Email: <strong>universeclinic2023@gmail.com</strong></p>
          <p style="margin:10px 0 0; font-size:12px;">&copy; ${new Date().getFullYear()} Universe Internal Medicine Specialty Clinic. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </div>
`;
  try {
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`, // Your email as the sender
      to: process.env.WEBSITE_OWNER_EMAIL, // Website owner's email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
    <div style="width:800px; margin:0 auto; background-color:rgb(8, 24, 94); font-family:Arial, sans-serif; color:#fff;">
      <table cellpadding="10" cellspacing="0" border="0" width="100%" style="border:1px solid #ddd; background:#fff;">
        <!-- Header Section -->
        <tr>
          <td style="background:rgb(8, 24, 94); padding:15px; text-align:center; color:#fff;">
            <h1 style="margin:0; font-size:24px;">Universe Internal Medicine Specialty Clinic</h1>
            <p style="margin:5px 0; font-size:14px;">New Contact Form Submission</p>
          </td>
        </tr>
         <!-- Welcome Banner -->
        <tr>
          <td style="padding:20px; margin-left:10px;">
            <img src="cid:logo" alt="Clinic Logo" style="width:50px; height:50px; margin-bottom:10px; border-radius:50%; object-fit:cover;" />
          </td>
        </tr>
        <!-- Contact Details Section -->
        <tr>
          <td style="padding:20px;">
            <h2 style="font-size:18px; color:rgb(8, 24, 94); margin:0 0 15px;">Contact Details</h2>
            <div style="border-left:4px solid rgb(8, 24, 94); padding-left:15px; margin:10px 0; background:#f4f4f4; color:#333;">
              <p style="margin:0; font-size:14px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Email:</strong> ${email}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Message:</strong> ${message}</p>
            </div>
          </td>
        </tr>

        <!-- Footer Section -->
        <tr>
          <td style="background:rgb(8, 24, 94); text-align:center; color:#fff; padding:15px;">
            <p style="margin:5px 0;">For support, call: <strong>0116390354</strong></p>
            <p style="margin:5px 0;">Email: <strong>universeclinic2023@gmail.com</strong></p>
            <p style="margin:10px 0 0; font-size:12px;">&copy; ${new Date().getFullYear()} Universe Internal Medicine Specialty Clinic. All Rights Reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `,
      attachments: [
        {
          filename: 'universe-Logo-1.png',
          path: './universe-Logo-1.png', // Local path to the image
          cid: 'logo', // Use the same `cid` in the HTML `src`
        },
      ],
    });
    // Confirmation email to the user
    await transporter.sendMail({
      from: `"Universe Internal Medicine Specialty Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We Received Your Message',
      html: htmlTemplate,
      attachments: [
        {
          filename: 'universe-Logo-1.png', // Name of the image file
          path: './universe-Logo-1.png', // Path to the image on your server
          cid: 'logo', // Match this `cid` to the `src` in the HTML
        },
      ],
    });

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
