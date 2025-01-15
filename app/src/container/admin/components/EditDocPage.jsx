'use client'

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import LeftSidebar from './LeftSidebar'
import Header from './Header'
import { CalendarIcon, X, ArrowLeft } from 'lucide-react'


export default function EditDocPage() {
    const navigate = useNavigate()
    const [date, setDate] = useState(new Date())
    const { id } = useParams()
    const [doc, setDoc] = useState(null)
    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [dateUpdated, setDateUpdated] = useState(new Date())
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchDoc = async () => {
            if (!id) return;
            try {
                const response = await axios.get(`http://localhost:5050/doc/${id}`)
                const docData = response.data
                setDoc(docData)
                setName(docData.name || '')
                setContent(docData.content || '')
                setDateUpdated(new Date(docData.dateUpdated || Date.now()))
            } catch (error) {
                console.error('Error fetching document:', error)
                navigate('/doc')
            }
        }

        fetchDoc()
    }, [id, navigate])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const updatedDoc = {
                name,
                content,
                dateUpdated: new Date().toISOString()
            }
            await axios.patch(`http://localhost:5050/doc/${id}`, updatedDoc)
            navigate('/doc')
        } catch (error) {
            console.error('Error updating document:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (!doc) {
        return <div>Loading...</div>
    }

    const showToast = () => {
        toast.success('Đã lưu thay đổi!');
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
                    <CardContent className="space-y-6 w-full">
                        <Card className="max-w-full w-full border border-gray-200 rounded-lg bg-background">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex flex-col">
                                        Chỉnh sửa tài liệu
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên tài liệu</Label>
                                    <Textarea
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="min-h-[40px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Nội dung tài liệu</Label>
                                    <Textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="min-h-[500px]"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <ToastContainer />
                                    <Button
                                        className="mb-8"
                                        onClick={() => {
                                            showToast();
                                            setTimeout(handleSave, 1500);
                                        }}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
                {/* <div style={{ height: '100px' }} /> */}
            </div>
        </div>
    )
}
