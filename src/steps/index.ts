import { servicesSteps } from './services';
import { deviceSteps } from './devices';

const integrationSteps = [...servicesSteps, ...deviceSteps];

export { integrationSteps };
