import React from 'react'

const PaymentStepper = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {steps.map((step) => (
        <div key={step.id} className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step.id ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step.id}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{step.title}</p>
              <p className="text-sm text-slate-500">{step.description}</p>
            </div>
          </div>
          {step.id < steps.length && <div className="hidden md:block ml-5 mt-2 h-0.5 bg-slate-200" />}
        </div>
      ))}
    </div>
  )
}

export default PaymentStepper

