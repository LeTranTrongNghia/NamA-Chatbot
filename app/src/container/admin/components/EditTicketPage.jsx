'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { CalendarIcon, X, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import LeftSidebar from './LeftSidebar'
import Header from './Header'

export default function EditTicketPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [ticket, setTicket] = useState(null)
    const [tags, setTags] = useState([])
    const [date, setDate] = useState(new Date())
    const [content, setContent] = useState('')
    const [summary, setSummary] = useState('')
    const [status, setStatus] = useState('Todo')
    const [priority, setPriority] = useState('High')
    const [responsibleTeam, setResponsibleTeam] = useState('')
    const [adminNotes, setAdminNotes] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await axios.get(`http://localhost:5050/ticket/${id}`)
                const ticketData = response.data
                setTicket(ticketData)
                setTags(ticketData.tags || [])
                setDate(new Date(ticketData.creationTime || Date.now()))
                setContent(ticketData.content || '')
                setSummary(ticketData.summary || '')
                setStatus(ticketData.status || 'Lên kế hoạch')
                setPriority(ticketData.priority || 'Cao')
                setResponsibleTeam(ticketData.responsibleTeam || '')
                setAdminNotes(ticketData.adminNotes || '')
                fetchUserData(ticketData.userId)
            } catch (error) {
                console.error('Error fetching ticket:', error)
                navigate('/admin')
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
            fetchTicket()
        }
    }, [id, navigate])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const updatedTicket = {
                tags,
                content: ticket.content,
                summary,
                status,
                priority,
                responsibleTeam,
                adminNotes
            }
            await axios.patch(`http://localhost:5050/ticket/${id}`, updatedTicket)
            navigate('/dashboard')
        } catch (error) {
            console.error('Error updating ticket:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (!ticket) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex mt-6">
            <LeftSidebar activeView="edit" setActiveView={() => { }} navigate={navigate} />
            <div className="flex-1 pl-64">
                <Header date={date} setDate={setDate} />
                <Card className="max-w-[90%] mx-2 my-8 border-none bg-background">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex flex-col">
                                <Button className="w-[160px] mb-8" onClick={() => window.location.href = '/dashboard'}>
                                    <ArrowLeft />Quay lại Admin
                                </Button>
                                Chỉnh sửa ticket
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 max-h-[420px]">
                        <div className="space-y-2">
                            {userData && (
                                <div className="space-y-2 mb-6">
                                    <Label>Thông tin khách hàng gặp lỗi</Label>
                                    <div className="bg-gray-100 p-4 rounded">
                                        <p><Label>Tên:</Label> {userData.fullname}</p>
                                        <p><Label>Email:</Label> {userData.email}</p>
                                        <p><Label>Số điện thoại:</Label> {userData.phone}</p>
                                    </div>
                                </div>
                            )}
                            
                            <Label>Từ khóa</Label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-sm bg-red-100 text-red-800">
                                        {tag}
                                        <button
                                            onClick={() => setTags(tags.filter(t => t !== tag))}
                                            className="ml-2 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                <Select onValueChange={(value) => setTags([...tags, value])}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Thêm từ khóa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lỗi tính năng">Lỗi tính năng</SelectItem>
                                        <SelectItem value="Lỗi thẻ">Lỗi thẻ</SelectItem>
                                        <SelectItem value="Lỗi giao dịch">Lỗi giao dịch</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Nội dung khách hàng gặp phải</Label>
                            <Textarea
                                id="content"
                                value={content}
                                readOnly
                                className="min-h-[100px] bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="summary">Tóm tắt</Label>
                            <Textarea
                                id="summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Ngày tạo</Label>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-gray-100"
                                disabled
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP", { locale: vi }) : <span>No date selected</span>}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Tình trạng</Label>
                            <RadioGroup value={status} onValueChange={setStatus} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Lên kế hoạch" id="todo" />
                                    <Label htmlFor="todo">Lên kế hoạch</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Đang thực hiện" id="inprogress" />
                                    <Label htmlFor="inprogress">Đang thực hiện</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Đã hoàn thành" id="done" />
                                    <Label htmlFor="done">Đã hoàn thành</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Đã hủy" id="canceled" />
                                    <Label htmlFor="canceled">Đã hủy</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Chưa xử lý" id="backlog" />
                                    <Label htmlFor="backlog">Chưa xử lý</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Độ ưu tiên</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Thấp"><p className="text-green-500">Thấp</p></SelectItem>
                                    <SelectItem value="Trung bình"><p className="text-yellow-500">Trung bình</p></SelectItem>
                                    <SelectItem value="Cao"><p className="text-red-500">Cao</p></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Nhóm phụ trách</Label>
                            <Select value={responsibleTeam} onValueChange={setResponsibleTeam}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="frontend">Frontend</SelectItem>
                                    <SelectItem value="backend">Backend</SelectItem>
                                    <SelectItem value="devops">DevOps</SelectItem>
                                    <SelectItem value="support">Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminNotes">Ghi chú</Label>
                            <Textarea
                                id="adminNotes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Thêm ghi chú"
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                className="mb-8"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <div style={{ height: '100px' }} />
            </div>
        </div>
    )
}

