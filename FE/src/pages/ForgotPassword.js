import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // Thông báo thành công
    const [error, setError] = useState("");     // Thông báo lỗi

    const APP_BASE_URL = "http://127.0.0.1:8000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Vui lòng nhập địa chỉ Email.");
            return;
        }

        setLoading(true);

        try {
            // Gọi API Laravel: Route thường là POST /api/forgot-password
            const res = await fetch(`${APP_BASE_URL}/api/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Chúng tôi đã gửi link đặt lại mật khẩu vào email của bạn. Vui lòng kiểm tra hộp thư.");
            } else {
                throw new Error(data.message || data.email || "Không tìm thấy email này trong hệ thống.");
            }

        } catch (err) {
            setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-[480px]">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-8 md:p-10">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined text-3xl">lock_reset</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu?</h2>
                        <p className="text-gray-500 text-sm mt-2">
                            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
                        </p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            {message}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email đăng ký</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ví dụ: khachhang@gmail.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-2 w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transform active:scale-[0.99] transition-all duration-200
                            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang gửi...</span>
                                </div>
                            ) : "Gửi yêu cầu"}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
                        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}