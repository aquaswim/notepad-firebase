const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'envconfig.firebase': {
        apiKey: JSON.stringify(process.env.FIREBASE_APIKEY),
        authDomain: JSON.stringify(process.env.FIREBASE_AUTHDOMAIN),
        databaseURL: JSON.stringify(process.env.FIREBASE_DATABASEURL),
        projectId: JSON.stringify(process.env.FIREBASE_PROJECTID),
        storageBucket: JSON.stringify(process.env.FIREBASE_STORAGEBUCKET),
        messagingSenderId: JSON.stringify(process.env.FIREBASE_MESSAGINGSENDERID),
        appId: JSON.stringify(process.env.FIREBASE_APPID),
        measurementId: JSON.stringify(process.env.FIREBASE_MEASUREMENTID),
      }
    })
  ]
}
