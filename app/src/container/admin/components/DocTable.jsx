import React, { useState, useEffect } from "react"
import { CheckCircle2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Circle, CircleAlert, CircleHelp, ArrowUpDown, Clock, MoreHorizontal, X, XCircle, ArrowDown, ArrowUp, FileCheck, RefreshCcw, Plus } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function DocsTable() {
    const [docs, setDocs] = useState([]);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);

    const fetchDocs = async () => {
        try {
            const response = await axios.get('http://localhost:5050/doc');
            setDocs(response.data);
        } catch (error) {
            console.error('Error fetching docs:', error);
        }
    };

    // Fetch docs from API on component mount
    useEffect(() => {
        fetchDocs();
    }, []);

    const addNewDoc = () => {
        navigate('/doc/add');
    };

    const filteredDocs = docs.filter((doc) => {
        return doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const indexOfLastDoc = currentPage * rowsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - rowsPerPage;
    const currentDocs = filteredDocs.slice(indexOfFirstDoc, indexOfLastDoc);

    const handleDeleteClick = (docId) => {
        setDocToDelete(docId);
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5050/doc/${docToDelete}`);
            await fetchDocs(); // Refresh the list
            setIsDialogOpen(false);
            window.location.reload()
        } catch (error) {
            console.error('Error deleting doc:', error);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg mt-2 p-6">
            <div className="flex items-center border-b pb-4 justify-between">
                <div className="flex items-center">
                    <FileCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                    <h1 className="text-lg font-semibold">Bảng tài liệu hỗ trợ</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={addNewDoc}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchDocs}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex items-center gap-4 py-4">
                    <Input
                        placeholder="Tìm tên tài liệu hoặc nội dung..."
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
                                    <Checkbox
                                        checked={selectedDocs.length === currentDocs.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedDocs(currentDocs.map((doc) => doc._id))
                                            } else {
                                                setSelectedDocs([]);
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="min-w-[100px]">Tên tài liệu</TableHead>
                                <TableHead>Nội dung</TableHead>
                                <TableHead className="min-w-[150px]">Ngày cập nhật</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentDocs.map((doc) => (
                                <TableRow key={doc._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedDocs.includes(doc._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedDocs([...selectedDocs, doc._id])
                                                } else {
                                                    setSelectedDocs(selectedDocs.filter((id) => id !== doc._id))
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell className="max-w-[400px] truncate">{doc.content}</TableCell>
                                    <TableCell>{new Date(doc.dateUpdated).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/doc/edit/${doc._id}`)}>
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(doc._id)}>
                                                    Xóa
                                                </DropdownMenuItem>
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
                        {selectedDocs.length} trong số {filteredDocs.length} dòng được chọn
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Trang {currentPage} trên {Math.ceil(filteredDocs.length / rowsPerPage)}</span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                    <ChevronFirst />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                    <ChevronLeft />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(filteredDocs.length / rowsPerPage)}>
                                    <ChevronRight />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(Math.ceil(filteredDocs.length / rowsPerPage))} disabled={currentPage >= Math.ceil(filteredDocs.length / rowsPerPage)}>
                                    <ChevronLast />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Không</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-800">
                            Có, xóa tài liệu này
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}