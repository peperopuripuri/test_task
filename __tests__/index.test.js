import axios from 'axios';
import * as fs from 'fs/promises';
import path from 'path';
import { downloadResource, downloadPage } from '../src/index.js';

jest.mock('axios');
jest.mock('fs/promises');

describe('downloadResource function', () => {
  it('downloads a resource and saves it to the output directory', async () => {
    // Mock axios response for the resource
    axios.get.mockResolvedValue({ data: 'Mocked resource content' });

    const resourcePath = await downloadResource(
      'http://example.com/resource.jpg',
      'outputDir',
    );

    // Verify that fs.writeFile was called with the correct arguments
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join('outputDir', 'resource.jpg'),
      expect.anything(),
    );

    // Verify that the function returns the correct resource path
    expect(resourcePath).toEqual(path.join('outputDir', 'resource.jpg'));
  });

  it('handles errors by throwing an error', async () => {
    // Mock axios to simulate a failed request
    axios.get.mockRejectedValue(new Error('Mocked Axios Error'));

    try {
      await downloadResource('http://example.com/resource.jpg', 'outputDir');
    } catch (error) {
      expect(error.message).toContain('Failed to download resource');
    }

    // Verify that fs.writeFile was still called
    expect(fs.writeFile).toHaveBeenCalled();
  });
});

describe('downloadPage function', () => {
  it('downloads a resource and saves it to the output directory', async () => {
    // Mock axios response for the resource
    axios.get.mockResolvedValue({ data: 'Mocked resource content' });

    const resourcePath = await downloadResource(
      'http://example.com/resource.jpg',
      'outputDir',
    );

    // Verify that fs.writeFile was called with the correct arguments
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join('outputDir', 'resource.jpg'),
      expect.anything(),
    );

    // Verify that the function returns the correct resource path
    expect(resourcePath).toEqual(path.join('outputDir', 'resource.jpg'));
  });

  it('handles errors by throwing an error', async () => {
    // Mock axios to simulate a failed request
    axios.get.mockRejectedValue(new Error('Mocked Axios Error'));

    try {
      await downloadResource('http://example.com/resource.jpg', 'outputDir');
    } catch (error) {
      // Corrected error message expectation
      expect(error.message).toContain('Failed to download resource');
    }

    // Verify that fs.writeFile was still called
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('handles errors by logging an error message and exiting', async () => {
    // Mock axios to simulate a failed request
    axios.get.mockRejectedValue(new Error('Mocked Axios Error'));

    // Mock process.exit to capture the exit code
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await downloadPage('http://example.com', 'outputDir');

    // Verify that process.exit was called with code 1
    expect(mockExit).toHaveBeenCalledWith(1);

    // Restore the original process.exit function
    mockExit.mockRestore();
  });
});
