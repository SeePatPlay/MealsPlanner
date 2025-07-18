const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const inputHtmlFile = 'PlannerApp.html';
const outputDir = 'public'; // This will be your deployment directory
const outputHtmlFile = path.join(outputDir, 'index.html'); // Output as index.html for Firebase Hosting

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

try {
    let htmlContent = fs.readFileSync(inputHtmlFile, 'utf8');

    // Construct the firebaseConfig object from environment variables
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };

    // Convert the config object to a string that can be injected into JavaScript
    const configString = `const firebaseConfig = ${JSON.stringify(firebaseConfig)};`;

    // Replace the placeholder in the HTML content
    const placeholder = '// FIREBASE_CONFIG_PLACEHOLDER';
    if (htmlContent.includes(placeholder)) {
        htmlContent = htmlContent.replace(placeholder, configString);
        fs.writeFileSync(outputHtmlFile, htmlContent, 'utf8');
        console.log(`Successfully built ${outputHtmlFile}`);
    } else {
        console.error(`Error: Placeholder "${placeholder}" not found in ${inputHtmlFile}.`);
        process.exit(1); // Exit with error code
    }

} catch (error) {
    console.error(`Error building HTML file: ${error.message}`);
    process.exit(1); // Exit with error code
}
