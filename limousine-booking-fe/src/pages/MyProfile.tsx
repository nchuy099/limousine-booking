import React, { useEffect, useState } from 'react';
import profileService from '../services/profileService';
import { toast } from 'react-hot-toast';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts';

interface ProfileForm {
    fullName: string;
    email: string;
    phoneNumber: string;
}

const MyProfile = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<ProfileForm>({
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [editedProfile, setEditedProfile] = useState<ProfileForm>({
        fullName: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (user) {
            // Nếu có user trong context thì dùng luôn
            setProfile({
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            });
            setEditedProfile({
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            });
        } else {
            // Nếu không có thì gọi API
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            const response = await profileService.getProfile();
            if (response.success && response.data) {
                setProfile(response.data);
                setEditedProfile(response.data);
            }
        } catch (error) {
            toast.error('Không thể tải thông tin hồ sơ');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await profileService.updateProfile({
                fullName: editedProfile.fullName,
                email: editedProfile.email,
                phoneNumber: editedProfile.phoneNumber
            });
            if (response.success) {
                setProfile(editedProfile);
                setIsEditing(false);
                toast.success('Cập nhật hồ sơ thành công');
            } else {
                toast.error(response.message || 'Cập nhật hồ sơ thất bại');
            }
        } catch (error) {
            toast.error('Cập nhật hồ sơ thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Hồ Sơ Của Tôi</h1>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-32 h-32 rounded-full bg-cyan-100 flex items-center justify-center">
                            <FaUser className="w-16 h-16 text-cyan-600" />
                        </div>
                    </div>

                    {/* Profile Information Section */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={isEditing ? editedProfile.fullName : profile.fullName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={isEditing ? editedProfile.email : profile.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={isEditing ? editedProfile.phoneNumber : profile.phoneNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                    >
                                        <FaEdit className="w-4 h-4 mr-2" />
                                        Chỉnh sửa hồ sơ
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                        >
                                            <FaTimes className="w-4 h-4 mr-2" />
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            <FaSave className="w-4 h-4 mr-2" />
                                            {isLoading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
