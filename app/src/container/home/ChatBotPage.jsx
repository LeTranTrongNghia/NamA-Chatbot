import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import pdfToText from 'react-pdftotext';
import { getDocument } from 'pdfjs-dist/build/pdf';

const ChatBotPage = () => {
    const [message, setMessage] = useState('');
    const [finalMessage, setFinalMessage] = useState('');
    const [audioMessage, setAudioMessage] = useState('');
    const [fileType, setFileType] = useState(null); 
    const audioRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [messageHistory, setMessageHistory] = useState([]); 
    const [audioSrc, setAudioSrc] = useState(''); 
    const [uploadedFile, setUploadedFile] = useState(null);
    const [pdfText, setPdfText] = useState(''); 
    const [basePdfText, setBasePdfText] = useState('');

    // API credentials and constants
    const API_KEY_ID = "MmJdC2c14tNQn7qz"; 
    const API_KEY_SECRET = "9K4Aa3gbpfDNy6Xz";
    const LANG = "vi"; 
    const RESULT_TYPE = 4; 

    const handleAudioUpload = async (event) => { 
        const file = event.target.files[0];
        if (file) {
            setFileType('audio'); 
            setMessage("wait to process audio"); 
            await transcribeAudio(file); 
        }
    };

    const handleImageUpload = async (event) => { 
        const file = event.target.files[0];
        if (file) {
            setFileType('image');
            setSelectedImage(file); 
            setMessage("wait to process image"); 
            await extractTextFromImage(file); 
        }
    };

    const transcribeAudio = async (file) => { 
        const formData = new FormData();
        formData.append('file', file);

        try {
            const createResponse = await axios.post('https://api.speechflow.io/asr/file/v1/create?lang=' + LANG, formData, {
                headers: {
                    'keyId': API_KEY_ID,
                    'keySecret': API_KEY_SECRET,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const taskId = createResponse.data.taskId;

            const intervalID = setInterval(async () => {
                const queryResponse = await axios.get(`https://api.speechflow.io/asr/file/v1/query?taskId=${taskId}&resultType=${RESULT_TYPE}`, {
                    headers: {
                        'keyId': API_KEY_ID,
                        'keySecret': API_KEY_SECRET,
                    },
                });

                console.log('Transcription Query Response:', queryResponse.data);

                if (queryResponse.data.code === 11000) {
                    const result = queryResponse.data.result || ''; 
                    setAudioMessage(result);
                    setMessage(result);
                    setLoading(false);
                    clearInterval(intervalID);
                } else if (queryResponse.data.code === 11001) {
                    console.log('Waiting for transcription...');
                } else {
                    console.error("Transcription error:", queryResponse.data.msg);
                    setLoading(false);
                    clearInterval(intervalID);
                }
            }, 3000);
        } catch (error) {
            console.error("Error during transcription:", error);
            setLoading(false); 
        }
    };

    const extractTextFromImage = async (file) => { 
        if (!file) return;

        setLoading(true);
        try {
            const { data: { text } } = await Tesseract.recognize(file, 'vie', {
                logger: (info) => console.log(info), 
            });
            setLoading(false);
            setMessage(text);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const extractText = async (event) => { 
        const file = event.target.files[0];
        pdfToText(file)
            .then(text => {
                setPdfText(text); 
            })
            .catch(error => console.error("Failed to extract text from pdf"));
    };

    const generateAnswer = async (e) => { 
        e.preventDefault();
        setLoading(true); 
        const question = message; 

        // Predefined PDF text to use as fallback
        const fallbackPdfText = basePdfText || "This is the fallback PDF data that will be used if no PDF is uploaded.";

        let promptPrefix =
            'As a professional customer service representative, provide a clear and helpful response to the user based on the following PDF text and their question. Answer like a normal text or paragraph, no special symbol. If customer send something not related to PDF or banking services, politely ask customer to send other request to help them with banking service issues. Always answer customer with Vietnamese and answer as politely as possible.';

        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                method: 'post',
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${promptPrefix} Analyze the following PDF text:\n\n${pdfText || fallbackPdfText}\nUser Question: ${question}`,
                                },
                            ],
                        },
                    ],
                },
            });

            const answerText = response.data.candidates[0].content.parts[0].text;

            const plainTextAnswer = answerText.replace(/<[^>]+>/g, '').replace(/\*\*(.*?)\*\*/g, '$1');

            setMessageHistory(prev => [
                ...prev,
                { type: 'answer', text: plainTextAnswer, background: 'bg-blue-300' },
            ]);
        } catch (error) {
            console.log(error);
            setMessageHistory(prev => [
                ...prev,
                {
                    type: 'answer',
                    text: 'Sorry - Something went wrong. Please try again!',
                    background: 'bg-red-300',
                },
            ]);
        }

        setLoading(false);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        let newMessage = ''; 

        if (fileType === 'audio') {
            newMessage = `${audioMessage} ${message}`;
        } else if (fileType === 'image') {
            const result = await extractTextFromImage(selectedImage);
            newMessage = `${result} ${message}`.replace('undefined', '');
        } else {
            newMessage = `${message}`;
        }

        setMessageHistory(prev => [...prev, { type: 'user', text: newMessage, background: 'bg-gray-100' }]);

        setMessage(''); 
 
        setUploadedFile(null); 
        setSelectedImage(null); 
        setFileType(null); 

        await generateAnswer(e); 
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="bg-blue-500 px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">
                        Chatbot tư vấn
                    </h3>
                </div>
                <div className="bg-white px-4 py-5 sm:p-6">
                    <div className="border rounded-lg h-96 overflow-y-auto mb-4 p-4">
                        {messageHistory.map((msg, index) => (
                            <p key={index} className={`text-black ${msg.background} text-left border rounded-md`}
                                style={{ width: '50%', margin: msg.type === 'answer' ? '0.5rem 32rem 0 0' : '0.5rem 0 0 32rem', padding: '0.5rem' }}>
                                {msg.text}
                            </p>
                        ))}
                        {finalMessage && (
                            <p className="text-black bg-white text-left border rounded-md" style={{ width: '50%', margin: '0.5rem 0 0 32rem', padding: '0.5rem' }}>
                                {finalMessage}
                            </p>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="flex rounded-md shadow-sm">
                            <Input
                                type="text"
                                name="message"
                                id="message"
                                className="border-b border-gray-200 focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-md sm:text-sm border-gray-300"
                                placeholder="    Gửi tin nhắn ở đây..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}  
                            />
                            <div className="flex space-x-2 mx-2">
                                <label className="cursor-pointer">
                                    <span className="inline-flex items-center justify-center p-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
                                        📷
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <label className="cursor-pointer">
                                    <span className="inline-flex items-center justify-center p-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
                                        🎤
                                    </span>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={handleAudioUpload}
                                        className="hidden"
                                    />
                                </label>
                                <label className="cursor-pointer">
                                    <span className="inline-flex items-center justify-center p-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
                                        📄
                                    </span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={extractText} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                            <Button
                                type="button"
                                onClick={handleSend}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Gửi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBotPage;