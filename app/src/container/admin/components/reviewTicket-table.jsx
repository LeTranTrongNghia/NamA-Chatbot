import React, { useState, useEffect } from "react"
import { CheckCircle2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Circle, CircleAlert, CircleHelp, ArrowUpDown, Clock, MoreHorizontal, X, XCircle, ArrowDown, ArrowUp, RefreshCcw, Archive } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function ReviewTicketTable() {
    const [feedback, setFeedback] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [userFullNames, setUserFullNames] = useState({});

    const fetchFeedback = async () => {
        try {
            const response = await axios.get('http://localhost:5050/feedback');
            setFeedback(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const fetchUserFullName = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5050/user/${userId}`);
            return response.data.fullname;
        } catch (error) {
            console.error('Error fetching user full name:', error);
            return null;
        }
    };

    const fetchUserFullNames = async (userIds) => {
        const fullNames = {};
        await Promise.all(userIds.map(async (userId) => {
            const fullName = await fetchUserFullName(userId);
            fullNames[userId] = fullName;
        }));
        setUserFullNames(fullNames);
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    useEffect(() => {
        const userIds = feedback.map(item => item.userId);
        fetchUserFullNames(userIds);
    }, [feedback]);

    // Move isToday helper function before filteredFeedback
    const isToday = (dateString) => {
        if (!dateString) return false;
        const today = new Date();
        const date = new Date(dateString);
        console.log('Date comparison:', {
            dateString,
            isValid: date instanceof Date && !isNaN(date),
            date,
            today
        });
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const filteredFeedback = feedback.filter((item) => {
        const matchesSearch = (
            item.problemFeedback?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item._id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesSearch;
    }).sort((a, b) => {
        // First prioritize today's feedback
        const isAToday = isToday(a.createAt);
        const isBToday = isToday(b.createAt);
        
        if (isAToday && !isBToday) return -1;
        if (!isAToday && isBToday) return 1;
        
        // Then apply the regular sorting if both items are from the same day
        if (!sortOrder || !sortField) return 0;
        if (sortField === 'problem') {
            return sortOrder === 'asc'
                ? a.problemFeedback.localeCompare(b.problemFeedback)
                : b.problemFeedback.localeCompare(a.problemFeedback);
        }
        if (sortField === 'id') {
            return sortOrder === 'asc'
                ? a._id.localeCompare(b._id)
                : b._id.localeCompare(a._id);
        }
        if (sortField === 'rating') {
            return sortOrder === 'asc'
                ? a.rating - b.rating
                : b.rating - a.rating;
        }
        return 0;
    });

    const indexOfLastTicket = currentPage * rowsPerPage;

    const indexOfFirstTicket = indexOfLastTicket - rowsPerPage;

    // Function to truncate detail feedback
    const truncateSummary = (summary, wordLimit) => {
        const words = summary.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return summary;
    };

    return (
        <div className="border border-gray-200 rounded-lg mt-2 p-6">
            <div className="flex items-center border-b pb-4 justify-between">
                <div className="flex items-center">
                    <Archive className="mr-2 h-4 w-4 text-muted-foreground" />
                    <h1 className="text-lg font-semibold">Đánh giá phản hồi</h1>
                </div>
                <Button variant="outline" size="sm" onClick={fetchFeedback}>
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>
            <div className="w-full">
                <div className="flex items-center gap-4 py-4">
                    <Input
                        placeholder="Tìm id hoặc tiêu đề của công việc..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox />
                                </TableHead>
                                <TableHead>ID user</TableHead>
                                <TableHead>Vấn đề phản hồi</TableHead>
                                <TableHead>Chi tiết phản hồi</TableHead>
                                <TableHead>Đánh giá</TableHead>
                                <TableHead>Hỗ trợ</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFeedback.slice(indexOfFirstTicket, indexOfLastTicket).map((item) => (
                                <TableRow key={item._id} className="text-gray-500">
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {userFullNames[item.userId] || "Unknown User"}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {item.userId}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {item.problemFeedback}
                                            {console.log('Item data:', item)}
                                            {isToday(item.createAt) && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Mới
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {truncateSummary(item.detailFeedback, 10)}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {item.detailFeedback}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={item.rating <= 2 ? "bg-red-200 text-red-700 hover:bg-red-200" : item.rating === 3 ? "bg-yellow-200 text-yellow-700 hover:bg-yellow-200" : "bg-green-200 text-green-700 hover:bg-green-200"}>
                                            {item.rating}/5
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.support ? "Có" : "Không"}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/feedback/${item._id}`)}>Chi tiết</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between py-4">
                    <div className="text-sm text-gray-500">
                        {selectedTasks.length} trong số {filteredFeedback.length} dòng được chọn
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Số dòng trong 1 trang</span>
                            <Select defaultValue="5">
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Trang {currentPage} trên {Math.ceil(filteredFeedback.length / rowsPerPage)}</span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                    <ChevronFirst />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                    <ChevronLeft />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(filteredFeedback.length / rowsPerPage)}>
                                    <ChevronRight />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(Math.ceil(filteredFeedback.length / rowsPerPage))} disabled={currentPage >= Math.ceil(filteredFeedback.length / rowsPerPage)}>
                                    <ChevronLast />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}