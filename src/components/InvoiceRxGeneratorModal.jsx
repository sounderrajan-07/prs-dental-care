import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import logoImg from '../../Images/PRS.logo.webp';

function numberToWords(num) {
  if (!num || isNaN(num) || num === 0) return 'Rupees Zero Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return 'Rupees ' + inWords(Math.floor(num)) + ' Only';
}

export default function InvoiceRxGeneratorModal({ isOpen, onClose, initialData = null }) {
  const [activeTab, setActiveTab] = useState('rx'); // 'invoice' or 'rx'
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
  const documentRef = useRef(null);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [shareNotice, setShareNotice] = useState('');

  // Metadata State
  const [invoiceNo] = useState(() => `PRS-INV-${Math.floor(100000 + Math.random() * 900000)}`);
  const [rxNo] = useState(() => `PRS-RX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('UPI / GPay');
  const [paymentStatus, setPaymentStatus] = useState('Paid');

  // Common Patient State
  const [patientName, setPatientName] = useState(initialData?.name || initialData?.patientName || 'Kavitha Ramesh');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Female');
  const [phone, setPhone] = useState(initialData?.phone || initialData?.patientPhone || '+91 98401 23456');
  const [doctorName, setDoctorName] = useState(initialData?.preferredDoctor || initialData?.attendingDoctor || 'Dr. Purushotham');
  const [diagnosis, setDiagnosis] = useState(initialData?.service || initialData?.treatmentName || 'Acute Irreversible Pulpitis');

  // Rx State
  const [clinicalAdvice, setClinicalAdvice] = useState('Soft diet for 2 days. Avoid hot food & beverages. Maintain oral hygiene and swish mouthwash twice daily after meals.');
  const [nextVisitDate, setNextVisitDate] = useState('In 5 Days / As Advised');
  const [medications, setMedications] = useState([
    { drug: 'Tab. Amoxycillin 500mg', dosage: '1-0-1 (After Food)', duration: '5 Days', notes: 'Antibiotic - complete course' },
    { drug: 'Tab. Zerodol-SP (Aceclofenac + Serratiopeptidase)', dosage: '1-0-1 (After Food)', duration: '3 Days', notes: 'Pain killer & Anti-inflammatory' },
    { drug: 'Tab. Pan-40 (Pantoprazole 40mg)', dosage: '1-0-0 (Before Food)', duration: '5 Days', notes: 'Antacid' },
    { drug: 'Hexidine Mouthwash 0.2%', dosage: '10ml Swish & Spit', duration: '7 Days', notes: 'Twice daily after brushing' }
  ]);

  // Invoice Items State
  const [invoiceItems, setInvoiceItems] = useState([
    { description: initialData?.service || initialData?.treatmentName || 'Root Canal Treatment - Lower Molar (Sitting 1)', qty: 1, rate: 4500 },
    { description: 'X-Ray Intraoral RVG (2 Exposures)', qty: 2, rate: 300 }
  ]);
  const [discount, setDiscount] = useState(200);

  if (!isOpen) return null;

  const handleAddMedication = () => {
    setMedications([...medications, { drug: '', dosage: '1-0-1', duration: '5 Days', notes: '' }]);
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleRemoveMed = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleAddInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', qty: 1, rate: 1000 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;
    setInvoiceItems(updated);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const subtotal = invoiceItems.reduce((acc, item) => acc + (Number(item.qty) * Number(item.rate) || 0), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0));

  const generateDocumentCanvas = async () => {
    let prevView = viewMode;
    if (prevView === 'edit') {
      setViewMode('preview');
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (!documentRef.current) return null;

    const canvas = await html2canvas(documentRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    return canvas;
  };

  const handleDownloadDocumentImage = async () => {
    try {
      setIsGeneratingDoc(true);
      setShareNotice('');
      const canvas = await generateDocumentCanvas();
      if (!canvas) {
        setIsGeneratingDoc(false);
        return;
      }

      const docName = activeTab === 'rx' ? 'Prescription' : 'Invoice';
      const cleanName = (patientName || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `PRS_Dental_${docName}_${cleanName}.png`;

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShareNotice(`✓ Exact document image (${filename}) downloaded to device!`);
      setTimeout(() => setShareNotice(''), 6000);
    } catch (err) {
      console.error('Error generating document image:', err);
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const handleWhatsAppShareDocument = async () => {
    try {
      setIsGeneratingDoc(true);
      setShareNotice('');

      const canvas = await generateDocumentCanvas();
      if (!canvas) {
        setIsGeneratingDoc(false);
        return;
      }

      const docTypeLabel = activeTab === 'rx' ? 'Digital Prescription' : 'Billing Invoice';
      const docName = activeTab === 'rx' ? 'Prescription' : 'Invoice';
      const cleanName = (patientName || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `PRS_Dental_${docName}_${cleanName}.png`;

      // 1. Convert canvas to Blob for Clipboard copy
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

      // 2. Download the high-res PNG image directly
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // 3. Copy image to Clipboard if supported for instant Ctrl+V pasting in WhatsApp
      try {
        if (navigator.clipboard && window.ClipboardItem && blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        }
      } catch (clipErr) {
        console.warn('Clipboard image copy fallback:', clipErr);
      }

      // 4. Clean phone number ensuring country code (default to 91 if 10-digit Indian number)
      let cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }

      // Direct WhatsApp URL to patient's exact phone number without any extra text message
      const waUrl = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}` : `https://api.whatsapp.com/send`;
      window.open(waUrl, '_blank');

      setShareNotice(`✓ Opening WhatsApp for ${patientName} (${phone || 'No phone'}). Press Ctrl+V to paste the document image.`);
      setTimeout(() => setShareNotice(''), 6000);
    } catch (err) {
      console.error('Error sharing document on WhatsApp:', err);
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  return (
    <div className="print-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="print-modal-content bg-surface rounded-2xl border border-outline-variant shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Header - Screen Only */}
        <div className="screen-only bg-primary text-on-primary p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-teal-200 font-semibold">Clinic Productivity Tool</span>
            <h3 className="text-lg sm:text-xl font-bold font-serif">PRS Dental Care - Rx & Invoice Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab & View Buttons - Screen Only */}
        <div className="screen-only flex flex-wrap items-center justify-between border-b border-outline-variant bg-surface-container-low px-2">
          <div className="flex border-b-2 border-transparent">
            <button
              onClick={() => setActiveTab('rx')}
              className={`py-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'rx'
                  ? 'border-primary text-primary bg-surface font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">description</span>
              <span>Digital Rx Prescription</span>
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`py-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'invoice'
                  ? 'border-primary text-primary bg-surface font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Patient Billing Invoice</span>
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-lg my-1">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'edit' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Edit Form
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'preview' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Document Preview
            </button>
          </div>
        </div>

        {/* Form Body - Screen Only in Edit Mode */}
        {viewMode === 'edit' && (
          <div className="screen-only p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-on-surface">
            {/* Patient & Metadata Controls Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container p-4 rounded-xl border border-outline-variant/60">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient Full Name"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Attending Specialist</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Invoice / Rx Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {activeTab === 'rx' ? (
              /* RX Prescription Builder */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant uppercase">Age / Gender</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="Age"
                        className="w-20 px-3 py-1.5 rounded-lg border border-outline bg-surface text-sm outline-none"
                      />
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-sm outline-none"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Child">Child</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase">Diagnosis / Clinical Finding</label>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">medication</span>
                      <span>Prescribed Medications (Rx)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="text-xs px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-semibold transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add Medicine</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Rx Column Subheadings Header */}
                    <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-1.5 bg-surface-container-high rounded-xl text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <div className="col-span-4">Medicine / Drug Name</div>
                      <div className="col-span-3">Dosage (M-A-N)</div>
                      <div className="col-span-2">Duration</div>
                      <div className="col-span-2">Remarks</div>
                      <div className="col-span-1 text-center">Remove</div>
                    </div>

                    {medications.map((med, idx) => (
                      <div key={idx} className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                        <div className="md:col-span-4">
                          <label className="block md:hidden text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">Medicine / Drug Name</label>
                          <input
                            type="text"
                            value={med.drug}
                            onChange={(e) => handleMedChange(idx, 'drug', e.target.value)}
                            placeholder="Drug Name (e.g. Tab. Amoxycillin)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs font-semibold"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block md:hidden text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                            placeholder="Dosage (e.g. 1-0-1)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block md:hidden text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                            placeholder="Duration (5 Days)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block md:hidden text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">Remarks</label>
                          <input
                            type="text"
                            value={med.notes}
                            onChange={(e) => handleMedChange(idx, 'notes', e.target.value)}
                            placeholder="Remarks"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs"
                          />
                        </div>
                        <div className="md:col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveMed(idx)}
                            className="text-red-500 hover:text-red-700 text-sm p-1"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant uppercase">Dental Advice / Instructions</label>
                    <textarea
                      rows={2}
                      value={clinicalAdvice}
                      onChange={(e) => setClinicalAdvice(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant uppercase">Next Visit / Follow-up</label>
                    <input
                      type="text"
                      value={nextVisitDate}
                      onChange={(e) => setNextVisitDate(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-outline bg-surface text-xs font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Billing Invoice Builder */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    <span>Itemized Dental Treatments & Fees</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddInvoiceItem}
                    className="text-xs px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add Treatment Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Column Subheadings Header */}
                  <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-1.5 bg-surface-container-high rounded-xl text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <div className="col-span-6">Treatment Description</div>
                    <div className="col-span-2 text-center">Quantity (Qty)</div>
                    <div className="col-span-3 text-right">Fee / Rate (₹)</div>
                    <div className="col-span-1 text-center">Remove</div>
                  </div>

                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      <div className="md:col-span-6">
                        <label className="block md:hidden text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">Treatment Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Treatment Description (e.g. Root Canal)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs font-semibold"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block md:hidden text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">Quantity (Qty)</label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          placeholder="Qty"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs text-center font-bold"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block md:hidden text-[10px] font-bold text-on-surface-variant uppercase mb-0.5">Fee / Rate (₹)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-on-surface-variant font-bold">₹</span>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                            placeholder="Rate (₹)"
                            className="w-full pl-6 pr-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs text-right font-bold text-emerald-700"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-500 hover:text-red-700 text-sm p-1"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Payment Controls & Total Calculation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="bg-surface-container p-4 rounded-xl border border-outline-variant space-y-3">
                    <h5 className="font-bold text-xs text-primary uppercase tracking-wider">Payment Metadata</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-on-surface-variant">Payment Status</label>
                        <select
                          value={paymentStatus}
                          onChange={(e) => setPaymentStatus(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs font-semibold outline-none"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Partial">Partial</option>
                          <option value="Due">Due</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-on-surface-variant">Payment Mode</label>
                        <select
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs font-semibold outline-none"
                        >
                          <option value="UPI / GPay">UPI / GPay</option>
                          <option value="Cash">Cash</option>
                          <option value="Credit / Debit Card">Credit / Debit Card</option>
                          <option value="Net Banking">Net Banking</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container p-4 rounded-xl border border-outline-variant space-y-2 text-sm">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Subtotal:</span>
                      <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Special Discount:</span>
                      <div className="flex items-center gap-1">
                        <span>₹</span>
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="w-20 px-2 py-0.5 rounded border border-outline bg-surface text-right font-medium text-xs"
                        />
                      </div>
                    </div>
                    <div className="border-t border-outline-variant pt-2 flex justify-between font-bold text-base text-primary">
                      <span>Grand Total Payable:</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Printable Document Area (Visible in Preview Mode & Always printed via @media print) */}
        <div className={`printable-document-wrapper p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 ${viewMode === 'edit' ? 'screen-only hidden' : ''}`}>
          <div ref={documentRef} className="printable-document bg-white text-slate-900 font-sans p-6 sm:p-8 border border-slate-300 rounded-xl shadow-md max-w-3xl mx-auto my-0">
            
            {/* Clinic Letterhead Header */}
            <div className="border-b-2 border-teal-700 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="PRS Dental Care Logo"
                  className="w-14 h-14 object-contain rounded-xl shadow-sm bg-white p-1 border border-slate-200"
                />
                <div>
                  <h1 className="text-2xl font-black font-serif text-teal-900 tracking-tight">PRS DENTAL CARE</h1>
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">Multi-Specialty Dental Clinic & Implant Center</p>
                  <p className="text-xs text-slate-600 mt-0.5">58/150, Red Hills Road, Kolathur, Chennai - 600099 (Near Everest Bus Stop)</p>
                </div>
              </div>
              <div className="text-left sm:text-right text-xs text-slate-700 leading-relaxed border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                <p className="font-bold text-slate-900">📞 +91 72007 18607 / +91 94443 65637</p>
                <p>✉️ prsdentalcare@gmail.com</p>
                <p>🌐 www.prsdentalcare.com</p>
                <div className="mt-2 inline-block px-2.5 py-0.5 bg-teal-100 text-teal-900 font-bold rounded border border-teal-300 uppercase text-[10px]">
                  {activeTab === 'rx' ? 'Digital Prescription' : 'Patient Billing Invoice'}
                </div>
              </div>
            </div>

            {/* Patient & Document Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mb-5">
              <div className="space-y-1">
                <p><span className="font-semibold text-slate-500">Patient Name:</span> <strong className="text-slate-900 text-sm">{patientName || 'N/A'}</strong></p>
                <p><span className="font-semibold text-slate-500">Phone Number:</span> <span className="text-slate-800 font-medium">{phone || 'N/A'}</span></p>
                {activeTab === 'rx' && (
                  <p><span className="font-semibold text-slate-500">Age / Gender:</span> <span className="text-slate-800">{patientAge} Yrs / {patientGender}</span></p>
                )}
              </div>
              <div className="space-y-1 sm:text-right">
                <p><span className="font-semibold text-slate-500">{activeTab === 'rx' ? 'Rx Serial No:' : 'Invoice Serial No:'}</span> <strong className="text-teal-900 font-mono">{activeTab === 'rx' ? rxNo : invoiceNo}</strong></p>
                <p><span className="font-semibold text-slate-500">Date:</span> <span className="text-slate-800">{invoiceDate}</span></p>
                <p><span className="font-semibold text-slate-500">Attending Specialist:</span> <strong className="text-slate-900">{doctorName}</strong></p>
              </div>
            </div>

            {activeTab === 'invoice' ? (
              /* Billing Invoice Table & Breakdown */
              <div>
                <table className="w-full text-left border-collapse text-xs mb-4">
                  <thead>
                    <tr className="bg-teal-800 text-white font-semibold">
                      <th className="p-2.5 rounded-tl-lg text-center w-10">#</th>
                      <th className="p-2.5">Particulars / Dental Treatment Description</th>
                      <th className="p-2.5 text-center w-14">Qty</th>
                      <th className="p-2.5 text-right w-24">Rate (₹)</th>
                      <th className="p-2.5 text-right rounded-tr-lg w-28">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 border-x border-b border-slate-200">
                    {invoiceItems.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-2.5 text-center font-medium text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{item.description || 'Dental Procedure'}</td>
                        <td className="p-2.5 text-center font-medium">{item.qty}</td>
                        <td className="p-2.5 text-right font-medium">₹{Number(item.rate || 0).toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">₹{(Number(item.qty || 1) * Number(item.rate || 0)).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Calculation Totals & Words */}
                <div className="flex flex-wrap justify-between items-start gap-4 text-xs mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 flex-1 min-w-[200px]">
                    <p><span className="font-semibold text-slate-500">Payment Status:</span> <span className={`ml-1 font-bold px-2 py-0.5 rounded uppercase text-[10px] ${paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{paymentStatus}</span></p>
                    <p><span className="font-semibold text-slate-500">Payment Mode:</span> <span className="font-medium text-slate-800">{paymentMode}</span></p>
                    <p className="pt-2 text-[11px] font-semibold text-slate-700 border-t border-slate-200 mt-2">
                      Amount in Words: <span className="font-bold text-slate-900 font-serif block sm:inline">{numberToWords(grandTotal)}</span>
                    </p>
                  </div>

                  <div className="w-full sm:w-60 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {Number(discount) > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount:</span>
                        <span>-₹{Number(discount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-300 pt-1.5 flex justify-between font-black text-sm text-teal-900">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Rx Digital Prescription Layout */
              <div>
                <div className="mb-3 text-xs bg-teal-50/70 p-2.5 rounded-lg border border-teal-200 flex items-center gap-2">
                  <span className="font-bold text-teal-900">Diagnosis / Clinical Finding:</span>
                  <span className="text-slate-800 font-semibold">{diagnosis || 'General Dental Examination'}</span>
                </div>

                <div className="flex items-center gap-2 my-2 text-teal-800 font-bold text-xl font-serif">
                  <span>℞</span>
                  <span className="text-xs uppercase font-sans text-slate-600 font-semibold tracking-wider">Prescribed Medications Schedule</span>
                </div>

                <table className="w-full text-left border-collapse text-xs mb-4">
                  <thead>
                    <tr className="bg-teal-800 text-white font-semibold">
                      <th className="p-2 text-center w-10">#</th>
                      <th className="p-2">Medicine / Drug Name</th>
                      <th className="p-2 text-center w-28">Dosage (M-A-N)</th>
                      <th className="p-2 text-center w-20">Duration</th>
                      <th className="p-2">Instructions / Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 border-x border-b border-slate-200">
                    {medications.map((med, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-2 text-center font-medium text-slate-500">{idx + 1}</td>
                        <td className="p-2 font-bold text-slate-900">{med.drug || '-'}</td>
                        <td className="p-2 text-center font-medium bg-teal-50/50 text-teal-900">{med.dosage || '-'}</td>
                        <td className="p-2 text-center font-medium">{med.duration || '-'}</td>
                        <td className="p-2 text-slate-700">{med.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-700 mb-1">General Dental Hygiene Advice:</p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{clinicalAdvice}</p>
                  </div>
                  <div className="bg-teal-50 p-2.5 rounded-lg border border-teal-200 sm:text-right">
                    <p className="font-bold text-teal-900 mb-0.5">Next Follow-up Visit:</p>
                    <p className="text-teal-950 font-bold text-sm">{nextVisitDate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Sign-off Footer */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs">
              <div className="text-slate-500 text-[10px] space-y-0.5">
                <p className="font-semibold text-slate-800">PRS Dental Care - Kolathur, Chennai</p>
                <p>This is a computer generated clinic document.</p>
                <p>Emergency Contact: +91 72007 18607</p>
              </div>
              <div className="text-center w-full sm:w-48">
                <div className="h-12 border-b border-slate-400 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-teal-900 font-bold text-sm opacity-90">{doctorName}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-800 uppercase mt-1">Authorized Specialist Sign & Seal</p>
              </div>
            </div>

          </div>
        </div>

        {shareNotice && (
          <div className="screen-only p-3 bg-emerald-500/10 border-t border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{shareNotice}</span>
          </div>
        )}

        {/* Footer Actions - Screen Only */}
        <div className="screen-only bg-surface-container-high p-4 border-t border-outline-variant flex flex-wrap gap-3 items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-outline rounded-xl text-xs font-semibold hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={handleDownloadDocumentImage}
              disabled={isGeneratingDoc}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-highest border border-outline rounded-xl text-xs font-bold text-on-surface transition-colors flex items-center gap-1.5 shadow-xs"
              title="Download exact document preview as PNG image"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{isGeneratingDoc ? 'Generating Image...' : 'Download Document (PNG)'}</span>
            </button>

            <button
              onClick={handleWhatsAppShareDocument}
              disabled={isGeneratingDoc}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
              title="Share exact visual document image on WhatsApp"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>{isGeneratingDoc ? 'Capturing Document Image...' : 'Share Exact Document via WhatsApp'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
