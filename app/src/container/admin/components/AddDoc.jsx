import React, { useState } from "react";
import { CalendarIcon, X, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import LeftSidebar from './LeftSidebar'
import Header from './Header'

const AddDoc = () => {
    const [date, setDate] = useState(new Date())
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSave = async () => {
        const newDoc = {
            name: title,
            content,
            dateUpdated: new Date().toISOString(),
        };

        try {
            await axios.post('http://localhost:5050/doc', newDoc);
            navigate('/doc');
        } catch (error) {
            console.error('Error adding new doc:', error);
        }
    };

    return (
        <div className="flex mt-6">
            <LeftSidebar activeView="edit" setActiveView={() => { }} navigate={navigate} />
            <div className="flex-1 pl-64">
                <Header date={date} setDate={setDate} />
                <Card className="max-w-full mx-2 my-8 border-none bg-background">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex flex-col">
                                <Button className="w-[160px]" onClick={() => window.location.href = '/doc'}>
                                    <ArrowLeft />Quay lại Admin
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 max-h-[420px] w-full">
                        <div className="flex mx-auto">
                            <Card className="w-full max-w-full mx-auto border border-gray-200 rounded-lg">
                                <CardHeader>
                                    <CardTitle>Thêm Tài Liệu Mới</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Document Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter document title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Document Content</Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Enter document content"
                                            className="min-h-[200px]"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button onClick={handleSave}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Document
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
                <div style={{ height: '100px' }} />
            </div>
        </div>
    );
};

export default AddDoc; 