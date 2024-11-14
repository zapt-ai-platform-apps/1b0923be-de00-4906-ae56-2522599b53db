# Name My Child

"Name My Child" is an app designed to help you find the perfect name for your child and store your favorite ones in one place.

## User Journeys

### 1. Sign In with ZAPT

1. When you open the app, you see a sign-in page with the title "Sign in with ZAPT".
2. Below the title, there's a link to "Learn more about ZAPT" which opens in a new tab.
3. You can sign in using your email via a magic link or with social providers like Google, Facebook, or Apple.
4. Once signed in, you are taken to the main page of the app.

### 2. Generate Name Suggestions

1. On the main page, you see a button labeled "Generate Names".
2. Clicking this button initiates the generation of 10 unique and beautiful child names.
3. While the names are being generated, the button shows a loading state with the text "Generating Names...".
4. Once the names are generated, they are displayed in a list under the "Suggested Names" section.

### 3. View Suggested Names

1. The "Suggested Names" section displays the list of names generated.
2. Each name is accompanied by a "Save" button.
3. You can scroll through the list to view all the suggested names.

### 4. Save Preferred Names

1. For any name you like, click the "Save" button next to it.
2. The name is saved to your personal list in the "My Saved Names" section.
3. A loading state prevents multiple clicks on the "Save" button until the action is complete.

### 5. View Saved Names

1. The "My Saved Names" section displays all the names you have saved.
2. You can view all your favorite names in one place.
3. This list remains intact even if you generate new name suggestions.

### 6. Sign Out

1. You can sign out of the app by clicking the "Sign Out" button located at the top right corner.
2. After signing out, you are returned to the sign-in page.

## Additional Features

- **Responsive Design**: The app is designed to be user-friendly and looks great on all screen sizes.
- **Loading States**: All actions have appropriate loading states to provide feedback.
- **Authentication**: Secure authentication using Supabase and social login providers.

## External Services

- **ChatGPT**: Used to generate name suggestions.
- **Supabase**: Provides authentication for users.
- **ZAPT**: Integration for backend event handling and authentication.