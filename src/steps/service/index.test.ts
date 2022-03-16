import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupRecording, Recording } from '@jupiterone/integration-sdk-testing';
import { Steps } from '../constants';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetch-service', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetch-service',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.SERVICE);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
