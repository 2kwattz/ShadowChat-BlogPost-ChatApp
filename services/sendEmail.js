import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(toEmail,subject,html) {

    try {

        const response = await resend.emails.send({

            from: "onboarding@resend.dev",
            to: "roshan.bhatia.blueera@gmail.com",
            subject: "Hello World",
            html: `
                <p>
                    Congrats on sending your
                    <strong>first email</strong>!
                </p>
            `
        });

        console.log(response);

    } catch (error) {

        console.error(`[*] Error while sending email ${error.message || error}`);

        throw error;
    }

}

export default sendEmail;