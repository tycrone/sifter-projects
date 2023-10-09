import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
	apiKey: process.env.FIREBASEAPIKEY,
	authDomain: process.env.FIREBASEAUTHDOMAIN,
	databaseURL: process.env.FIREBASEDATABASEURL,
	projectId: process.env.FIREBASEPROJECTID,
	storageBucket: process.env.FIREBASESTORAGEBUCKET,
	messagingSenderId: process.env.FIREBASEMESSAGINGSENDERID,
	appId: process.env.FIREBASEAPPID
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }

  // ***AUTH API***
  doCreateUserWithEmailAndPassword = (email, password) =>
  	this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
  	this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
  	this.auth.currentUser.updatePassword(password);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });


  // Merge AUTH and DB USER API
   onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }
 
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };
 
            next(authUser);
          });
      } else {
        fallback();
      }
    });


  // ***DATABASE***
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref('users');
  database = () => this.db.ref('data/widgets');
}
 
export default Firebase;
