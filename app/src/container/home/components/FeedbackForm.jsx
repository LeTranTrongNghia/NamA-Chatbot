import React, { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";

export function CustomerFeedbackForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = location.state || {};
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            feedbackType: "",
            detailedFeedback: "",
            rating: 0,
            wantContact: false,
        },
    });

    async function onSubmit(values) {
        setIsSubmitting(true);
        try {
            const feedbackData = {
                userId: userId,
                createAt: new Date().toISOString(),
                problemFeedback: values.feedbackType,
                detailFeedback: values.detailedFeedback,
                rating: values.rating,
                support: values.wantContact,
            };

            const response = await axios.post('http://localhost:5050/feedback', feedbackData);
            console.log('Feedback submitted:', response.data);
            toast.success('Cảm ơn bạn đã gửi góp ý!');
            navigate('/chat');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <div className="mb-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/chat')}
                    className="p-2 hover:bg-blue-100"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Chat
                </Button>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-2xl font-bold mb-4">Mẫu Góp ý Chatbot</h1>
                        <FormField
                            control={form.control}
                            name="feedbackType"
                            rules={{ required: "Vui lòng chọn loại góp ý" }}
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>1. Xin chào! Bạn muốn góp ý về vấn đề gì?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Trả lời không đúng nội dung câu hỏi" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Trả lời không đúng nội dung câu hỏi
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Thời gian phản hồi quá chậm" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Thời gian phản hồi quá chậm
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Thông tin cung cấp chưa đầy đủ" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Thông tin cung cấp chưa đầy đủ
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Chatbot không hiểu câu hỏi của tôi" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Chatbot không hiểu câu hỏi của tôi
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FormField
                            control={form.control}
                            name="detailedFeedback"
                            rules={{ required: "Vui lòng nhập nội dung góp ý" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>2. Nội dung góp ý chi tiết</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Vui lòng mô tả cụ thể vấn đề bạn gặp phải để chúng tôi cải thiện dịch vụ"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <FormField
                            control={form.control}
                            name="rating"
                            rules={{ required: "Vui lòng đánh giá trải nghiệm" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>3. Đánh giá trải nghiệm của bạn với chatbot</FormLabel>
                                    <FormControl>
                                        <StarRating 
                                            rating={field.value} 
                                            onRatingChange={(value) => field.onChange(value)} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Đánh giá từ 1 đến 5 sao, trong đó 1 là rất không hài lòng và 5 là rất hài lòng
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <FormField
                            control={form.control}
                            name="wantContact"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            4. Bạn có muốn chúng tôi liên hệ để hỗ trợ thêm không?
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex justify-end space-x-4"
                    >
                        <Button
                            onClick={() => navigate('/chat')}
                            variant="outline"
                            type="button"
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang gửi...' : 'Gửi góp ý'}
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </div>
    );
}

