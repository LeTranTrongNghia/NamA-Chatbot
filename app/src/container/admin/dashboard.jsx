import React from "react";
import LeftSidebar from "./components/LeftSidebar";
import Header from "./components/Header";
import { TaskTable } from "./components/task-table";
import { useNavigate } from "react-router-dom";

const DashBoardPage = () => {
    const [date, setDate] = React.useState(new Date());

    return (
        <div className="max-h-screen bg-background">
            <LeftSidebar navigate={useNavigate()} />
            <div className="pl-64">
                <Header date={date} setDate={setDate} />
                <main className="px-6 mt-24">
                    <TaskTable />
                </main>
            </div>
        </div>
    );
};

export default DashBoardPage;