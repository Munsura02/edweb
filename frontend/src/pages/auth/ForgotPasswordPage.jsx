import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { AlertCircle, CheckCircle, Mail, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsLoading(true);

        const result = await forgotPassword(email);

        if (result.success) {
            setStatus({ type: 'success', message: 'If an account exists with this email, you will receive a reset link.' });
        } else {
            setStatus({ type: 'error', message: result.error });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 animate-blob animation-delay-4000"></div>


            <div className="max-w-md w-full relative z-10 fade-in">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-white rounded-xl shadow-md border border-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Reset password
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Enter your email to receive instructions.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-[2rem] border border-white/20 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {status.message && (
                            <div className={`rounded-xl p-4 border animate-fade-in ${status.type === 'success' ? 'bg-green-50/80 border-green-100' : 'bg-red-50/80 border-red-100'}`}>
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        {status.type === 'success' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className={`text-sm font-medium ${status.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                            {status.message}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Input
                            label="Email address"
                            type="email"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />

                        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-indigo-200">
                            Send Reset Link
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
