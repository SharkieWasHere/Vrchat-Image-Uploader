require('dotenv').config();
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PDIR = process.env.VRCHAT_PHOTO_DIR;

client.once('ready', () => {
  console.log('Bot is online!');
  monitorDirectory(PDIR);
});

let lastSentFile = null;
let debounceTimer = null;
const messageQueue = [];
let isProcessing = false;

function getNewestImageFile(dir) {
  let newestFile = null;
  let newestTime = 0;

  function traverseDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    items.forEach(item => {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        traverseDirectory(itemPath);
      } else if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
          if (stats.mtime.getTime() > newestTime) {
            newestTime = stats.mtime.getTime();
            newestFile = itemPath;
          }
        }
      }
    });
  }

  traverseDirectory(dir);
  return newestFile;
}

function monitorDirectory(dir) {
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (eventType === 'rename' || eventType === 'change') {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        const newestImageFile = getNewestImageFile(dir);
        const timeCreated = new Date(fs.statSync(newestImageFile).birthtime);
        const timeNow = new Date();
        function FormatDate(date) {
          return (date.getMonth() + 1).toString().padStart(2, '0') + ", " +
                 date.getDate().toString().padStart(2, '0') + ", " +
                 date.getHours().toString().padStart(2, '0') + ":" +
                 date.getMinutes().toString().padStart(2, '0');
        }

        if (newestImageFile && newestImageFile !== lastSentFile && FormatDate(timeCreated) == FormatDate(timeNow)) {
          if (!messageQueue.includes(newestImageFile)) {
            console.log(`Queueing image: ${newestImageFile}`);
            messageQueue.push(newestImageFile);
            processQueue();
          }
        }
      }, 999); // 1-second delay
    }
  });
}

async function processQueue() {
  if (isProcessing || messageQueue.length === 0) return;

  isProcessing = true;

  while (messageQueue.length > 0) {
    const imageFile = messageQueue.shift();

    if (imageFile) {
      try {
        console.log(`Sending image: ${imageFile}`);
        const attachment = new AttachmentBuilder(imageFile);
        const channel = await client.channels.fetch(process.env.CHANNEL_ID); // MY CHANNDLKELL ID
        await channel.send({ files: [attachment] });

        lastSentFile = imageFile;
      } catch (err) {
        console.error('Error sending image:', err);
      }
    }

    // wait
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  console.log('Done Sending');
  isProcessing = false;
}

client.on('messageCreate', async message => {
  if (message.content.toLowerCase() === 'vrcrp' && message.channel.id == process.env.CHANNEL_ID) {
    // get folders
    const rootDir = PDIR;
    const folders = fs.readdirSync(rootDir).filter(file => fs.statSync(path.join(rootDir, file)).isDirectory());

    if (folders.length === 0) {
      return message.channel.send('No folders found.');
    }

    // prompt for folda
    let folderMessage = 'Please select a folder:\n';
    folders.forEach((folder, index) => {
      folderMessage += `${index + 1}. ${folder}\n`;
    });

    message.channel.send(folderMessage);

    // respon
    const filter = response => {
      const choice = parseInt(response.content);
      return !isNaN(choice) && choice > 0 && choice <= folders.length;
    };

    try {
      const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
      const folderChoice = parseInt(collected.first().content);
      const selectedFolder = folders[folderChoice - 1];
      

      message.channel.send(`You selected: ${selectedFolder}. Sending images...`);

      let queue = 1;

      // snd all images in the selected fold
      const selectedFolderPath = path.join(rootDir, selectedFolder);
      const images = fs.readdirSync(selectedFolderPath).filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()));
      const imageint = images.length;
      

      for (const image of images) {
        try {
          
          const imagePath = path.join(selectedFolderPath, image);
          const attachment = new AttachmentBuilder(imagePath);
          const channel = await client.channels.fetch(process.env.CHANNEL_ID); // DONT FOREGET PUT DISCORD CHANNEL ID HEREEEE
          const queuemsg = `${queue}/${imageint}`;
          await channel.send({ content: queuemsg, files: [attachment] });
          queue += 1;

          // wait
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (err) {
          console.error('Error sending image:', err);
        }
      }

      message.channel.send('All images sent.');
    } catch (err) {
      message.channel.send('No valid selection was made.');
    }
  }
});

client.on('error', (error) => {
  console.error('Discord client encountered an error:', error);
});



client.login(process.env.DISCORD_TOKEN);
