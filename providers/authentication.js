module.exports = {

  basic: function(credential, cb) {
    console.log("on authentication provider %j", credential);
    cb(null, credential.username === 'lighthouse' && credential.password === 'lighthouse');
  },
  clientCertificate: function(certificate, cb) {
    console.log("on authentication provider %j", certificate);
    cb(null, true);
  }
};