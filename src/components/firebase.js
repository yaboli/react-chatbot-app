import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const config = {
    apiKey: "AIzaSyB15sX",
    authDomain: "react-chatbot-76cfb.firebaseapp.com",
    databaseURL: "https://react-chatbot-76cfb.firebaseio.com",
    projectId: "react-chatbot-76cfb",
    storageBucket: "react-chatbot-76cfb.appspot.com",
    messagingSenderId: "41499880767",
    appId: "1:41499880767:web:ca0e3b6753a40d1e5b778a",
    measurementId: "G-LZKSLYEW32"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore()
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    logout() {
        return this.auth.signOut()
    }

    async register(name, email, password) {
        await this.auth.createUserWithEmailAndPassword(email, password);
        return this.auth.currentUser.updateProfile({
            displayName: name
        })
    }

    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }

    getCurrentUsername() {
        return this.auth.currentUser && this.auth.currentUser.displayName
    }

    getCurrentUserEmail() {
        return this.auth.currentUser && this.auth.currentUser.email
    }
}

export default new Firebase()