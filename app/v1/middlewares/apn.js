// 'use strict';

// var apn = require('apn');
// var options = {
//     token: {
//         key: "path/to/key.p8",
//         keyId: "T0K3NK3Y1D",
//         teamId: "T34M1D",
//     },
//     production: false,
// };

// var apnProvider = new apn.Provider(options);

// let deviceToken = "a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7"

// var note = new apn.Notification();

// note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
// note.badge = 3;
// note.sound = "ping.aiff";
// note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
// note.payload = {'messageFrom': 'John Appleseed'};
// note.topic = "<your-app-bundle-id>";

// apnProvider.send(note, deviceToken).then( (result) => {
//     // see documentation for an explanation of result
// });