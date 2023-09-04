import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { downloadResource, downloadPage } from '../src/index.js';

jest.mock('axios');

describe('downloadResource', () => {
    it('should download and save a resource', async () => {
        const mockResourceUrl = 'https://example.com/resource.jpg'; // Use a publicly accessible URL
        const mockOutputDir = '../downloads'; // Use the relative path to downloads folder
        const mockResourceContent = Buffer.from('Mock resource content');

        axios.get.mockResolvedValueOnce({ data: mockResourceContent });

        // Mock fs.promises.writeFile
        const writeFileSpy = jest.spyOn(fs, 'writeFile').mockResolvedValueOnce();

        const result = await downloadResource(mockResourceUrl, mockOutputDir);

        expect(result).toEqual(path.join(mockOutputDir, 'resource.jpg'));

        // Verify that fs.promises.writeFile was called with the correct arguments
        expect(writeFileSpy).toHaveBeenCalledWith(
            path.join(mockOutputDir, 'resource.jpg'),
            mockResourceContent
        );

        // Restore the original fs.promises.writeFile function
        writeFileSpy.mockRestore();
    });

    it('should handle errors', async () => {
        const mockResourceUrl = 'https://example.com/resource.jpg'; // Use a publicly accessible URL
        const mockOutputDir = '../downloads'; // Use the relative path to downloads folder

        // Mock axios.get to throw an error
        axios.get.mockRejectedValueOnce(new Error('Failed to download resource'));

        // Expect the function to throw an error
        await expect(downloadResource(mockResourceUrl, mockOutputDir)).rejects.toThrowError(
            'Failed to download resource'
        );
    });
});

describe('downloadPage', () => {
    it('should download a page and its resources', async () => {
        // Mock the necessary dependencies and functions for downloadPage
        const mockUrl = 'https://example.com/page.html'; // Use a publicly accessible URL
        const mockOutputDir = '../downloads'; // Use the relative path to downloads folder
        const mockHtmlContent = '<html><body>Mock HTML</body></html>';

        axios.get.mockResolvedValueOnce({ data: mockHtmlContent });

        const mock$ = {
            each: jest.fn(),
        };

        // Mock the 'cheerio' module
        jest.mock('cheerio', () => ({
            load: jest.fn(() => mock$), // Mock the load method to return mock$
        }));

        // Mock the resourceUrls
        mock$.each.mockImplementation((callback) => {
            const mockElement = { attr: jest.fn() };
            mockElement.attr.mockReturnValueOnce('resource.jpg'); // Mock resource URL
            callback(0, mockElement);
        });

        // Mock fs.promises.writeFile
        const writeFileSpy = jest.spyOn(fs, 'writeFile').mockResolvedValueOnce();

        // Mock downloadResource function

        const result = await downloadPage(mockUrl, mockOutputDir);

        expect(result).toBeUndefined();

        // Verify that fs.promises.writeFile and downloadResource were called with the correct arguments
        expect(writeFileSpy).toHaveBeenCalledWith(
            path.join(mockOutputDir, 'index.html'),
            mockHtmlContent
        );

        expect(downloadResourceMock).toHaveBeenCalledWith(
            'https://example.com/resource.jpg',
            mockOutputDir
        );

        // Restore the original fs.promises.writeFile function and downloadResource function
        writeFileSpy.mockRestore();
        jest.resetModules(); // Reset the 'cheerio' module
    });

    it('should handle errors', async () => {
        const mockUrl = 'https://example.com/page.html'; // Use a publicly accessible URL
        const mockOutputDir = '../downloads'; // Use the relative path to downloads folder

        // Mock axios.get to throw an error
        axios.get.mockRejectedValueOnce(new Error('Failed to download page'));

        // Mock console.error
        console.error = jest.fn();

        // Mock process.exit
        process.exit = jest.fn();

        await downloadPage(mockUrl, mockOutputDir);

        expect(console.error).toHaveBeenCalledWith('Failed to download page');
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
