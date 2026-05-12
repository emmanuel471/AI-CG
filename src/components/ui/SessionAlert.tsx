import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {AppDispatch,persistor,RootState,selectDecryptedTokens,selectUser} from "@/store/store";
import { hideSessionAlert } from "@/auth-actions/sessionAlertSlice";
import { LOGIN_FAILURE } from "@/store/authActionTypes";
import { useNavigate } from "react-router-dom";
import { refreshTokens } from "@/auth-actions/AuthActions";

const SessionAlert = () => {
  const navigate = useNavigate()  
  const dispatch = useDispatch<AppDispatch>();
  const { visible, message } = useSelector(
    (state: RootState) => state.sessionAlert,
  );
  const { refreshToken, accessToken } = useSelector(selectDecryptedTokens);
  const [countdown, setCountdown] = useState(30);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (!visible || sessionExpired) return;

    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, sessionExpired]);

  if (!visible) return null;

  const handleLogout = async () => {
    dispatch({ type: LOGIN_FAILURE });
    await persistor.purge();
    sessionStorage.clear();
    navigate("/");
    dispatch(hideSessionAlert());
  };

  const handleRefreshTokens = async () => {
    try {
      await dispatch(refreshTokens(refreshToken!));
      dispatch(hideSessionAlert());
      window.location.reload();
    } catch (err) {
      console.error("Failed to refresh tokens:", err);
      setSessionExpired(true);
    }
  };

  if (sessionExpired) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-fade-in">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Session Expired
          </h2>

          <p className="text-gray-600 mb-6">
            Your session has fully expired and could not be renewed. Please sign
            in again to continue.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-fade-in">
        <div className="mb-4">
          <svg
            className="w-12 h-12 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Session Expiring
        </h2>

        <p className="text-gray-600 mb-2">{message}</p>

        <p className="text-sm text-gray-500 mb-6">
          Signing out in{" "}
          <span className="font-bold text-red-500">{countdown}</span> seconds...
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleRefreshTokens}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionAlert;
