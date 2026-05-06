import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/app.css'
import {
    BrowserRouter,
} from 'react-router-dom'
import {
    AuthProvider,
} from './modules/auth/context/AuthContext'
import {
    GoogleOAuthProvider,
} from '@react-oauth/google'


ReactDOM.createRoot(
    document.getElementById('root')
).render(

    <React.StrictMode>
        
        <GoogleOAuthProvider
            clientId="292437594375-ccncjurgnbftk698h13nhu73jdii01p8.apps.googleusercontent.com"
        >

            <BrowserRouter>

                <AuthProvider>

                    <App />
                    

                </AuthProvider>

            </BrowserRouter>

        </GoogleOAuthProvider>

    </React.StrictMode>
    
)