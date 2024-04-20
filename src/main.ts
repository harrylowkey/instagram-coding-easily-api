import { Bootstrap } from '~core/bootstraps/bootstrap';

async function startApp(): Promise<void> {
    const bootstrap = new Bootstrap();
    await bootstrap.initApp();
    bootstrap.buildSwagger();
    await bootstrap.start();
    // await bootstrap.setupDiscord();
}

startApp()
    .then(() => console.log('Init app success'))
    .catch(console.error);
