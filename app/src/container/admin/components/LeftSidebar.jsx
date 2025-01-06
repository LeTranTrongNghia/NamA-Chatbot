import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, Settings } from 'lucide-react';

const LeftSidebar = ({ activeView, setActiveView }) => {
    return (
        <aside className="fixed left-0 top-0 z-30 h-screen w-64 border-r bg-background">
            <div className="flex h-16 mt-6 items-center gap-2 border-b px-6">
                <div className="h-8 w-8 rounded-lg bg-primary">
                    <div className="flex h-full items-center justify-center text-primary-foreground">N</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">NAB</span>
                    <span className="text-xs text-muted-foreground">Ban chuyển đổi số</span>
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="space-y-1">
                    {/* <h2 className="px-4 py-2 text-xs font-semibold tracking-tight">MAIN</h2> */}
                    <Button
                        variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveView('dashboard')}
                    >
                        Bảng công việc
                    </Button>
                    {/* <Button
                        variant={activeView === 'progress' ? 'default' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveView('progress')}
                    >
                        Progress
                    </Button> */}
                </div>
                {/* <div className="space-y-1">
                    <h2 className="px-4 py-2 text-xs font-semibold tracking-tight">FAVORITE</h2>
                    <Button
                        variant='ghost'
                        className="w-full justify-start gap-2"
                        onClick={() => {}}
                    >
                        NAB team
                    </Button>
                </div> */}
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>TN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <span className="text-sm">Trong Nghia</span>
                                <span className="text-xs text-muted-foreground">trongnghiaa.work@gmail.com</span>
                            </div>
                            <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
};

export default LeftSidebar; 