# Nodejs Polly AWS

## Install:

The only requirement of this application is the Node Package Manager. All other
dependencies (including the AWS SDK for Node.js) can be installed with:

    npm install
    
## Configuration:

Go to the folder /config/default.json to change the configuration file.

  ```js
{
  "region":"us-east-1",
  "tts":{
    "voice":"Emma"
  },
  "output":{
    "s3":{
      "bucket":"cipolat-bucket" 
    },
    "local":{
      "path":"./mp3"
    }
  }
}
  ```   

