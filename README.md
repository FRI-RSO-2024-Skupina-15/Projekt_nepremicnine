# Real estate project

## Instructions

- Node version of `22` is recommended.
- For local operations, run `npm install` in all folders for each microservice inside `/services` folder.
- To run a specific microservice run `node src/index.js` in a microservice folder.

## Workflow

When pushed or merged into the main branch the github action automatically creates a docker image and uploads it to Azure aks.
The IP address of the api aaccess point for properties service is: `72.146.51.189/api-docs`, (swagger documentation) and the docker image is located at `kristofzupan/projekt-nepremicnine`
- It is possible to run the specific mircoservice by running the image with `docker pull kristofzupan/projekt-nepremicnine` and afterwards running it with `docker run -p 3000:3000 --env MONGO_URI=<MONGO_URI> kristofzupan/projekt-nepremicnine`



