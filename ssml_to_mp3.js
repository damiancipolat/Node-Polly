const AWS    = require('aws-sdk');
const config = require('config');
const uuidv1 = require('uuid/v1');
const fs     = require('fs');

AWS.config.loadFromPath('./config.json');

// Create an Polly client
const polly = new AWS.Polly({
  signatureVersion: 'v4',
  region:  config.get('region')
});

//Process voice.
const getVoiceStream = async (params)=>{

  try{

    let voiceStream = await polly.synthesizeSpeech(params).promise();

    return (voiceStream.AudioStream instanceof Buffer)?voiceStream:null;

  } catch(err){
    console.log(err);
  }

}

//Download voice to file.
const toFile = (stream,filePath)=>{

  return new Promise((resolve,reject)=>{

    fs.writeFile(filePath,stream, (err)=>{
      
      if (err)
        reject(err);
      else
        resolve(filePath);

    });

  });

}

//Get file.
const getFile = (path)=>{

  return new Promise((resolve,reject)=>{

    fs.readFile(path, 'utf8', (err, contents)=>{

      if (err)
        reject(err);
      else
        resolve(contents);

    });

  }); 

}

//Process the audio and get them into a mp3 file.
const tts = async ()=>{

  try{

    //Get text from file.
    let text = await getFile('./story.txt');

    const params = {
      'Text': text,
      'OutputFormat': 'mp3',
      'TextType': "ssml", 
      'VoiceId': config.get('tts.voice')
    }

    //Get voice stream.
    let voice  = await getVoiceStream(params);

    if (voice){

      //Get file path.
      const filePath = config.get('output.local.path')+'/ssml-'+uuidv1()+'.mp3';

      //Save stream to file.
      let result = await toFile(voice.AudioStream,filePath);      

      console.log('> File created ok!',filePath);

    } else {

      console.log('> Error saving file');

    }

  } catch(err){

    console.log('> Error',err);

  }

}

//Process text.
tts();