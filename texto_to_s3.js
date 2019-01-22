
const AWS    = require('aws-sdk');
const config = require('config');
const uuidv1 = require('uuid/v1');
const fs     = require('fs');

//AWS.config.loadFromPath('./config.json');

const s3     = new AWS.S3();

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

//Upload stream voice to s3.
const uploadS3 = async (stream,filePath)=>{

  try{

    const s3params = {      
      Bucket: config.get('output.s3.bucket'), 
      Key: filePath,
      Body: stream      
    };

    return await s3.putObject(s3params).promise();

  }catch(err){
    console.log(err);
  }

}

//Process the audio and upload it into a bucket.
const tts2S3 = async (text)=>{

  try{

    const params = {
      'Text': text,
      'OutputFormat': 'mp3',
      'VoiceId': config.get('tts.voice')
    }

    //Get voice stream.
    let voice  = await getVoiceStream(params);

    if (voice){

      //Get file path.
      let filePath = 'mp3/voice-'+uuidv1()+'.mp3';

      //Save stream to file.
      let result   = await uploadS3(voice.AudioStream,filePath);      

      console.log('AWS S3 UPLOAD',result);

      console.log('> File created ok in s3 !',filePath);

    } else {

      console.log('> Error saving file');

    }

  } catch(err){

    console.log('> Error',err);

  }

}

//Process text.
tts2S3('Hola damian como estas?');