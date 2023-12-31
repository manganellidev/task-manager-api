const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail
        .send({
            to: email,
            from: 'gilbertojuru@gmail.com',
            subject: 'Thanks for joining in!',
            text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
        })
        .catch((error) => console.log('Unable to send email.', error.message));
};

const sendCancelEmail = (email, name) => {
    sgMail
        .send({
            to: email,
            from: 'gilbertojuru@gmail.com',
            subject: 'Sorry to see you go!',
            text: `Goodbye, ${name}. I hope to see you back sometime soon.`
        })
        .catch((error) => console.log('Unable to send email.', error.message));
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
};
