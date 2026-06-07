import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/*
    e.g. : sendEmail(['test@uuuuuu.com'], 'Hello world!', '<strong>It works!</strong>')
*/
export async function sendEmail(client_mail, mail_subject, mail_text) {
    return resend.emails.send({
        from: 'StudyUp <onboarding@resend.dev>',
        to: client_mail,
        subject: mail_subject,
        html: mail_text,
    });
}
