import React, { useState } from 'react';
import { X, Mail, KeyRound, User, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }: AuthModalProps) {
  const { loginWithOtp, registerWithOtp, verifyOtp } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<'details' | 'otp'>('details');

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginWithOtp(email);
        setIsLoading(false);
        if (res.success) {
          setOtpHint(res.otp_code_preview || '123456');
          setStep('otp');
          setFeedback({ type: 'success', message: 'Verification code sent to your email.' });
        } else {
          setFeedback({ type: 'error', message: res.message || 'Failed to send OTP' });
        }
      } else {
        const res = await registerWithOtp(email, fullName, phone, address);
        setIsLoading(false);
        if (res.success) {
          setOtpHint(res.otp_code_preview || '123456');
          setStep('otp');
          setFeedback({ type: 'success', message: 'Verification code sent to your email.' });
        } else {
          setFeedback({ type: 'error', message: res.message || 'Failed to send OTP' });
        }
      }
    } catch {
      setIsLoading(false);
      setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    const res = await verifyOtp(email, otpCode);
    setIsLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const fillDemoData = () => {
    setEmail('sabbir.sylhet@example.com');
    setFullName('Sabbir Ahmed');
    setPhone('+8801712398456');
    setAddress('House 45, Road 2, Shahjalal Uposhohor, Sylhet');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-[#12121a] border border-[#272738] rounded-xl max-w-md w-full p-6 shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#20202e] pb-4">
          <div>
            <h3 className="font-brand text-lg font-bold text-white">
              {step === 'otp' ? 'Enter Verification Code' : mode === 'login' ? t.login : t.register}
            </h3>
            <p className="text-xs text-[#808098]">
              {step === 'otp'
                ? `Sent to ${email}`
                : 'Experience fine Japanese dining in Sylhet'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#808096] hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle when on details step */}
        {step === 'details' && (
          <div className="flex p-1 bg-[#181824] rounded-lg border border-[#232332]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setFeedback(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                mode === 'login' ? 'bg-[#c5a059] text-[#0d0d12] font-semibold' : 'text-[#a0a0b5] hover:text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setFeedback(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                mode === 'register' ? 'bg-[#c5a059] text-[#0d0d12] font-semibold' : 'text-[#a0a0b5] hover:text-white'
              }`}
            >
              {t.register}
            </button>
          </div>
        )}

        {/* Demo Autofill Shortcut */}
        {step === 'details' && (
          <div className="flex items-center justify-between px-3 py-2 bg-[#171722] rounded border border-[#262638] text-xs">
            <span className="text-[#8888a0]">Quick Testing:</span>
            <button
              type="button"
              onClick={fillDemoData}
              className="text-[#c5a059] hover:underline font-medium"
            >
              Autofill Sample Diner
            </button>
          </div>
        )}

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3 rounded text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-800 text-rose-300'
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Step 1: Input details */}
        {step === 'details' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#a0a0b8]">{t.fullName}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#606078] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Rahman"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#171724] border border-[#28283a] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#a0a0b8]">{t.phone}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#606078] absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+8801841965676"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#171724] border border-[#28283a] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#a0a0b8]">{t.deliveryAddress}</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#606078] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Mirboxtula / Zindabazar, Sylhet"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#171724] border border-[#28283a] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#a0a0b8]">{t.email}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#606078] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#171724] border border-[#28283a] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs rounded transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? 'Sending Code...' : 'Send Secure OTP'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* Step 2: OTP verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {otpHint && (
              <div className="p-3 bg-[#1e1e2d] border border-[#c5a059]/40 rounded text-center">
                <p className="text-xs text-[#a0a0b8]">Test OTP Code for Evaluation:</p>
                <p className="text-lg font-mono font-bold text-[#c5a059] tracking-widest mt-1">
                  {otpHint}
                </p>
                <p className="text-[10px] text-[#707088] mt-0.5">
                  (Or click below to auto-fill)
                </p>
                <button
                  type="button"
                  onClick={() => setOtpCode(otpHint)}
                  className="mt-1 text-xs text-[#c5a059] hover:underline font-mono"
                >
                  Insert Code
                </button>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#a0a0b8]">6-Digit OTP Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#606078] absolute left-3 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-[#171724] border border-[#28283a] rounded pl-9 pr-3 py-2 text-sm font-mono tracking-widest text-center text-white placeholder-[#505068] focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d8b56f] text-[#0d0d12] font-semibold text-xs rounded transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
            </button>

            <div className="flex justify-between items-center text-xs text-[#808098] pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="hover:text-white"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-[#c5a059] hover:underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
