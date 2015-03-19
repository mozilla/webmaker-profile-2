// Mock a successful login and populate basic profile data for user

// Force fake Login
window.TEST.$rootScope.userExists = true;
window.TEST.$rootScope.$apply();

// Populate user profile data
window.TEST.userMetaScope.user = {
  "avatar": "http://localhost:1969/en-US/user/_img/test-avatar.jpg",
  "emailHash": "0",
  "displayName": "mike_danton",
  "links": [
    "http://twitter.com/mike_danton",
    "http://github.com/mike_danton"
  ],
  "id": 1,
  "verified": true,
  "username": "mike_danton",
  "prefLocale": "en",
  "fullName": "mike_danton",
  "deletedAt": null,
  "lastLoggedIn": "2015-03-04 20:40:38.111 +00:00",
  "usePasswordLogin": false,
  "isAdmin": false,
  "isCollaborator": false,
  "isSuspended": false,
  "isMentor": false,
  "isSuperMentor": false,
  "sendNotifications": false,
  "sendEngagements": false,
  "sendEventCreationEmails": true,
  "sendMentorRequestEmails": true,
  "sendCoorganizerNotificationEmails": true,
  "subscribeToWebmakerList": false,
  "wasMigrated": false,
  "bio": "Hello, my name is Mike Danton.",
  "location": "Seattle, WA, United States",
  "createdAt": "2014-11-04T19:38:06.000Z",
  "updatedAt": "2015-03-05T22:43:18.000Z"
};

window.TEST.userMetaScope.canEdit = true;
window.TEST.userMetaScope.$apply();
