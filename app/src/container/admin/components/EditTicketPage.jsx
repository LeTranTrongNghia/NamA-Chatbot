'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { CalendarIcon, X, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
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
                setStatus(ticketData.status || 'Todo')
                setPriority(ticketData.priority || 'High')
                setResponsibleTeam(ticketData.responsibleTeam || '')
                setAdminNotes(ticketData.adminNotes || '')
            } catch (error) {
                console.error('Error fetching ticket:', error)
                navigate('/admin')
            }
        }
        
        if (id) {
            fetchTicket()
        }
    }, [id, navigate])

    if (!ticket) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex mt-6">
            <LeftSidebar activeView="edit" setActiveView={() => {}} />
            <div className="flex-1 pl-64">
                <Header date={date} setDate={setDate} />
                <Card className="max-w-[90%] mx-2 my-8 border-none bg-background">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex flex-col">
                                <Button className="w-[160px] mb-8" onClick={() => window.location.href = '/admin'}><ArrowLeft/>Back to Admin</Button>
                                Edit Ticket
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 max-h-[420px]">
                        <div className="space-y-2">
                            <Label>Tags</Label>
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
                                        <SelectValue placeholder="Add tag" />
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
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Creation Time</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <RadioGroup value={status} onValueChange={setStatus} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Todo" id="todo" />
                                    <Label htmlFor="todo">Todo</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="In Progress" id="inprogress" />
                                    <Label htmlFor="inprogress">In Progress</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Done" id="done" />
                                    <Label htmlFor="done">Done</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Responsible Team</Label>
                            <Select value={responsibleTeam} onValueChange={setResponsibleTeam}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team" />
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
                            <Label htmlFor="adminNotes">Admin Notes</Label>
                            <Textarea
                                id="adminNotes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add administrative notes here..."
                                className="min-h-[80px]"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button className="mb-8">Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
                <div style={{ height: '100px' }} />
            </div>
        </div>
    )
}

