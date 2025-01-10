import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Header = ({ date, setDate }) => {
    return (
        <header className="fixed right-0 left-64 top-0 z-20 flex h-18 pt-12 items-center justify-between bg-background px-6 mx-8">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Chào mừng tới NAB 👋</h1>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Dialog>
                    <DialogTrigger>
                        <Button variant="ghost" size="icon">
                            <Calendar className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Calendar</DialogTitle>
                            <DialogDescription>
                                <CalendarComponent
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="mx-24 rounded-md border text-black"
                                />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    );
};

export default Header; 