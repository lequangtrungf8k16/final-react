import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyEmail } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { token } = useParams<{ token: string }>();

    const { isLoading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid authentication link");
            navigate("/register");
        }
    }, [token, navigate]);

    const handleVerify = async () => {
        if (!token) return;
        try {
            await dispatch(verifyEmail(token)).unwrap();
            toast.success("Verification successful! Please log in");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    if (!token) return null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-2xl shadow-md w-96 text-center">
                <h2 className="text-xl font-bold mb-4">Verify Email</h2>
                <p className="text-sm text-gray-500 mb-4">
                    The system has recorded the verification code from your
                    email
                </p>

                <div className="bg-gray-100 p-3 rounded border font-mono text-blue-600 font-bold mb-6 break-all">
                    {token}
                </div>

                {error && (
                    <div className="mb-4 text-red-500 text-sm">{error}</div>
                )}

                <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isLoading ? "Verifying..." : "Verify Email"}
                </button>
            </div>
        </div>
    );
}
