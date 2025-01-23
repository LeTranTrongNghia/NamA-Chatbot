import React from "react";
import LeftSidebar from "./components/LeftSidebar";
import Header from "./components/Header";
import { TaskTable } from "./components/task-table";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import axios from 'axios';

const DashBoardPage = () => {
    const [date, setDate] = React.useState(new Date());

    // Add function to get tickets from last 24 hours
    const getLast24HoursTickets = async () => {
        const now = new Date();
        const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        try {
            const response = await axios.get('http://localhost:5050/ticket');
            // console.log("Raw tickets data:", response.data);

            const filteredTickets = response.data.filter(ticket => {
                const ticketDate = new Date(ticket.creationTime);
                return ticketDate >= yesterday && ticketDate <= now;
            });

            // console.log("Filtered tickets (last 24h):", filteredTickets);
            return filteredTickets;

        } catch (error) {
            console.error("Error fetching tickets:", error);
            return [];
        }
    };

    // Add function to send daily report
    const sendDailyReport = async () => {
        const tickets = await getLast24HoursTickets();

        const ticketsSummary = tickets.map(ticket =>
            `- Ticket ID: ${ticket._id}\n  Tóm tắt: ${ticket.summary}\n  Trạng thái: ${ticket.status}\n  Độ ưu tiên: ${ticket.priority}\n  Thời gian tạo: ${new Date(ticket.creationTime).toLocaleString()}\n`
        ).join('\n');

        console.log("Formatted Summary:", ticketsSummary);

        const templateParams = {
            date: new Date().toISOString().split('T')[0],
            to_name: 'TrongNghia của ban chuyển đổi số',
            message: `Báo cáo ticket hàng ngày\n\nNhững ticket được tạo trong 24 giờ qua:\n\n${ticketsSummary}\n\Tổng số ticket: ${tickets.length}`,
        };

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        try {
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            toast.success('Daily report sent successfully!');
        } catch (error) {
            console.error("Error sending daily report:", error);
            toast.error('Error sending daily report');
        }
    };

    // Set up daily scheduler
    React.useEffect(() => {
        const scheduleDaily = () => {
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(8, 30, 0, 0); // Set to 8:30:00.000 AM

            // If it's already past 8:30 AM today, schedule for tomorrow
            if (now > scheduledTime) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            const timeUntilSchedule = scheduledTime.getTime() - now.getTime();
            const timeUntilPreFetch = timeUntilSchedule - (60 * 1000); // 1 minute before scheduled time

            // console.log(`Next email scheduled for: ${scheduledTime.toLocaleString()}`);
            // console.log(`Time until next email: ${Math.floor(timeUntilSchedule / 1000 / 60)} minutes`);

            // Set up pre-fetch timer
            const preFetchTimer = setTimeout(() => {
                // console.log("Pre-fetching tickets data...");
                getLast24HoursTickets(); // Refresh the data 1 minute before sending
            }, timeUntilPreFetch);

            // Set up email sending timer
            const emailTimer = setTimeout(() => {
                sendDailyReport();
                scheduleDaily(); // Schedule next day's report after sending
            }, timeUntilSchedule);

            // Store the timer IDs for cleanup
            return () => {
                clearTimeout(preFetchTimer);
                clearTimeout(emailTimer);
            };
        };

        const cleanup = scheduleDaily();

        // Cleanup on component unmount
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

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