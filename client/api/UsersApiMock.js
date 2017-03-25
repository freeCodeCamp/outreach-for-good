import delay from './delay';
/* eslint-disable */

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const users = [
  {
    _id      : '58bf5cc5563060d37fe5c840',
    provider : 'local',
    name     : 'Mock User 3',
    email    : 'mock-user-3@gmail.com',
    provider : 'google',
    google   : {
      displayName : 'Mock User',
      name        : {
        familyName : 'User',
        givenName  : 'Mock'
      },
      url   : 'https://plus.google.com/+Mock',
      image : {
        url       : 'https://lh5.googleusercontent.com/-uKvlbrkAhvI/AAAAAAAAAAI/AAAAAAAAAls/Qqp1pxNamj8/photo.jpg?sz=50',
        isDefault : false
      },
      isPlusUser : true,
      language   : 'en',
      verified   : false,
      cover      : {
        layout     : 'banner',
        coverPhoto : {
          url    : 'https://lh3.googleusercontent.com/Hl1_RYBHDMy-W1Qrc6NmppJLZwLEkbFZp0ux2H2gPfsN2bih8t9V9r8cfi95dkufeXdYQYEa=s630',
          height : 188,
          width  : 940
        },
        coverInfo : {
          topImageOffset  : -5,
          leftImageOffset : 0
        }
      }
    },
    __v  : 0,
    role : 'super'
  }, {
    _id      : '58bf5cc5563060d37fe5c840',
    provider : 'local',
    name     : 'Mock User 3',
    email    : 'mock-user-3@gmail.com',
    provider : 'google',
    google   : {
      displayName : 'Mock User',
      name        : {
        familyName : 'User',
        givenName  : 'Mock'
      },
      url   : 'https://plus.google.com/+Mock',
      image : {
        url       : 'https://lh5.googleusercontent.com/-uKvlbrkAhvI/AAAAAAAAAAI/AAAAAAAAAls/Qqp1pxNamj8/photo.jpg?sz=50',
        isDefault : false
      },
      isPlusUser : true,
      language   : 'en',
      verified   : false,
      cover      : {
        layout     : 'banner',
        coverPhoto : {
          url    : 'https://lh3.googleusercontent.com/Hl1_RYBHDMy-W1Qrc6NmppJLZwLEkbFZp0ux2H2gPfsN2bih8t9V9r8cfi95dkufeXdYQYEa=s630',
          height : 188,
          width  : 940
        },
        coverInfo : {
          topImageOffset  : -5,
          leftImageOffset : 0
        }
      }
    },
    __v  : 0,
    role : 'super'
  }, {
    _id      : '58bf5cc5563060d37fe5c840',
    provider : 'local',
    name     : 'Mock User 3',
    email    : 'mock-user-3@gmail.com',
    provider : 'google',
    google   : {
      displayName : 'Mock User',
      name        : {
        familyName : 'User',
        givenName  : 'Mock'
      },
      url   : 'https://plus.google.com/+Mock',
      image : {
        url       : 'https://lh5.googleusercontent.com/-uKvlbrkAhvI/AAAAAAAAAAI/AAAAAAAAAls/Qqp1pxNamj8/photo.jpg?sz=50',
        isDefault : false
      },
      isPlusUser : true,
      language   : 'en',
      verified   : false,
      cover      : {
        layout     : 'banner',
        coverPhoto : {
          url    : 'https://lh3.googleusercontent.com/Hl1_RYBHDMy-W1Qrc6NmppJLZwLEkbFZp0ux2H2gPfsN2bih8t9V9r8cfi95dkufeXdYQYEa=s630',
          height : 188,
          width  : 940
        },
        coverInfo : {
          topImageOffset  : -5,
          leftImageOffset : 0
        }
      }
    },
    __v  : 0,
    role : 'super'
  }
];

class UsersApi {

/**
 * Get my info
 */
  static getMyself() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], users[0]));
      }, delay);
    });
  }

/**
 * Get a single user
 */
  static getUser(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], users[1]));
      }, delay);
    });
  }

/**
 * Get list of users
 * restriction: 'admin'
 */
  static getUsers() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Object.assign([], users));
      }, delay);
    });
  }

/**
 * Change a user's role.
 * restriction: 'admin'
 */
  static updateRole(userId, role) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, delay);
    });
  }

/**
 * Change a user's assigned school.
 * restriction: 'admin'
 */
  static updateSchool(userId, school) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, delay);
    });
  }

/**
 * Deletes a user
 * restriction: 'admin'
 */
  static removeUser(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, delay);
    });
  }

}

export default UsersApi;
