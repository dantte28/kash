'use client'

import React from 'react'

type Props = {
  label: string
  value: string
  sub?: string
  subPositive?: boolean
  subNegative?: boolean
  icon?: React.ReactNode
}

export default function MetricCard({ label, value, sub, subPositive, subNegative, icon }: Props) {
  let subColor = 'text-gray-400'
  if (subPositive) subColor = 'text-[#085041]'
  if (subNegative) subColor = 'text-[#791F1F]'

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-2" style={{ borderWidth: '0.5px' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-gray-300">{icon}</span>}
      </div>
      <span className="text-[22px] font-medium text-gray-900 leading-none">{value}</span>
      {sub && <span className={`text-[12px] ${subColor}`}>{sub}</span>}
    </div>
  )
}
