const sgMail = require("@sendgrid/mail")


const sendGridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridApiKey);

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to : email,
        from : "ammth112@gmail.com",
        subject : "Welcome to the App",
        text : `Hey ${name}, Welcome to the service. Hope you have a great time`
    })
}

const sendGoodbyeMail = (email,name) =>{
    sgMail.send({
        to: email,
        from : "ammth112@gmail.com",
        subject : "Account Removal Confermation",
        text : `Goodbye ${name}, Sad to see you go. 
        Hope we could have done better. 
        The account associated with email : ${email} has been successfully removed`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeMail,
}