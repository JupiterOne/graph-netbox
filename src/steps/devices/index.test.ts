import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupRecording, Recording } from '@jupiterone/integration-sdk-testing';
import { Steps } from '../constants';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetch-devices', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetch-devices',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.DEVICES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-account-device-relationships', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'build-account-device-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.RELATIONSHIPS_ACCOUNT_DEVICE,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
