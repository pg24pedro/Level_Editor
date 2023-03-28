'use strict';

import Express, { response } from 'express'
import HTTP, { request } from 'http'

import FileSystem from 'fs-extra'
import Path from 'path'

import fs from 'fs'
import http from 'http'

const __dirname = Path.resolve();

const PORT = 4000;

class Server {

    constructor( api, port = PORT ) {

        console.log("Creating server");

        this.api = Express();
        this.port = port;
        this.title = "Sample client Server App"

        this.api
            .use( Express.json() )
            .use( Express.urlencoded({ extended: false }))
            .use('/', Express.static(`${Path.join(__dirname,'/')}`));

        this.api.get('/', ( request, response ) => {

            console.log('Request for static files');
            let file = `${Path.join(__dirname,'/')}index.html`;
            response.sendFile( file );
        });

        this.api.post('/api/save_level', (request,response) => {

            const myLevelData = JSON.stringify(request.body);
            
            var ctr = this.countForFiles();

            const levelName = 'Level_';

            FileSystem.writeFile(`${Path.join(__dirname,'./Levels/')}` + levelName  + '.json',myLevelData,(denied) =>{
                if(denied)
                {
                    console.error(denied);
                    response.status(500).send("Unable to save file");
                }

                else
                {
                    response.send("Success");
                }
            });

            
        });


        this.api.post('/api/get_level_list/:id', ( request, response ) => {
            // handle post requests sent to this server for this edge
            let params = {...request.   query, ...request.params, ...request.body };
            let respData = {
                payload: [
                    {
                        name: "level_1",
                        filename: "level_1.json"
                    },
                    {
                        name: "level_2",
                        filename: "level_2.json"
                    }
                ],
                error: 0
            };

            // TODO: use FileSystem.readdir() to list the file names

            let result = JSON.stringify( respData );
            response.send( result )
        })
    }

    //TODO: Check functionality of this. It counts the files but dont return the value

    run() {

        console.log("Server running");

        this.api.set('port', this.port );
        this.listener = HTTP.createServer( this.api );
        this.listener.listen( this.port );

        this.listener.on('listening', event => this.handleListenerListening( event ));
    }

    handleListenerListening( event ) {

        let address = this.listener.address();
        let bind = "";
        if (typeof address === `string`) {
            bind = `pipe ${address}`
        }
        else {
            bind = `port ${address.port}`
        }
        console.log(`Listening on ${bind}`)
    }

    countForFiles()
    {
        const folderPath = './Levels';
        const fileName = 'myLevel.json';
        var myCtr = 0;

        fs.readdir(folderPath,(err,files) =>{
        
            if(err) throw err;
            files.forEach(file => {

                 myCtr += 1;
            });

        console.log(myCtr);
     
        });

        return myCtr;
    }
}

const server = new Server();
server.run();

