const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
    try {
        // Set SendGrid API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const property = req.body;

        if (!property) {
            context.res = {
                status: 400,
                body: "Please provide property information in the request body"
            };
            return;
        }

        const emailContent = `
            New Property Listed!
            
            Location: ${property.location.city}
            Price: €${property.price}
            Type: ${property.type}
            Size: ${property.size}m²
            Bedrooms: ${property.bedrooms || 'N/A'}
            Contact: ${property.contact.name} (${property.contact.email})
            
            View more details on our website.
        `;

        const msg = {
            to: process.env.NOTIFICATION_EMAIL_TO,
            from: process.env.NOTIFICATION_EMAIL_FROM,
            subject: `New Property Listed in ${property.location.city}`,
            text: emailContent,
        };

        await sgMail.send(msg);

        context.res = {
            status: 200,
            body: "Notification sent successfully"
        };
    } catch (error) {
        context.log.error('Error sending notification:', error);
        context.res = {
            status: 500,
            body: "Failed to send notification"
        };
    }
}