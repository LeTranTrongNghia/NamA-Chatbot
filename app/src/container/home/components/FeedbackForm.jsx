import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "./StarRating"
import { Navigate, useNavigate } from 'react-router-dom';

export function CustomerFeedbackForm() {
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            feedbackType: "incorrect_answer",
            otherFeedback: "",
            detailedFeedback: "",
            rating: 0,
            wantContact: false,
            name: "",
            phone: "",
            email: "",
        },
    })

    function onSubmit(values) {
        console.log(values)
        // Handle form submission here
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-2xl font-bold mb-4">Mẫu Góp ý Chatbot</h1>
                        <FormField
                            control={form.control}
                            name="feedbackType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>1. Xin chào! Bạn muốn góp ý về vấn đề gì?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="incorrect_answer" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Trả lời không đúng nội dung câu hỏi.</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="slow_response" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Thời gian phản hồi quá chậm.</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="incomplete_info" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Thông tin cung cấp chưa đầy đủ.</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="not_understood" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Chatbot không hiểu câu hỏi của tôi.</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="other" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Vấn đề khác:</FormLabel>
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
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <FormField
                            control={form.control}
                            name="otherFeedback"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Vấn đề khác" {...field} />
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
                            rules={{ required: "Please provide detailed feedback." }}
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
                            rules={{ required: "Please provide a rating." }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>3. Đánh giá trải nghiệm của bạn với chatbot</FormLabel>
                                    <FormControl>
                                        <StarRating rating={field.value} onRatingChange={field.onChange} />
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
                                        <FormLabel>4. Bạn có muốn chúng tôi liên hệ để hỗ trợ thêm không?</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* {form.watch("wantContact") && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                rules={{
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    )} */}

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
                        <Button type="submit">Gửi góp ý</Button>
                    </motion.div>
                </form>
            </Form>
        </div>
    )
}

