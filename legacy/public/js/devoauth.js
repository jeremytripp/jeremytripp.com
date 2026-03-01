// Facebook auth (no longer used). Set FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET in env if needed.
var ids = {
    facebook: {
        clientID: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback'
    }
};

module.exports = ids;