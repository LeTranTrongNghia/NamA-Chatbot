import React from "react";
import LeftSidebar from "./components/LeftSidebar";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { PolicyTable } from "./components/policy-table";

const PolicyPage = () => {
    const [date, setDate] = React.useState(new Date());

    return (
        <div className="max-h-screen bg-background">
            <LeftSidebar navigate={useNavigate()} />
            <div className="pl-64">
                <Header date={date} setDate={setDate} />
                <main className="px-6 mt-24">
                    <PolicyTable />
                </main>
            </div>
        </div>
    );
};

export default PolicyPage;