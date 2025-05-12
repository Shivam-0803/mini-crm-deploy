import nodemailer from 'nodemailer';
import config from '../config';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.port === 465,
  auth: {
    user: config.email.smtp.user,
    pass: config.email.smtp.password,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

// Email templates
const templates = {
  welcome: (name) => ({
    subject: 'Welcome to Mini CRM',
    html: `
      <h1>Welcome to Mini CRM, ${name}!</h1>
      <p>We're excited to have you on board!</p>
      <a href="${config.app.url}/campaigns/new">Create Campaign</a>
    `,
  }),

  campaignStarted: (campaignName) => ({
    subject: `Campaign Started: ${campaignName}`,
    html: `
      <h1>Your campaign has started!</h1>
      <p>The campaign "${campaignName}" is now running.</p>
      <a href="${config.app.url}/campaigns">View Campaign</a>
    `,
  }),

  campaignCompleted: (campaignName, stats) => ({
    subject: `Campaign Completed: ${campaignName}`,
    html: `
      <h1>Campaign Completed</h1>
      <p>The campaign "${campaignName}" has finished.</p>
      <h2>Results:</h2>
      <ul>
        <li>Sent: ${stats.sent}</li>
        <li>Opened: ${stats.opened}</li>
        <li>Clicked: ${stats.clicked}</li>
      </ul>
      <a href="${config.app.url}/campaigns">View Campaign</a>
    `,
  }),
};

// Send email function
export const sendEmail = async ({ to, subject, html, template, templateData }) => {
  try {
    let emailContent = { subject, html };

    // Use template if provided
    if (template && templates[template]) {
      emailContent = templates[template](templateData);
    }

    const mailOptions = {
      from: config.email.from,
      to,
      ...emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};

// Example usage:
// await sendEmail({
//   to: 'user@example.com',
//   template: 'welcome',
//   templateData: { name: 'John' }
// });

export default {
  sendEmail,
  templates,
}; 