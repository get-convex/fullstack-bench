# Supabase

We've sketched out the frontend for a basic chat app in @project and would like to fill out the backend using Supabase.
The app currently only uses in-memory state for its state management.

- The chat app supports authentication
- There are multiple channels, and all users have access to all channels.
- Channels can have messages, and users can post messages into any channel.

Read the guidelines for using Supabase in @guidelines.

Please...

1. Set up the tables for storing channels and messages. Pause and ask me to set up schema in the Supabase dashboard if needed, and I will do it for you.
2. Query and modify these tables from the UI.
3. Make sure that all changes are reflected immediately in the UI without a refresh, even if they've happened in another browser.
