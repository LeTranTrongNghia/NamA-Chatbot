import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";


const UserRegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        service: ''
    });
    const [errors, setErrors] = useState({});
    const [docContent, setDocContent] = useState([]);

    const services = [
        { value: 'Lỗi tính năng', label: 'Lỗi tính năng' },
        { value: 'Lỗi thẻ', label: 'Lỗi thẻ' },
        { value: 'Lỗi giao dịch', label: 'Lỗi giao dịch' },
        { value: 'Tư vấn dịch vụ', label: 'Tư vấn dịch vụ' }
    ];

    const validateForm = () => {
        const newErrors = {};

        // Fullname validation
        if (!formData.fullName) {
            newErrors.fullName = 'Tên không thể trống';
        }

        // Email validation only if email is provided
        if (!formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Email không hợp lệ';
            }
        }

        // Phone validation only if phone is provided
        if (!formData.phone) {
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        // Service is the only required field
        if (!formData.service) {
            newErrors.service = 'Vui lòng chọn dịch vụ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkExistingUser = async () => {
        try {
            // Build query parameters based on provided information
            const queryParams = new URLSearchParams();
            if (formData.email) queryParams.append('email', formData.email);
            if (formData.phone) queryParams.append('phone', formData.phone);

            // Only check if either email or phone is provided
            if (formData.email || formData.phone) {
                const response = await axios.get(`http://localhost:5050/user/check?${queryParams}`);
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error checking existing user:', error);
            return null;
        }
    };

    const createOrUpdateUser = async () => {
        try {
            const existingUser = await checkExistingUser();

            if (existingUser) {
                // Update existing user with new service
                await axios.put(`http://localhost:5050/user/${existingUser._id}`, {
                    ...existingUser,
                    fullname: formData.fullName,
                    service: formData.service
                });
                // Store service in localStorage
                localStorage.setItem('userService', formData.service);
                return existingUser._id;
            } else {
                // Create new user
                const response = await axios.post('http://localhost:5050/user', formData);
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify({
                    ...formData,
                    userId: response.data.insertedId
                }));
                // Store service in localStorage
                localStorage.setItem('userService', formData.service);
                return response.data.insertedId;
            }
        } catch (error) {
            console.error('Error creating/updating user:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log('Form Data:', formData);
                const userId = await createOrUpdateUser();

                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify({
                    ...formData,
                    userId: userId
                }));

                // Navigate to ChatBotPage
                navigate('/chat');
            } catch (error) {
                console.error('Error handling form submission:', error);
                setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại sau' });
            }
        }
    };

    const str2xml = (str) => {
        if (str.charCodeAt(0) === 65279) {
            str = str.substr(1);
        }
        return new DOMParser().parseFromString(str, "text/xml");
    };

    const getParagraphs = (content) => {
        try {
            const zip = new PizZip(content);
            const xml = str2xml(zip.files["word/document.xml"].asText());
            const paragraphsXml = xml.getElementsByTagName("w:p");
            const paragraphs = [];

            for (let i = 0, len = paragraphsXml.length; i < len; i++) {
                let fullText = "";
                const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
                for (let j = 0, len2 = textsXml.length; j < len2; j++) {
                    const textXml = textsXml[j];
                    if (textXml.childNodes) {
                        fullText += textXml.childNodes[0].nodeValue;
                    }
                }
                if (fullText) {
                    paragraphs.push(fullText);
                }
            }
            return paragraphs;
        } catch (error) {
            console.error('Error parsing document:', error);
            return [];
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const paragraphs = getParagraphs(content);
                setDocContent(paragraphs);
                console.log('Extracted text:', paragraphs);
                // Store extracted text in localStorage
                localStorage.setItem('extractedDocText', JSON.stringify(paragraphs));
            } catch (error) {
                console.error('Error reading file:', error);
            }
        };
        reader.onerror = (error) => console.error('FileReader error:', error);
        reader.readAsBinaryString(file);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Thông tin người dùng</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Họ và tên
                        </label>
                        <Input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                        </label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Dịch vụ hỗ trợ <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={formData.service}
                            onValueChange={(value) => setFormData({ ...formData, service: value })}
                        >
                            <SelectTrigger className={errors.service ? "border-red-500" : ""}>
                                <SelectValue placeholder="Chọn dịch vụ" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service.value} value={service.value}>
                                        {service.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tải lên tài liệu
                        </label>
                        <Input
                            type="file"
                            accept=".docx"
                            onChange={handleFileUpload}
                            className="mt-1"
                        />
                    </div> */}

                    {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

                    <Button type="submit" className="w-full">
                        Tiếp tục
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default UserRegistrationPage; 