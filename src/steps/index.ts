import { serviceSteps } from './service';
import { deviceSteps } from './devices';

const integrationSteps = [...serviceSteps, ...deviceSteps];

export { integrationSteps };
