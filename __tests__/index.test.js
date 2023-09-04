import axios from 'axios';
import * as fs from 'fs/promises';
import path from 'path';
import { downloadResource, downloadPage } from '../src/index.js';

jest.mock('axios');
jest.mock('fs/promises');

describe('downloadResource function', () => {
  it('downloads a resource and saves it to the output directory', async () => {
    axios.get.mockResolvedValue({ data: 'Mocked resource content' });
    const resourcePath = await downloadResource(
      'http://example.com/resource.jpg',
      'outputDir',
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join('outputDir', 'resource.jpg'),
      expect.anything(),
    );

    expect(resourcePath).toEqual(path.join('outputDir', 'resource.jpg'));
  });

  it('handles errors by throwing an error', async () => {
    axios.get.mockRejectedValue(new Error('Mocked Axios Error'));
    try {
      await downloadResource('http://example.com/resource.jpg', 'outputDir');
    } catch (error) {
      expect(error.message).toContain('Failed to download resource');
    }

    expect(fs.writeFile).toHaveBeenCalled();
  });
});

describe('downloadPage function', () => {
  it('downloads a resource and saves it to the output directory', async () => {
    axios.get.mockResolvedValue({ data: 'Mocked resource content' });
    const resourcePath = await downloadResource(
      'http://example.com/resource.jpg',
      'outputDir',
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join('outputDir', 'resource.jpg'),
      expect.anything(),
    );

    expect(resourcePath).toEqual(path.join('outputDir', 'resource.jpg'));
  });

  it('handles errors by throwing an error', async () => {
    axios.get.mockRejectedValue(new Error('Mocked Axios Error'));

    try {
      await downloadResource('http://example.com/resource.jpg', 'outputDir');
    } catch (error) {
      expect(error.message).toContain('Failed to download resource');
    }

    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('handles errors by logging an error message and exiting', async () => {
    axios.get.mockRejectedValue(new Error('Mocked Axios Error'));
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { });
    await downloadPage('http://example.com', 'outputDir');

    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });
});
