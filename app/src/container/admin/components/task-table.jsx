import React, { useState, useEffect } from "react"
import { CheckCircle2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Circle, CircleAlert, CircleHelp, ArrowUpDown, Clock, MoreHorizontal, X, XCircle, ArrowDown, ArrowUp, FileCheck } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function TaskTable() {
    const [tickets, setTickets] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatusFilters, setSelectedStatusFilters] = useState(new Set());
    const [selectedPriorityFilters, setSelectedPriorityFilters] = useState(new Set());
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const navigate = useNavigate();

    // Fetch tickets from API
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:5050/ticket');
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchTickets();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case "Todo":
                return <Circle className="h-4 w-4 text-yellow-500" />
            case "In Progress":
                return <Clock className="h-4 w-4 text-blue-500" />
            case "Done":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "Canceled":
                return <XCircle className="h-4 w-4 text-red-500" />
            case "Backlog":
                return <CircleAlert className="h-4 w-4 text-gray-500" />
            default:
                return <CircleHelp className="h-4 w-4 text-gray-500" />
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "text-red-500"
            case "Medium":
                return "text-yellow-500"
            case "Low":
                return "text-green-500"
            default:
                return "text-black"
        }
    }

    const getPriorityValue = (priority) => {
        switch (priority) {
            case "High": return 3;
            case "Medium": return 2;
            case "Low": return 1;
            default: return 0;
        }
    }

    const getStatusValue = (status) => {
        const statusOrder = ["Todo", "In Progress", "Done", "Canceled", "Backlog"];
        return statusOrder.indexOf(status);
    }

    const filteredTasks = tickets.filter((ticket) => {
        const matchesStatus = selectedStatusFilters.size === 0 || selectedStatusFilters.has(ticket.status);
        const matchesPriority = selectedPriorityFilters.size === 0 || selectedPriorityFilters.has(ticket.priority);
        const matchesSearch = ticket.summary.toLowerCase().includes(searchQuery.toLowerCase()) || ticket._id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    }).sort((a, b) => {
        if (!sortOrder || !sortField) return 0;
        if (sortField === 'title') {
            return sortOrder === 'asc'
                ? a.summary.localeCompare(b.summary)
                : b.summary.localeCompare(a.summary);
        }
        if (sortField === 'id') {
            return sortOrder === 'asc'
                ? a._id.localeCompare(b._id)
                : b._id.localeCompare(a._id);
        }
        if (sortField === 'status') {
            const statusA = getStatusValue(a.status);
            const statusB = getStatusValue(b.status);
            return sortOrder === 'asc'
                ? statusA - statusB
                : statusB - statusA;
        }
        if (sortField === 'priority') {
            const priorityA = getPriorityValue(a.priority);
            const priorityB = getPriorityValue(b.priority);
            return sortOrder === 'asc'
                ? priorityB - priorityA
                : priorityA - priorityB;
        }
        return 0;
    });

    // Utility function to truncate summary
    const truncateSummary = (summary, wordLimit) => {
        const words = summary.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return summary;
    };

    return (
        <div className="border border-gray-200 rounded-lg mt-2 p-6">
            <div className="flex items-center border-b pb-4">
                <FileCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                <h1 className="text-lg font-semibold">Taskboard</h1>
            </div>
            <div className="w-full">
                <div className="flex items-center gap-4 py-4">
                    <Input
                        placeholder="Filter task's title or id..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border-dashed">
                                    <span>Status</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Filter by status..." />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandGroup>
                                            {["Todo", "In Progress", "Done", "Canceled", "Backlog"].map((status) => {
                                                const isSelected = selectedStatusFilters.has(status);
                                                return (
                                                    <CommandItem
                                                        key={status}
                                                        onSelect={() => {
                                                            const newSelected = new Set(selectedStatusFilters);
                                                            if (isSelected) {
                                                                newSelected.delete(status);
                                                            } else {
                                                                newSelected.add(status);
                                                            }
                                                            setSelectedStatusFilters(newSelected);
                                                            setStatusFilter(newSelected.size ? Array.from(newSelected) : ["all"]);
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={(checked) => {
                                                                    const newSelected = new Set(selectedStatusFilters);
                                                                    if (checked) {
                                                                        newSelected.add(status);
                                                                    } else {
                                                                        newSelected.delete(status);
                                                                    }
                                                                    setSelectedStatusFilters(newSelected);
                                                                    setStatusFilter(newSelected.size ? Array.from(newSelected) : ["all"]);
                                                                }}
                                                                className="mr-2"
                                                            />
                                                            <span>{status}</span>
                                                        </div>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border-dashed">
                                    <span>Priority</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Filter by priority..." />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandGroup>
                                            {["Low", "Medium", "High"].map((priority) => {
                                                const isSelected = selectedPriorityFilters.has(priority);
                                                return (
                                                    <CommandItem
                                                        key={priority}
                                                        onSelect={() => {
                                                            const newSelected = new Set(selectedPriorityFilters);
                                                            if (isSelected) {
                                                                newSelected.delete(priority);
                                                            } else {
                                                                newSelected.add(priority);
                                                            }
                                                            setSelectedPriorityFilters(newSelected);
                                                            setPriorityFilter(newSelected.size ? Array.from(newSelected) : ["all"]);
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={(checked) => {
                                                                    const newSelected = new Set(selectedPriorityFilters);
                                                                    if (checked) {
                                                                        newSelected.add(priority);
                                                                    } else {
                                                                        newSelected.delete(priority);
                                                                    }
                                                                    setSelectedPriorityFilters(newSelected);
                                                                    setPriorityFilter(newSelected.size ? Array.from(newSelected) : ["all"]);
                                                                }}
                                                                className="mr-2"
                                                            />
                                                            <span>{priority}</span>
                                                        </div>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-dashed text-red-500"
                            onClick={() => {
                                setSelectedStatusFilters(new Set());
                                setSelectedPriorityFilters(new Set());
                                setStatusFilter("all");
                                setPriorityFilter("all");
                            }}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedTasks.length === filteredTasks.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedTasks(filteredTasks.map((task) => task.id))
                                            } else {
                                                setSelectedTasks([])
                                                setSelectedStatusFilters(new Set());
                                                setStatusFilter("all");
                                                setPriorityFilter("all");
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="min-w-[100px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Task</span>
                                                {sortField === 'id' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('id');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Asc
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('id');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Desc
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Title</span>
                                                {sortField === 'title' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('title');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Asc
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('title');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Desc
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead className="min-w-[150px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Status</span>
                                                {sortField === 'status' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('status');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Asc
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('status');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Desc
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead className="min-w-[100px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Priority</span>
                                                {sortField === 'priority' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('priority');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Asc
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('priority');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Desc
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.map((ticket) => (
                                <TableRow key={ticket._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTasks.includes(ticket._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedTasks([...selectedTasks, ticket._id])
                                                } else {
                                                    setSelectedTasks(selectedTasks.filter((id) => id !== ticket._id))
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">
                                                {ticket._id.substring(0, 10)}...
                                            </span>
                                            <div className="flex gap-1">
                                                {ticket.tags.map((tag, index) => (
                                                    <Badge 
                                                        key={index} 
                                                        className="bg-red-100 text-red-800 hover:bg-red-100"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[400px] truncate">
                                        {truncateSummary(ticket.summary, 10)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ticket.status)}
                                            <span>{ticket.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/tickets/edit/${ticket._id}`)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
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
                        {selectedTasks.length} of {filteredTasks.length} row(s) selected
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Rows per page</span>
                            <Select defaultValue="6">
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6">6</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Page 1 of 10</span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <ChevronFirst />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <ChevronLeft />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <ChevronRight />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
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