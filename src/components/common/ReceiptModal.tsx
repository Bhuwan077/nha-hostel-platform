import React from 'react';
import { X, Printer, CheckCircle, Download, Building, ShieldCheck } from 'lucide-react';
import { FeeRecord } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeRecord | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, fee }) => {
  if (!isOpen || !fee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide uppercase">Official NHA Electronic Receipt</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center space-x-1"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 bg-white" id="printable-receipt">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-5">
            <div className="inline-flex items-center justify-center space-x-2 mb-2">
              <Building className="w-6 h-6 text-blue-900" />
              <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                NEPAL HOSTEL ASSOCIATION (NHA)
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700">Central Member Hostel Platform — Digital Fee Receipt</p>
            <p className="text-[11px] text-slate-500">Government Reg. No: 19842/075 | Babar Mahal, Kathmandu, Nepal</p>
          </div>

          {/* Branch & Invoice Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Hostel Branch</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{fee.branchName}</p>
              <p className="text-slate-600 mt-1">Kathmandu Valley Region</p>
              <p className="text-[11px] text-emerald-700 font-medium">NHA Certified Facility</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500">Invoice #</span>
                <span className="font-mono font-bold text-slate-900">{fee.invoiceNumber}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-500">Billing Period:</span>
                <span className="font-medium text-slate-900">{fee.month}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-500">Payment Date:</span>
                <span className="font-medium text-slate-900">{fee.paidDate || 'Today'}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-500">Channel:</span>
                <span className="font-medium text-blue-700">{fee.paymentGateway || 'eSewa'}</span>
              </div>
            </div>
          </div>

          {/* Resident Details */}
          <div className="mb-6 bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-800">Resident Student</span>
              <p className="font-bold text-slate-900 text-sm">{fee.studentName}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-blue-800">Student ID</span>
              <p className="font-mono font-bold text-slate-900">{fee.studentId}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-xs mb-6">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600">
                <th className="text-left py-2">Fee Particulars</th>
                <th className="text-right py-2">Amount (NPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 text-slate-800">Monthly Room Rent & Accommodation</td>
                <td className="py-2.5 text-right font-medium">Rs. {fee.roomRent.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-800">4-Meal Hygienic Mess Charges (Monthly)</td>
                <td className="py-2.5 text-right font-medium">Rs. {fee.messFee.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-800">High-Speed Wi-Fi & Generator Electricity Utility</td>
                <td className="py-2.5 text-right font-medium">Rs. {fee.utilitiesFee.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-800">Weekly Laundry & Housekeeping Service</td>
                <td className="py-2.5 text-right font-medium">Rs. {fee.laundryFee.toLocaleString('en-IN')}</td>
              </tr>
              {fee.fineAmount > 0 && (
                <tr>
                  <td className="py-2.5 text-amber-700">Late Payment Fine</td>
                  <td className="py-2.5 text-right font-medium text-amber-700">Rs. {fee.fineAmount.toLocaleString('en-IN')}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 font-bold text-sm">
                <td className="pt-3 text-slate-900">Total Paid:</td>
                <td className="pt-3 text-right text-emerald-700">
                  Rs. {fee.totalAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Verification Stamp */}
          <div className="border-t border-dashed border-slate-300 pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center p-1 text-[8px] text-center font-mono text-slate-500">
                <div className="w-8 h-8 bg-slate-800 mb-0.5"></div>
                VERIFIED QR
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-mono">TXN REF: {fee.transactionRef || 'NHA-TXN-VERIFIED'}</p>
                <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>PAID & RECONCILED</span>
                </div>
                <p className="text-[9px] text-slate-400">Computer generated receipt. No physical signature required.</p>
              </div>
            </div>

            <div className="text-center border-2 border-emerald-600 rounded-lg p-2 text-emerald-700 font-black uppercase text-[10px] tracking-widest rotate-[-4deg] opacity-85">
              NHA AUDIT<br />STAMPED
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold bg-blue-900 text-white rounded-lg hover:bg-blue-800 flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
