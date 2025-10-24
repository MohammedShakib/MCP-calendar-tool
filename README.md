🚀 How to Use (কীভাবে ব্যবহার করবেন)

Follow these steps to set up this tool with your own Google Calendar in Cursor:

    Install Node.js: Make sure you have Node.js (v18 or higher) installed on your computer.

    Download: Download this project as a ZIP file (or use git clone).

    Open Terminal: Open your terminal in the project folder (e.g., mcp-tutorial-main).

    Install Packages: Run the following command to install all necessary packages:
    Bash

npm install

Create .env File: Copy the .env.example file and rename the copy to .env.

Add Your Keys:

    Go to Google Cloud Console to get your GOOGLE_PUBLIC_API_KEY.

    Go to your Google Calendar settings to get your CALENDAR_ID.

    Paste both into your new .env file.

Make Calendar Public: In your Google Calendar settings, go to "Access permissions for events" and check the "Make available to public" box.

Open in Cursor: Open the project folder (e.g., mcp-tutorial-main) in the Cursor editor.

Done! Cursor will automatically detect the .cursor/mcp.json file, start the server in the background, and the "myCalendarData" tool will be ready to use."# MCP-calendar-tool" 
