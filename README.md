# Feature Focus
Manage Customer Feature Requests

[Preview Feature Focus](http://feature-focus.us-west-2.elasticbeanstalk.com/) on AWS.

[Roadmap](https://github.com/CraigDMcKenna/feature-focus/blob/master/ROADMAP.md)

## Installation

**1. Clone this repository**
 
 ```bash
 $ git clone https://github.com/CraigDMcKenna/feature-focus.git
 ```
 
 **2. Install Project Dependencies**
 
 ```bash
 $ nmp install
 ```
 
## Development Setup
 
 **1. Install Nodemon**

 ```bash
 $ npm install nodemon -g
```
 
Feature Focus uses Nodemon to watch server files for changes and 
automatically restart the development server when you change them.
 
 **2. Starting the Development Server**

 ```bash
 $ npm start
 ```
 
This will start an Express server with webpack middleware and 
hot reloading.  When you see the message ```webpack built``` in 
the terminal navigate to **localhost:3000** to view the app
in your browser.
 
Webpack will watch the ```src/``` files and serve changes in 
real time. Typically with you will see any changes happen
automatically withoud the need to refresh your browser.

Some changes to the source files may require manual browser
refresh. 

Most webpack compile time errors will be displayed
directly on the page in your browser.

**Notes Regarding Development:**
*  Feature Focus uses [CSS Modules](http://glenmaddern.com/articles/css-modules).
   Therefore there is no need to namespace your css as CSS Modules takes care
   of this for you.
   
   *------Example?
   
*  [Auto Prefixer](https://autoprefixer.github.io/): Feature Focus
   will automatically insert vendor specific css prefixes for you.
   This option is currently set to include only prefixes for the 2 
   most recent versions of the major browsers.
   
*  If you are not seeing your changes in the browser even
   after refresh and there are no errors on the page check the
   terminal for additional error messages. Nodemon can be
   restarted from the command line by entering the ```rs```.
   command. When all else fails terminate the process
   and restart with ```npm start```.
   
*  The dev server is configured with source maps for easier debugging.
   
**3. Build**

When you are ready for production you need to build/bundle 
the the app first.

```bash
$ npm run build
```
This will build the app to the **public/** directory for production.
When the webpack build process is complete the app is ready to deploy.

## Deploy
Deploy to AWS EC2 using Elastic Beanstalk.

**1. Install the AWS CLI and configure**

**Requires Python and pip.*

```bash
$ pip install awscli

$ aws configure
```

*------Detail?


**2. Install Elastic Beanstalk CLI and Initialize

 ```bash
$ pip install awscli

$ eb init
```

 *------Detail?
 



```bash
$ eb create

$ eb deploy

$ eb open
```
 