"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "Làm thế nào để mở tài khoản tiết kiệm tại Nam Á Bank?",
        answer:
            "Bạn có thể mở tài khoản tiết kiệm bằng cách đến chi nhánh gần nhất với giấy tờ tùy thân <strong>(CMND/CCCD/Hộ chiếu)</strong>. Ngoài ra bạn cũng có thể mở tài khoản tiết kiệm trực tuyến thông qua ứng dụng ngân hàng hoặc website chính thức.",
    },
    {
        question: "Điều kiện để mở thẻ tín dụng tại Nam Á Bank?",
        answer: [
            "Để mở thẻ tín dụng bạn cần:",
            "• <strong>CMND/CCCD/Hộ chiếu</strong> hợp lệ.",
            "• Chứng minh thu nhập ổn định.",
            "• Người mở thẻ phải trên <strong>18 tuổi</strong>."
        ],
    },
    {
        question: "Lãi suất vay mua nhà hiện tại của ngân hàng là bao nhiêu?",
        answer:
            "Lãi suất vay mua nhà cố định trong <strong>2 năm đầu</strong> là <strong>8,0%/năm</strong>. Sau đó, lãi suất thả nổi được tính bằng lãi cơ động cộng thêm <strong>3,0%</strong>.",
    },
    {
        question: "Tôi cần làm gì nếu quên mật khẩu đăng nhập của tài khoản ngân hàng?",
        answer:
            "Nếu bạn quên mật khẩu ngân hàng, hãy sử dụng tính năng <strong>\"Quên mật khẩu\"</strong> trên ứng dụng hoặc website ngân hàng. Làm theo hướng dẫn để đặt lại mật khẩu mới. Nếu gặp khó khăn trong việc đặt lại mật khẩu mới, vui lòng liên hệ tổng đài hỗ trợ khách hàng 24/7 qua số <strong>1900 6679</strong>.",
    },
    {
        question: "Ngân hàng có chương trình khuyến mãi nào khi mở thẻ tín dụng không?",
        answer:
            "Hiện tại, Nam Á Bank miễn phí phí thường niên trong năm đầu tiên cho thẻ <strong>Vàng</strong> và thẻ <strong>Bạch Kim</strong>. Ngoài ra, Bạn còn có cơ hội nhận gấp đôi điểm thưởng khi thực hiện giao dịch trong tháng <strong>1</strong>.",
    },
    {
        question: "Làm thế nào để báo lỗi giao dịch không thành công khi chuyển tiền?",
        answer:
            "Nếu gặp lỗi khi chuyển tiền, hãy kiểm tra số dư tài khoản, thông tin người nhận, mã giao dịch và thử lại sau. Nếu vẫn không khắc phục được, vui lòng liên hệ tổng đài hỗ trợ khách hàng 24/7 qua số <strong>1900 6679</strong> hoặc đến chi nhánh của Nam Á Bank gần nhất để được hỗ trợ.",
    },
    {
        question: "Làm thế nào để kích hoạt giao dịch quốc tế cho thẻ ngân hàng của tôi?",
        answer:
            "Bạn có thể kích hoạt giao dịch quốc tế qua ứng dụng chuyển khoản Nam Á Bank hoặc đến chi nhánh gần nhất. Hãy đảm bảo bạn mang đầy đủ giấy tờ tùy thân như <strong>CMND/CCCD/Hộ chiếu</strong> của mình.",
    },
    {
        question: "Ngân hàng có thể hỗ trợ khách hàng vào những giờ nào?",
        answer:
            "Bạn có thể đến các chi nhánh của Nam Á Bank gần nhất vào các khoản thời gian làm việc từ <strong>8:00 sáng đến 17:00 chiều</strong>, từ thứ Hai đến thứ Sáu để được nhân viên hỗ trợ. Ngoài ra, Nam Á Bank cũng có thể hỗ trợ khách hàng ngoài giờ hành chính thông qua tổng đài hỗ trợ khách hàng 24/7 qua số <strong>1900 6679</strong>, email hỗ trợ khách hàng <strong>dichvukhachhang@namabank.com.vn</strong>, và dịch vụ chat trực tuyến trên website chính thức của Nam Á Bank.",
    },
]

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 px-10">
            <button
                onClick={onClick}
                className="flex w-full items-center justify-between py-4 text-left"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-medium">{question}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                >
                    <ChevronDown className="h-5 w-5" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-gray-600" dangerouslySetInnerHTML={{ __html: Array.isArray(answer) ? answer.join('<br />') : answer }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0)
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="mx-auto max-w-3xl px-4">
                <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Câu hỏi thường gặp</h1>
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

