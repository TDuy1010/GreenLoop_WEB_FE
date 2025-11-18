import React from 'react'

const PaymentMethodList = ({ methods, selectedMethod, onSelect }) => {
  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`flex gap-4 items-start rounded-2xl border p-4 cursor-pointer transition ${
            selectedMethod === method.id ? 'border-emerald-500 bg-emerald-50/70' : 'border-slate-200 bg-white hover:border-emerald-200'
          }`}
        >
          <input
            type="radio"
            name="payment"
            className="mt-1"
            value={method.id}
            checked={selectedMethod === method.id}
            onChange={() => onSelect(method.id)}
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900">{method.title}</p>
              {method.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-600">
                  {method.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600">{method.description}</p>
          </div>
        </label>
      ))}
    </div>
  )
}

export default PaymentMethodList

