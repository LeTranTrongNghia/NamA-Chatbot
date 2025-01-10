import React, { useState, useEffect } from 'react';

import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";

// Helper function to convert string to XML
const str2xml = (str) => {
    if (str.charCodeAt(0) === 65279) {
        str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
};

// Convert array buffer to binary string
const arrayBufferToBinaryString = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
};

// Extract paragraphs from DOCX content
const getParagraphs = (content) => {
    try {
        // Create new PizZip instance with binary string
        const zip = new PizZip(content);
        
        // Debug: Check available files in the zip
        console.log('Available files in zip:', Object.keys(zip.files));
        
        // Get the document.xml content
        const documentXml = zip.files["word/document.xml"];
        if (!documentXml) {
            throw new Error("Could not find word/document.xml in the DOCX file");
        }
        
        const xml = str2xml(documentXml.asText());
        const paragraphsXml = xml.getElementsByTagName("w:p");
        const paragraphs = [];

        for (let i = 0, len = paragraphsXml.length; i < len; i++) {
            let fullText = "";
            const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
            for (let j = 0, len2 = textsXml.length; j < len2; j++) {
                const textXml = textsXml[j];
                if (textXml.childNodes && textXml.childNodes[0]) {
                    fullText += textXml.childNodes[0].nodeValue;
                }
            }
            if (fullText) {
                paragraphs.push(fullText);
            }
        }
        return paragraphs;
    } catch (error) {
        console.error('Detailed error in parsing document:', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

// Read DOCX file using fetch API with proper headers
const readDocxFile = async (url) => {
    try {
        console.log('Attempting to fetch document from:', url);
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the array buffer and convert it to binary string
        const arrayBuffer = await response.arrayBuffer();
        const binaryString = arrayBufferToBinaryString(arrayBuffer);
        
        // Debug: Log file size
        console.log('File size (bytes):', arrayBuffer.byteLength);

        return getParagraphs(binaryString);
    } catch (error) {
        console.error('Error reading DOCX file:', {
            error: error.message,
            stack: error.stack,
            url: url
        });
        return [];
    }
};

// React component for reading DOCX files
const DocxReader = ({ docxUrl, onContentLoaded }) => {
    React.useEffect(() => {
        const loadContent = async () => {
            try {
                // Ensure the URL is properly formatted
                const formattedUrl = docxUrl.startsWith('/') 
                    ? `${window.location.origin}${docxUrl}`
                    : docxUrl;
                
                console.log('Loading document from:', formattedUrl);
                const paragraphs = await readDocxFile(formattedUrl);
                onContentLoaded(paragraphs);
            } catch (error) {
                console.error('Error in DocxReader component:', error);
                onContentLoaded([]);
            }
        };

        loadContent();
    }, [docxUrl, onContentLoaded]);

    return null;
};

export { readDocxFile, DocxReader };