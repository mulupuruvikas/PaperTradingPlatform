# Paper Trading Platform

Hello! Thank you so much for using my Paper Trading Platform. Feel free to reach out to me with any suggestions or opportunities, and I will get back to you as soon as I can.

## Purpose
This is an app built for novice investors to be able to practice long-term trading strategies using end of day quotes. 

## How to run:
### If this is your first time running the program:
In one terminal, go to the 'sitebackend' directory and run: <br />
&ensp;  -python manage.py makemigrations <br /> 
&ensp;  -python manage.py migrate <br />
&ensp;  -python manage.py runserver
Open another terminal, go to the 'sitefrontend' directory, and run <br />
&ensp;  -npm install <br />
&ensp;  -npm start <br />

### If you are a returning user:
In one terminal, go to the 'sitebackend' directory and run: <br />
&ensp;  -python manage.py runserver <br /> <br />
Open another terminal, go to the 'sitefrontend' directory, and run <br />
&ensp;  -npm start <br />

## Dev Info
### Frameworks
Backend built using Django (Python) <br />
Frontend built using React.js (JavaScript) <br />
Databased managed using Django ORM/MySQL <br />

## APIs
Finnhub.io API used for retrieving end of day stock quotes (limit 120 API calls/min) <br />
REST API created using Django REST Framework to perform CRUD operations from backend to frontend <br />

