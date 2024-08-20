Please Install "node-v20.16.0-x64.msi", If you dont have it already, you can download it from https://nodejs.org/en
It is to run JavaScript directly from the code.
Completely open source.

Remember There are examples in the EXAMPLES folder.

**HOW THE BOT WORKS**

The bot will listen to the files in the desired directory you choose and auto upload them to the channel you choose.

The bot will only upload the photo if it was created within the same minute of when it detects a change.

There is a command to repload old photos "vrcrp".

**BOT SET UP**

You will need to create your own bot at "https://discord.com/developers/applications"

The bot will need the following permissions: Attach Files, Send Messages.

This is where issues may arise so please make sure the bot is configured correctly.

You will need the App ID, Public Key, and the Token from that bot and put it in the ".env" file.

Next in that same .env you will need to put the channel ID of whatever discord channel you want the bot to send the photos and function in.

**BAT SET UP**

Now you have all the required variables, you need to set up a .bat file to run the javascript.

in VrcTest.bat I have it mostly set up, you just need to give it the directory to the javascript. (please see BAT_FILE_EXAMPLE.png in EXAMPLES)

Once you have completed all these steps, you can now run VrcTest.bat

The bot is online! 

**OPTINAL START UP PROCEDURES**

For me personally i have it always running, whenever my PC turns on it turns on automatically.
But if you want it to only be open when you Open VRchat you can do that as well.

you would need to put a line of code in the launch options:

The first directory should be to your bat, then the second should be to the Vrchat start up (its the one with easy anticheat)
It is as you see it, with quotes.
REMINDER: The Script will not close automatically after closing vrchat. the window ill just look like a cmd.exe it will also have logs about photos and the bot.

EXAMPLE:
"C:\Users\shark\Documents\GitHub\discord-example-app\VrcTest.bat" %command% & "C:\Program Files (x86)\Steam\steamapps\common\VRChat\start_protected_game.exe" %command% 

**EXTRA INFO**

There is one command to the bot, all you have to say is "vrcrp" (no quotes). It stands for Vrchat Resend Photos.
This will repost all the images in the desired file you choose, incase u need this. 

This is like the first time im coding in JavaScript (it was just a fun little project).

**COMMANDS**

There is currently 1 command. "vrcrp" (without the quotes). This stands for Vrchat Resend Photos.

In the channel you designated the bot to function in, type "vrcrp" and it will come up with instructions.

This will slowly repost the photos of your choosing into the channel. 


**LINKS**

Links i used to help make this:


https://nodejs.org/api/fs.html

(Lots of public forums..)

If you have any suggestions or any tips on the code please feel free to reach out!






