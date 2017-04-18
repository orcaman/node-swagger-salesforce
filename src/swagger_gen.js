import * as fs from 'fs';
import './helpers.js';

module.exports = (function () {
    const controllerTemplateLoc = './templates/entity.js.tmplt';
    const controllerOutLoc = './out/api/controllers';
    const swaggerConfigTemplateLoc = './templates/swagger.yaml.tmplt';
    const swaggerConfigOutLoc = './out/api/swagger';
    let entities = {};

    function merge(entity, templateLoc, outLoc, isController) {
        let data = fs.readFileSync(templateLoc);
        let content = data.toString();
        content = content.replaceAll('{{entity}}', entity);
        content = content.replaceAll('{{Entity}}', entity.capitalizeFirstLetter());
        let dir = outLoc;
        let outPath = dir + '/' + entity + '.js'
        if (isController) {
            fs.writeFile(outPath, content, (err) => {
                if (err) {
                    console.error('error', err);
                }
            });
        } else {
            if (entities[entity]) { // prevent dups, for example, because note entity is returned several times from SF API
                return;
            }
            entities[entity] = true;
            outPath = dir + '/swagger.yaml';
            fs.appendFileSync(outPath, content);
        }
    }
    return {
        generateSwaggerProject: function (entity) {
            this.generateSwaggerConfig(entity);
            this.generateControllers(entity);
        },
        generateControllers: function (entity) {
            merge(entity, controllerTemplateLoc, controllerOutLoc, true);
        },
        generateSwaggerConfig: function (entity, out) {
            merge(entity, swaggerConfigTemplateLoc, swaggerConfigOutLoc);
        }
    }
})();