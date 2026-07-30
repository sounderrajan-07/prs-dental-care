import React, { useState } from 'react';

export default function InvoiceRxGeneratorModal({ isOpen, onClose, initialData = null }) {
  const [activeTab, setActiveTab] = useState('rx'); // 'rx' or 'invoice'

  // Rx State
  const [patientName, setPatientName] = useState(initialData?.name || initialData?.patientName || '');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Female');
  const [phone, setPhone] = useState(initialData?.phone || initialData?.patientPhone || '');
  const [doctorName, setDoctorName] = useState(initialData?.preferredDoctor || initialData?.attendingDoctor || 'Dr. P. R. Sundharam');
  const [diagnosis, setDiagnosis] = useState(initialData?.service || initialData?.treatmentName || 'Acute Irreversible Pulpitis');
  
  const [medications, setMedications] = useState([
    { drug: 'Tab. Amoxycillin 500mg', dosage: '1-0-1 (After Food)', duration: '5 Days', notes: 'Antibiotic - complete course' },
    { drug: 'Tab. Zerodol-SP (Aceclofenac + Serratiopeptidase)', dosage: '1-0-1 (After Food)', duration: '3 Days', notes: 'Pain killer & Anti-inflammatory' },
    { drug: 'Tab. Pan-40 (Pantoprazole 40mg)', dosage: '1-0-0 (Before Food)', duration: '5 Days', notes: 'Antacid' },
    { drug: 'Hexidine Mouthwash 0.2%', dosage: '10ml Swish & Spit', duration: '7 Days', notes: 'Twice daily after brushing' }
  ]);

  // Invoice State
  const [invoiceItems, setInvoiceItems] = useState([
    { description: initialData?.service || initialData?.treatmentName || 'Root Canal Treatment', qty: 1, rate: 4500 },
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

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let text = `*PRS DENTAL CARE - ${activeTab === 'rx' ? 'DIGITAL PRESCRIPTION' : 'BILLING INVOICE'}*\n\n`;
    text += `*Patient:* ${patientName}\n`;
    text += `*Doctor:* ${doctorName}\n`;

    if (activeTab === 'rx') {
      text += `*Diagnosis:* ${diagnosis}\n\n`;
      text += `*Prescribed Medications:*\n`;
      medications.forEach((m, idx) => {
        if (m.drug) text += `${idx + 1}. ${m.drug} - ${m.dosage} (${m.duration})\n`;
      });
      text += `\n*Note:* Take medicines as advised. For emergencies call +91 72007 18607.`;
    } else {
      text += `\n*Itemized Bill Summary:*\n`;
      invoiceItems.forEach((item) => {
        text += `- ${item.description}: ₹${item.qty * item.rate}\n`;
      });
      if (discount > 0) text += `Discount Applied: -₹${discount}\n`;
      text += `*Total Amount Payable:* ₹${grandTotal.toLocaleString('en-IN')}\n\n`;
      text += `Thank you for choosing PRS Dental Care, Kolathur, Chennai!`;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl border border-outline-variant shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-primary text-on-primary p-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-teal-200 font-semibold">Clinic Productivity Tool</span>
            <h3 className="text-xl font-bold font-serif">PRS Dental Care - Rx & Invoice Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-outline-variant bg-surface-container-low">
          <button
            onClick={() => setActiveTab('rx')}
            className={`flex-1 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'rx'
                ? 'border-primary text-primary bg-surface font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            📋 Digital Rx Prescription
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`flex-1 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'invoice'
                ? 'border-primary text-primary bg-surface font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            🧾 Patient Billing Invoice
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-on-surface">
          {/* Common Patient Info Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container p-4 rounded-xl border border-outline-variant/60">
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
                  <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                    <span>💊 Prescribed Medications (Rx)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="text-xs px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-semibold transition-colors"
                  >
                    + Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {medications.map((med, idx) => (
                    <div key={idx} className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          value={med.drug}
                          onChange={(e) => handleMedChange(idx, 'drug', e.target.value)}
                          placeholder="Drug Name (e.g. Tab. Amoxycillin)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs font-semibold"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                          placeholder="Dosage (e.g. 1-0-1)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                          placeholder="Duration (5 Days)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
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
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Billing Invoice Builder */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                  <span>🧾 Itemized Dental Treatments & Fees</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddInvoiceItem}
                  className="text-xs px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-semibold transition-colors"
                >
                  + Add Treatment Item
                </button>
              </div>

              <div className="space-y-3">
                {invoiceItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Treatment Description (e.g. Root Canal)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        placeholder="Qty"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                        placeholder="Rate (₹)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline bg-surface text-xs"
                      />
                    </div>
                    <div className="md:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 text-sm p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant space-y-2 max-w-sm ml-auto text-sm">
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
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-surface-container-high p-4 border-t border-outline-variant flex flex-wrap gap-3 items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-outline rounded-xl text-xs font-semibold hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>💬 Share via WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span>🖨️ Print / Save PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
