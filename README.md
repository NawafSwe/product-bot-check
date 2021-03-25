# healthCheck-bot for checking products health.

<p>This is a simple project for Telegram bot using Nodejs and typescript </p>
<p>this project runs locally on <b>localhost</b> and it is <b>dockerized</b> 🐳 </p>
<hr/>
<h1>Instructions:</h1>
<ul>
<li>First Make Sure You have nodejs installed in your machine before proceed with the instructions <a href="https://nodejs.org/en/">NodeJS</a> </li>
<li>after installing nodejs open your favourite code editor and open the terminal menu and run the following commands:
<ol>
<li>   `npm run setup` it will install all the dependencies and required packages </li>
<li> create `.env` file to fill it with the credentials such as PORT,HOST,TOKEN. the token you need to acquire from <a href="https://core.telegram.org/bots/api">telegram.org</a> </li>
<li> after that run `npm run start` and it will start running express server at your local host</li>
</ol>
</li>
<li> you can view project files by typing localhost:`PORT Number you are use` and it will move you to a web page holds all files of project documented</li>
</ul>
<h1>Bot Commands</h1>
<p>the bot have simple commands</p>
<ol>
<li>`/start` which will give you a welcome message and another sub command called `/commands`</li>
<li>the command `/commands` will provide you four different options are:
<ul>
<li> `/help` which will give you nested inline commands
    <ol> 
        <li>`want to do new check?` which will start asking user about health and quality of product.</li>
        <li>`view session` it will send to the user the last session he saved on the chat that contains the experience information.</li>
        <li>`clear session` it will clear the session for the user.</li>
    </ol>
</li>
<li>`/data` to view saved data in the session</li>
<li>`/clearData` to clear the data from the session</li>
<li>`/quit` to quit from the chat </li>

</ul>
</li>

</ol>

