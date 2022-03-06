import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupRecording, Recording } from '@jupiterone/integration-sdk-testing';
import { Steps } from '../constants';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetch-account', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetch-account',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.ACCOUNT);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
