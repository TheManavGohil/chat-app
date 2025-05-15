import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n===== Cloudinary Configuration Helper =====\n');
console.log('This script will help you add Cloudinary configuration to your .env file.');
console.log('You need to have a Cloudinary account and get your credentials from the Cloudinary dashboard.\n');

// Function to ask for input
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    // Get Cloudinary credentials
    const cloudName = await question('Enter your Cloudinary Cloud Name: ');
    const apiKey = await question('Enter your Cloudinary API Key: ');
    const apiSecret = await question('Enter your Cloudinary API Secret: ');
    
    // Check if .env file exists
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Add Cloudinary config if not already there
    if (!envContent.includes('CLOUDINARY_CLOUD_NAME')) {
      envContent += `\n# Cloudinary Configuration\nCLOUDINARY_CLOUD_NAME=${cloudName}\nCLOUDINARY_API_KEY=${apiKey}\nCLOUDINARY_API_SECRET=${apiSecret}\n`;
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ Cloudinary configuration added to .env file successfully!');
    } else {
      // Update existing Cloudinary config
      const lines = envContent.split('\n');
      const updatedLines = lines.map(line => {
        if (line.startsWith('CLOUDINARY_CLOUD_NAME=')) {
          return `CLOUDINARY_CLOUD_NAME=${cloudName}`;
        }
        if (line.startsWith('CLOUDINARY_API_KEY=')) {
          return `CLOUDINARY_API_KEY=${apiKey}`;
        }
        if (line.startsWith('CLOUDINARY_API_SECRET=')) {
          return `CLOUDINARY_API_SECRET=${apiSecret}`;
        }
        return line;
      });
      
      fs.writeFileSync(envPath, updatedLines.join('\n'));
      console.log('\n✅ Existing Cloudinary configuration updated in .env file!');
    }
    
    console.log('\nYou can now restart your server for the changes to take effect.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

main(); 