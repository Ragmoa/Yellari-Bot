import dotenv from 'dotenv';
import os from 'os';
import cp from 'child_process';
dotenv.config()
import { EmbedBuilder } from '@discordjs/builders';
import { AttachmentBuilder } from 'discord.js';
import { unlink } from 'fs';


const SEEDGEN_FOLDER=process.env.SEEDGEN_FOLDER;

export default function yellariSeedCommand(interaction){

    var OSType= os.type()
    
    switch (OSType){
        case 'Windows_NT':
            var childProcess = cp.spawn('MinishCapRandomizerCLI.exe', ['-i'],{cwd:SEEDGEN_FOLDER});
            break;
        
        case 'Linux' :
            var childProcess = cp.spawn('MinishCapRandomizerCLI', ['-i'],{cwd:SEEDGEN_FOLDER});
            break;
        
        default:
            console.error('Architecture not supported: ',OSType)
            return;
    }
    childProcess.stdout.setEncoding('utf8')
    
    var k = 0;
    var data_line = '';
    let ts = new Date().valueOf();
    var patchName='patch'+ts+'.bps'
    var patchPath=SEEDGEN_FOLDER+'generated\\'+patchName
    
    childProcess.stdout.on("data", function(data) {
      data_line += data;
      if (data_line[data_line.length-2] == ':' || data_line[data_line.length-2] == '?'  || data_line.includes('Press enter to continue...')) {
        // we've got new data (assuming each individual output ends with '\n')
        console.log('Result #', k, ': ', data_line);
        data_line = ''; // reset the line of data

        let command=undefined;
        // Do the commands to generate a seed in order.
        switch (k){
            case 0:
                command="LoadRom"
            break;
            case 1:
                command="tmcEU.gba"
            break;
            case 2:
            case 5:
            case 8:
            case 11:
            case 14:
                command=""
            break;
            case 3:
                command="ChangeSeed"
            break;
            case 4:
                // Add option to manually set the seed later ? Need a better way to handle the cli than this 
                command="R"
            break;
            // TODO: Settings string later
            case 6:
                command="Randomize"
            break;
            case 7:
                command="10"
            break;
            case 9:
                command="SavePatch"
            break;
            case 10:
                // NAMING CONVENTION FOR PATCHES
                command=patchPath
            break;
            case 12:
                command='Exit'
            break;
            case 13: 
                command='Yes'
            break;

        }

        if (k < 14) {
          // Enter command
          console.log('Input #', k, ': ', command);
          childProcess.stdin.write(command+"\n");
          k++;
        } else {
          // that's enough
          console.log('kill process')
          childProcess.stdin.end();

          
          var attachement = new AttachmentBuilder(patchPath)
          attachement.setName(patchName)
          var embed = new EmbedBuilder()
          embed.setTitle('Here\'s your seed');
          embed.setColor(0xffad21);
          interaction.reply({files:[attachement]});
          unlink(patchPath,(err) => {
            if (err){
                console.log(err)
            }
          })
          return;
        }
      }
    });

  

}