import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail() {

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

        console.error(error);
    }

}