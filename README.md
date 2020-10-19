# expo-firebase-auth
Expo app for a simple auth flow to sign in users to firebase with Google and Facebook.

# Running the app
If you want to run the app without connecting your cellphone to the pc, you will have to use ngrok.

1. https://dashboard.ngrok.com/get-started/setup
2. Run both contact-tracing and Auth Server repos and expose each of them with the command: `./ngrok http 5005` replacing 5005 with the port you have your servers.
3. Run `expo start`
4. Download Expo to you mobile and scan the QR
