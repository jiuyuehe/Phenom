/**
 * config
 */
var path = require('path');

exports.config = {
    debug: true,
    name: 'phenom',
    description: 'phenom',
    upload_dir: path.join(__dirname, 'public', 'temp'),
    session_secret: 'oatos_session',
    port: 3000,

    db: "mongodb://127.0.0.1/phenom"
};
