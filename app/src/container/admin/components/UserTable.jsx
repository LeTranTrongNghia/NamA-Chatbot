import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowUpRight, Copy } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

export function UserTable() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTickets, setUserTickets] = useState([]);
    const navigate = useNavigate();

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5050/user');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch users from API on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRowClick = async (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
        await fetchUserTickets(user.ticketIds);
    };

    const fetchUserTickets = async (ticketIds) => {
        const tickets = await Promise.all(ticketIds.map(async (id) => {
            try {
                const response = await axios.get(`http://localhost:5050/ticket/${id}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching ticket:', error);
                return null;
            }
        }));
        setUserTickets(tickets.filter(ticket => ticket !== null));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard: " + text);
    };

    return (
        <div className="flex mt-6">
            <LeftSidebar activeView="edit" setActiveView={() => { }} navigate={navigate} />
            <div className="flex-1 pl-64">
                <div className="border border-gray-200 rounded-lg mt-2 p-6">
                    <h1 className="text-lg font-semibold">Quản lý người dùng</h1>
                    <div className="flex items-center border-b pb-4 justify-between">
                        <Input
                            placeholder="Tìm kiếm người dùng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-sm my-2"
                        />
                        <div className="flex items-center">
                            <Button variant="outline" size="sm" onClick={fetchUsers}>Refresh</Button>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Số phiếu</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.filter(user =>
                                (user.fullname?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                (user.phone || '').includes(searchQuery)
                            ).map((user) => (
                                <TableRow key={user.id} onClick={() => handleRowClick(user)}>
                                    <TableCell>{user.fullname}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.ticketIds.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thông tin người dùng</DialogTitle>
                                <DialogDescription>
                                    Dưới đây là thông tin chi tiết của {selectedUser?.fullname}:
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col">
                                <div className="flex justify-between py-2">
                                    <span>Tên: {selectedUser?.fullname}</span>
                                    <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(selectedUser?.fullname)}>
                                        <span className="sr-only">Copy</span>
                                        <Copy />
                                    </Button>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>Email: {selectedUser?.email}</span>
                                    <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(selectedUser?.email)}>
                                        <span className="sr-only">Copy</span>
                                        <Copy />
                                    </Button>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>Số điện thoại: {selectedUser?.phone}</span>
                                    <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(selectedUser?.phone)}>
                                        <span className="sr-only">Copy</span>
                                        <Copy />
                                    </Button>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-300">
                                    <span>Số phiếu: {selectedUser?.ticketIds.length}</span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-semibold">Danh sách phiếu của khách hàng:</h3>
                                    {userTickets.map(ticket => (
                                        <div key={ticket._id} className="flex justify-between py-2">
                                            <span>{ticket._id}</span>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="px-3"
                                                onClick={() => navigate(`/dashboard/tickets/edit/${ticket._id}`)}
                                            >
                                                <ArrowUpRight />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
} 