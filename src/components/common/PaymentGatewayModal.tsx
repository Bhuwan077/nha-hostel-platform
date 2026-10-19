import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Smartphone, QrCode, ArrowRight, Loader2, Lock } from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (gateway: 'eSewa' | 'Khalti' | 'ConnectIPS', txnRef: string) => void;
  title: string;
  amount: number;
  itemDescription: string;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  amount,
  itemDescription,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<'eSewa' | 'Khalti' | 'ConnectIPS'>('eSewa');
  const [paymentMode, setPaymentMode] = useState<'qr' | 'credentials'>('qr');
  const [mobileNumber, setMobileNumber] = useState('9841234567');
  const [mpin, setMpin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedTxn, setGeneratedTxn] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txnRef = `${selectedGateway.toUpperCase()}-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setGeneratedTxn(txnRef);
      setIsProcessing(false);
      setIsComplete(true);
      setTimeout(() => {
        onSuccess(selectedGateway, txnRef);
        setIsComplete(false);
      }, 1500);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`p-5 text-white transition-colors duration-300 ${
          selectedGateway === 'eSewa'
            ? 'bg-gradient-to-r from-[#449130] to-[#60BB46]'
            : selectedGateway === 'Khalti'
            ? 'bg-gradient-to-r from-[#441f6f] to-[#5C2D91]'
            : 'bg-gradient-to-r from-[#003366] to-[#004B87]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm">
                {selectedGateway === 'eSewa' ? 'e' : selectedGateway === 'Khalti' ? 'K' : 'c'}
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">{selectedGateway} Payment Gateway</h3>
                <p className="text-[11px] text-white/80">Secured with Nepal Clearing House / PCI-DSS</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="p-5 bg-slate-50 border-b border-slate-200/80 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Payable Amount
            </span>
            <span className="text-2xl font-black text-slate-900">
              Rs. {amount.toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[260px]">{itemDescription}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
              Verified Merchant
            </span>
          </div>
        </div>

        {isComplete ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900">Payment Successful!</h4>
            <p className="text-xs text-slate-500 font-mono">Reference: {generatedTxn}</p>
            <p className="text-xs text-emerald-700 font-semibold">
              Reconciled on NHA ledger. Loading official receipt...
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Gateway Selection Tabs */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Choose Payment Provider
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('eSewa')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    selectedGateway === 'eSewa'
                      ? 'border-[#60BB46] bg-green-50 ring-2 ring-green-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#60BB46] text-white flex items-center justify-center font-black text-xs mb-1">
                    e
                  </div>
                  <span className="text-xs font-bold text-slate-800">eSewa</span>
                  <span className="text-[9px] text-green-700 font-medium">Digital Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('Khalti')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    selectedGateway === 'Khalti'
                      ? 'border-[#5C2D91] bg-purple-50 ring-2 ring-purple-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#5C2D91] text-white flex items-center justify-center font-black text-xs mb-1">
                    K
                  </div>
                  <span className="text-xs font-bold text-slate-800">Khalti</span>
                  <span className="text-[9px] text-purple-700 font-medium">Pay / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('ConnectIPS')}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    selectedGateway === 'ConnectIPS'
                      ? 'border-[#004B87] bg-blue-50 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#004B87] text-white flex items-center justify-center font-black text-xs mb-1">
                    c
                  </div>
                  <span className="text-xs font-bold text-slate-800">connectIPS</span>
                  <span className="text-[9px] text-blue-700 font-medium">Direct Bank</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher: QR Code vs Mobile MPIN */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMode('qr')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  paymentMode === 'qr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Nepali QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('credentials')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  paymentMode === 'credentials' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Wallet ID</span>
              </button>
            </div>

            {/* QR Scanner Mode */}
            {paymentMode === 'qr' ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center space-y-3">
                <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border border-slate-300 shadow-inner flex flex-col items-center justify-center">
                  {/* Stylized QR Matrix Pattern */}
                  <div className="w-full h-full border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-center p-2 bg-gradient-to-tr from-slate-100 to-slate-50 relative overflow-hidden">
                    <QrCode className="w-24 h-24 text-slate-800" />
                    <span className="text-[9px] font-mono font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded shadow-xs mt-1">
                      NHA-QR-MERCHANT
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">
                  Scan with your <strong>{selectedGateway}</strong> or any banking app to pay Rs. {amount.toLocaleString()}.
                </p>
              </div>
            ) : (
              /* Credentials Mode */
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Registered Mobile / {selectedGateway} ID
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-medium"
                    placeholder="98XXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    MPIN / Web PIN (Test: 1234)
                  </label>
                  <input
                    type="password"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-medium tracking-widest"
                    placeholder="••••"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-2xl font-black text-white flex items-center justify-center space-x-2 shadow-lg transition-all text-xs ${
                selectedGateway === 'eSewa'
                  ? 'bg-[#60BB46] hover:bg-[#52a13b] shadow-green-600/30'
                  : selectedGateway === 'Khalti'
                  ? 'bg-[#5C2D91] hover:bg-[#4a2278] shadow-purple-600/30'
                  : 'bg-[#004B87] hover:bg-[#003866] shadow-blue-600/30'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing with {selectedGateway}...</span>
                </>
              ) : (
                <>
                  <span>Confirm Rs. {amount.toLocaleString('en-IN')} via {selectedGateway}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>256-bit encrypted • NHA approved automated settlement</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
