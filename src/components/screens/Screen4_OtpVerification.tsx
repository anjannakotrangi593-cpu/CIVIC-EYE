import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  phone: string;
  onBack: () => void;
  onVerifySuccess: () => void;
}

export const Screen4_OtpVerification: React.FC<Props> = ({ phone, onBack, onVerifySuccess }) => {
  const { loginWithOtp } = useAuth();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(28);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Pasted full code
      const pasted = val.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      pasted.forEach((char, idx) => {
        newDigits[idx] = char;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginWithOtp(phone, otp);
      if (res.success) {
        onVerifySuccess();
      } else {
        setErrorMsg(res.message || 'Verification failed');
      }
    } catch {
      setErrorMsg('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
    inputRefs.current[5]?.focus();
  };

  const formattedPhone = phone.startsWith('+91')
    ? phone
    : `+91 ${phone.replace(/^(\d{5})(\d{5})$/, '$1 $2')}`;

  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-blue-900">CIVICEYE</span>
          </div>
          <div className="w-5" />
        </div>

        {/* Title */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-slate-800">Verify OTP</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Enter the 6-digit code sent to <br />
            <span className="font-semibold text-slate-800">{formattedPhone}</span>
          </p>
        </div>

        {errorMsg && (
          <div className="mt-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* 6 OTP Boxes */}
        <div className="mt-8 flex justify-center gap-2.5">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-13 text-center text-xl font-bold bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 outline-none transition-all shadow-xs"
            />
          ))}
        </div>

        {/* Resend Timer & Demo Auto-fill */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-xs font-medium text-slate-500">
            {countdown > 0 ? (
              <>
                Resend OTP in <span className="font-bold text-blue-600">00:{countdown < 10 ? `0${countdown}` : countdown}</span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setCountdown(28)}
                className="text-blue-600 font-bold hover:underline"
              >
                Resend OTP
              </button>
            )}
          </p>

          <div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-semibold hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Fill Demo Code (123456)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verify Button */}
      <div className="pb-4">
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
};
