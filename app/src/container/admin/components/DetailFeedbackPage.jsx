import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import LeftSidebar from './LeftSidebar'
import Header from './Header'

export default function FeedbackDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [feedback, setFeedback] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://localhost:5050/feedback/${id}`)
                const feedbackData = response.data
                setFeedback(feedbackData)
                fetchUserData(feedbackData.userId)
            } catch (error) {
                console.error('Error fetching feedback:', error)
                navigate('/admin')
            } finally {
                setIsLoading(false)
            }
        }

        const fetchUserData = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5050/user/${userId}`)
                setUserData(response.data)
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        if (id) {
            fetchFeedback()
        }
    }, [id, navigate])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!feedback) {
        return <div>No feedback found.</div>
    }

    return (
        <div className="flex mt-6">
            <LeftSidebar activeView="feedback" setActiveView={() => { }} navigate={navigate} />
            <div className="flex-1 pl-64">
                <Header />
                <Card className="max-w-[90%] mx-2 my-8 border-none bg-background">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex flex-col">
                                <Button className="w-[160px] mb-8" onClick={() => window.location.href = '/feedback'}>
                                    <ArrowLeft />Quay lại Admin
                                </Button>
                                Chi tiết đánh giá
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 max-h-[420px]">
                        <div className="space-y-3">
                            {userData && (
                                <div className="space-y-2 mb-2">
                                    <Label>Thông tin người đánh giá</Label>
                                    <div className="bg-gray-100 p-4 rounded">
                                        <p><Label>Tên:</Label> {userData.fullname}</p>
                                        <p><Label>Email:</Label> {userData.email}</p>
                                        <p><Label>Số điện thoại:</Label> {userData.phone}</p>
                                    </div>
                                </div>
                            )}

                            <Label>Ngày tạo</Label>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-gray-100"
                                disabled
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {feedback.createAt ? format(new Date(feedback.createAt), "PPP", { locale: vi }) : <span>No date selected</span>}
                            </Button>

                            <Label>Vấn đề đánh giá</Label>
                            <Textarea
                                value={feedback.problemFeedback}
                                readOnly
                                className="min-h-[100px] bg-gray-100"
                            />

                            <Label>Nội dung đánh giá</Label>
                            <Textarea
                                value={feedback.detailFeedback}
                                readOnly
                                className="min-h-[100px] bg-gray-100"
                            />

                            <div className="space-y-4 space-x-2 pb-4">
                                <Label>Đánh giá</Label>
                                <Badge className={feedback.rating <= 2 ? "bg-red-200 text-red-700 hover:bg-red-200" : feedback.rating === 3 ? "bg-yellow-200 text-yellow-700 hover:bg-yellow-200" : "bg-green-200 text-green-700 hover:bg-green-200"}>
                                    {feedback.rating}
                                </Badge>

                                <Label>Hỗ trợ thêm</Label>
                                <Badge>{feedback.support ? 'Có' : 'Không'}</Badge>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <ToastContainer />
                        </div>
                    </CardContent>
                </Card>
                <div style={{ height: '100px' }} />
            </div>
        </div>
    )
}