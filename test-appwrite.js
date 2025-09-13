// Test Appwrite connection
import { Client, Databases } from "appwrite";

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID'); // Replace with your actual project ID

const databases = new Databases(client);

// Test connection
databases.listDocuments('YOUR_DATABASE_ID', 'YOUR_COLLECTION_ID')
    .then(response => {
        console.log('✅ Appwrite connection successful:', response);
    })
    .catch(error => {
        console.error('❌ Appwrite connection failed:', error);
    });

