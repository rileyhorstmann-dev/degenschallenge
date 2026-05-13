# Spicy & Sweaty Challenge

A simple 5-person shared fitness challenge app.

## People / PINs

- Riley: 1111
- Cilly: 2222
- Margs: 3333
- Dyl: 4444
- J Money: 5555

## Deploy to Vercel

1. Put these files in a GitHub repo or deploy the folder with Vercel CLI.
2. Vercel project root should be this folder.
3. App entry file is `index.html`.

## Firebase

Project: `degens-challenge`

Enable Firestore Database, then publish the rules from `firestore.rules`.

The shared document used by the app is:

- Collection: `challenge_state`
- Document: `spicy_sweaty_2026`

## Notes

The PINs are simple friend-group protection and are not high-security authentication. Anyone with the deployed app source could view them. For a private serious app, use Firebase Authentication.
