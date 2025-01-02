import React from "react";
import LeftSidebar from "./components/LeftSidebar";
import Header from "./components/Header";
import { CustomKanban } from "./components/kanban-board";
import { TaskTable } from "./components/task-table";

const DashBoardPage = () => {
    const [date, setDate] = React.useState(new Date());
    const [activeView, setActiveView] = React.useState('dashboard');

    return (
        <div className="max-h-screen bg-background">
            <LeftSidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="pl-64">
                <Header date={date} setDate={setDate} />
                <main className="px-6 mt-24">
                    {activeView === 'dashboard' ? <TaskTable /> : <CustomKanban />}
                </main>
            </div>
        </div>
    );
};

export default DashBoardPage;