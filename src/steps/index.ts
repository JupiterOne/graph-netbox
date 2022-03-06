import { accountSteps } from './account';
import { deviceSteps } from './devices';

const integrationSteps = [...accountSteps, ...deviceSteps];

export { integrationSteps };
