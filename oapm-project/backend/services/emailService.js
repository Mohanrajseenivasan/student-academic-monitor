import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"OAPM" <noreply@oapm.edu>',
      to,
      subject,
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendLowAttendanceAlert = async (student, percentage) => {
  const subject = 'Low Attendance Alert - OAPM';
  const html = `
    <h2>Low Attendance Alert</h2>
    <p>Dear ${student.userId?.name || 'Student'},</p>
    <p>Your attendance percentage has dropped to <strong>${percentage}%</strong>.</p>
    <p>Please maintain minimum 75% attendance to be eligible for examinations.</p>
    <p>Regards,<br>OAPM Administration</p>
  `;
  
  if (student.parentInfo?.guardianEmail) {
    await sendEmail(student.parentInfo.guardianEmail, subject, html);
  }
};

export const sendMarksNotification = async (student, subject, marks) => {
  const subjectLine = `Marks Published - ${subject.subjectName}`;
  const html = `
    <h2>Marks Published</h2>
    <p>Dear ${student.userId?.name || 'Student'},</p>
    <p>Your marks for <strong>${subject.subjectName}</strong> have been published.</p>
    <p>Total Marks: <strong>${marks.totalMarks}</strong> / ${marks.totalMaxMarks}</p>
    <p>Percentage: <strong>${marks.percentage}%</strong></p>
    <p>Grade: <strong>${marks.grade}</strong></p>
    <p>Regards,<br>OAPM Administration</p>
  `;
  
  await sendEmail(student.userId?.email, subjectLine, html);
};

export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to OAPM - Account Created';
  const html = `
    <h2>Welcome to OAPM!</h2>
    <p>Dear ${user.name},</p>
    <p>Your account has been created successfully.</p>
    <p>Login credentials:</p>
    <ul>
      <li>Email: ${user.email}</li>
      <li>Password: The password you set during registration</li>
    </ul>
    <p>Login at: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">OAPM Portal</a></p>
    <p>Regards,<br>OAPM Administration</p>
  `;
  
  await sendEmail(user.email, subject, html);
};
