import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy token và email từ URL
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const APP_BASE_URL = "http://127.0.0.1:8000";

    // Nếu link không hợp lệ (thiếu token/email)
    useEffect(() => {
        if (!token || !email) {
            setError("Đường dẫn không hợp lệ hoặc đã hết hạn.");
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== passwordConfirmation) {
            setError("Mật khẩu nhập lại không khớp.");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${APP_BASE_URL}/api/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = await res.json();

            if (res.ok && (data.status || data.success)) { // Laravel thường trả về 'status' khi reset pass thành công
                setMessage("Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay bây giờ.");
                setTimeout(() => navigate('/'), 3000); // Tự động chuyển về Login sau 3s
            } else {
                throw new Error(data.message || data.email || "Không thể đặt lại mật khẩu. Token có thể đã hết hạn.");
            }

        } catch (err) {
            setError(err.message || "Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-[480px]">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-8 md:p-10">
                    
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined text-3xl">lock_open</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
                        <p className="text-gray-500 text-sm mt-2">{email}</p>
                    </div>

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

                    {!message && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`mt-2 w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}