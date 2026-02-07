import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { AlertCircle, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('Email not found. Please try registering again.');
            setIsLoading(false);
            return;
        }

        const result = await verifyOtp(email, otp);

        if (result.success) {
            navigate('/login', { state: { message: 'Verification successful. Please login.' } });
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    if (!email) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-blob"></div>
                <div className="max-w-md w-full relative z-10 text-center bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/20">
                    <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Error</h2>
                    <p className="mt-2 text-slate-600">No email provided for verification.</p>
                    <Link to="/signup" className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium">
                        Go to Signup <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Decorative Blobs */}
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-blob"></div>

            <div className="max-w-md w-full relative z-10 fade-in">
                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center mb-4 transform rotate-3">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-slate-600">
                        We sent a code to <span className="font-semibold text-slate-800">{email}</span>
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

                        <div className="space-y-4">
                            <Input
                                label="One-Time Password"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000000"
                                maxLength={6}
                                required
                                className="tracking-[1em] text-center text-2xl font-mono h-16"
                            />
                            <p className="text-xs text-center text-gray-500">
                                Enter the 6-digit code sent to your inbox.
                            </p>
                        </div>

                        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-teal-100 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                            Verify Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                            Resend code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
