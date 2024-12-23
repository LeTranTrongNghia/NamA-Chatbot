import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import pdfToText from 'react-pdftotext'

const PdfExtractPage = () => {
    const [extractedText, setExtractedText] = useState("");

    const extractText = async (event) => {
        const file = event.target.files[0]
        pdfToText(file)
            .then(text => {
                // console.log(text);
                setExtractedText(text);
            })
            .catch(error => console.error("Failed to extract text from pdf"))
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="bg-blue-500 px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">
                        Extract PDF text
                    </h3>
                </div>
                <div className="bg-white px-4 py-5 sm:p-6">
                    <Input type="file" accept="application/pdf" onChange={extractText} />
                    {extractedText && (
                        <div className="mt-4">
                            <h4 className="text-lg font-medium">Extracted Text:</h4>
                            <p>{extractedText}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PdfExtractPage;
