import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { AlertCircle, LockKeyhole } from 'lucide-react';

const ResetPasswordPage = () => {
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (passwords.password !== passwords.confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError("Invalid reset token.");
            setIsLoading(false);
            return;
        }

        const result = await resetPassword(token, passwords.password);

        if (result.success) {
            navigate('/login', { state: { message: 'Password reset successfully. Please login with new password.' } });
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-[20%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-3xl -translate-y-1/2 animate-blob"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-sky-200/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            <div className="max-w-md w-full relative z-10 fade-in">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-white rounded-xl shadow-md border border-violet-50 flex items-center justify-center mb-4 text-violet-600">
                        <LockKeyhole className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Set new password
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Your new password must be different from previous used passwords.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-[2rem] border border-white/20 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-xl bg-red-50/80 border border-red-100 p-4 animate-shake">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <PasswordInput
                            label="New Password"
                            name="password"
                            value={passwords.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            required
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            required
                        />

                        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-violet-200 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
