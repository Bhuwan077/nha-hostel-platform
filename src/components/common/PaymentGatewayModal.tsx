import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Smartphone, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

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
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">{title}</h3>
              <p className="text-xs text-slate-300">Nepal Certified Secure Payment Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Summary */}
        <div className="p-5 bg-slate-50 border-b border-slate-200/80">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Payable</span>
            <span className="text-2xl font-extrabold text-slate-900">
              Rs. {amount.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-slate-600 truncate">{itemDescription}</p>
        </div>

        {isComplete ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
            <p className="text-xs text-slate-500 font-mono">Txn Ref: {generatedTxn}</p>
            <p className="text-xs text-emerald-600 font-medium">Generating official digital receipt...</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Gateway Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('eSewa')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedGateway === 'eSewa'
                      ? 'border-green-600 bg-green-50/80 ring-2 ring-green-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#60BB46] flex items-center justify-center font-black text-white text-xs mb-1">
                    e
                  </div>
                  <span className="text-xs font-bold text-slate-800">eSewa</span>
                  <span className="text-[10px] text-green-700">Digital Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('Khalti')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedGateway === 'Khalti'
                      ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#5C2D91] flex items-center justify-center font-black text-white text-xs mb-1">
                    K
                  </div>
                  <span className="text-xs font-bold text-slate-800">Khalti</span>
                  <span className="text-[10px] text-purple-700">Pay / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('ConnectIPS')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedGateway === 'ConnectIPS'
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#004B87] flex items-center justify-center font-black text-white text-xs mb-1">
                    c
                  </div>
                  <span className="text-xs font-bold text-slate-800">connectIPS</span>
                  <span className="text-[10px] text-blue-700">Direct Bank</span>
                </button>
              </div>
            </div>

            {/* Input credentials */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Registered Mobile / eSewa ID
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  MPIN / Password (Demo)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="****"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>PCI-DSS Level 1 Encrypted</span>
              <span>256-Bit SSL Secured</span>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 shadow-lg transition-all ${
                selectedGateway === 'eSewa'
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/25'
                  : selectedGateway === 'Khalti'
                  ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-700/25'
                  : 'bg-blue-700 hover:bg-blue-800 shadow-blue-700/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authorizing with {selectedGateway}...</span>
                </>
              ) : (
                <>
                  <span>Pay Rs. {amount.toLocaleString('en-IN')} via {selectedGateway}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
