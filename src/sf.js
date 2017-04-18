import { config } from './config.js';
import * as jsforce from 'jsforce';
import * as swaggerGen from './swagger_gen.js';
import * as copydir from 'copy-dir';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import './helpers.js';

function sf() {
    let bl, wl;
    if (config.blacklistPath) {
        bl = readList(config.blacklistPath);
    }
    if (config.whitelistPath) {
        wl = readList(config.whitelistPath);
    }
    const controllersDir = './out/api/controllers';
    const swaggerConfigTemplateLoc = './templates/swagger.yaml.tmplt';
    const swaggerConfigOutLoc = './out/api/swagger';
    const pkgJSONOutLoc = './out/package.json';
    const pkgJSONTemplate = './templates/package.json';
    const appJSOutLoc = './out/app.js';
    const appJSTemplate = './templates/app.js';
    const helpersTmpltLoc = './templates/helpers';
    const helpersOutLoc = './out/api/helpers';
    const configTmpltLoc = './templates/config';
    const configOutLoc = './out/config';
    const swaggerHead = `swagger: "2.0"
info:
  version: "0.0.1"
  title: Swagger Salesforce API
# during dev, should point to your local machine
host: localhost:10010
# basePath prefixes all resource paths 
basePath: /
# 
schemes:
  # tip: remove http to make production-grade
  - http
  - https
# format of bodies a client can send (Content-Type)
consumes:
  - application/json
# format of the responses to the client (Accepts)
produces:
  - application/json
paths:`;


    const swaggerTail = `
# complex objects have schema definitions
definitions:
  ErrorResponse:
    required:
      - message
    properties:
      message:
        type: string
`;

    this.genSalesforceSwaggerCode = function () {
        let conn = new jsforce.Connection({
            loginUrl: config.salesForceLoginUrl
        });
        console.log('login with', config.salesForceUser);
        conn.login(config.salesForceUser, config.salesForcePassword + config.salesForceSecurityToken, function (err, loginRes) {
            if (err) { return console.error(err); }
            mkdirp.sync(controllersDir);
            mkdirp.sync(helpersOutLoc);
            mkdirp.sync(swaggerConfigOutLoc)
            mkdirp.sync(configOutLoc)
            let outPath = swaggerConfigOutLoc + '/swagger.yaml';
            fs.appendFileSync(outPath, swaggerHead);
            conn.describeGlobal((err, res) => {
                if (err) { return console.error(err); }
                console.log('Num of SObjects : ' + res.sobjects.length);
                res.sobjects.map((v) => {
                    let label = v.label.formatName();
                    if (label == 'case') {
                        label = '_case'; // prevent usage of resreved case word
                    }
                    if (label) {
                        if (wl && bl) {
                            console.error('error: you have set both a white and a black list. using just white list');
                            bl = null;
                        }
                        if (wl) {
                            if (wl[label]) {
                                swaggerGen.generateSwaggerProject(label);
                            }
                        } else if (bl) {
                            if (bl[label]) {
                                swaggerGen.generateSwaggerProject(label);
                            }
                        } else { // no lists, create all entities
                            swaggerGen.generateSwaggerProject(label);
                        }
                    }
                });
                fs.appendFileSync(outPath, swaggerTail);
            });
            fs.createReadStream(pkgJSONTemplate).pipe(fs.createWriteStream(pkgJSONOutLoc));
            fs.createReadStream(appJSTemplate).pipe(fs.createWriteStream(appJSOutLoc));
            copydir.sync(helpersTmpltLoc, helpersOutLoc);
            copydir.sync(configTmpltLoc, configOutLoc);
        });
    }
};

function readList(listPath) {
    var array = fs.readFileSync(listPath).toString().split('\n');
    if (!array) {
        return;
    }
    var res = {};
    array.map((v) => {
        res[v] = true;
    });
    return res;
}

export default new sf()
