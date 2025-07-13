import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { computeAll, RiskInput } from '../utils/riskMath';
import { saveProfile } from '../services/profile';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  accountSize: z.number().min(1),
  totalTradeCount: z.number().min(0),
  winRate: z.number().min(0).max(100),
  avgRR: z.number().positive(),
});

export default function TraderProfileSetup() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RiskInput>({ resolver: zodResolver(schema), defaultValues: { accountSize: 0, totalTradeCount: 0, winRate: 50, avgRR: 1 } });

  const values = watch();
  const computed = computeAll({
    accountSize: Number(values.accountSize || 0),
    totalTradeCount: Number(values.totalTradeCount || 0),
    winRate: Number(values.winRate || 0),
    avgRR: Number(values.avgRR || 0),
  });

  const onSubmit = handleSubmit(async (data) => {
    const profile = { ...data, ...computeAll(data) };
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await saveProfile(uid, profile);
    navigate('/dashboard');
  });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-12 gap-4 px-4 py-8">
      <div className="col-span-12 lg:col-span-6 flex flex-col space-y-4">
        {step === 0 && (
          <div className="rounded-2xl shadow-md p-6 sm:p-8">
            <div className="mb-4">
              <label className="block mb-1">Account Size</label>
              <input type="number" {...register('accountSize', { valueAsNumber: true })} className="w-full" />
              {errors.accountSize && <p className="text-red-500 text-sm">{errors.accountSize.message}</p>}
            </div>
            <div>
              <label className="block mb-1">Total Trade Count</label>
              <input type="number" {...register('totalTradeCount', { valueAsNumber: true })} className="w-full" />
              {errors.totalTradeCount && <p className="text-red-500 text-sm">{errors.totalTradeCount.message}</p>}
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" className="h-12 rounded-2xl font-semibold bg-blue-600 text-white px-6" onClick={() => setStep(1)}>
                Next
              </button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="rounded-2xl shadow-md p-6 sm:p-8">
            <div className="mb-4">
              <label className="block mb-1">Win Rate %</label>
              <input type="number" {...register('winRate', { valueAsNumber: true })} className="w-full" />
              {errors.winRate && <p className="text-red-500 text-sm">{errors.winRate.message}</p>}
            </div>
            <div>
              <label className="block mb-1">Average RR</label>
              <input type="number" {...register('avgRR', { valueAsNumber: true })} className="w-full" />
              {errors.avgRR && <p className="text-red-500 text-sm">{errors.avgRR.message}</p>}
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" className="h-12 rounded-2xl font-semibold bg-gray-200 px-6" onClick={() => setStep(0)}>
                Back
              </button>
              <button type="submit" className="h-12 rounded-2xl font-semibold bg-blue-600 text-white px-6">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="col-span-12 lg:col-span-6">
        <div className="rounded-2xl shadow-md p-6 sm:p-8">
          <h2 className="font-semibold mb-4">Preview</h2>
          <p>Level: {computed.level}</p>
          <p>PRP: {computed.PRP.toFixed(2)}%</p>
          <p>EW: {computed.EW.toFixed(2)}</p>
          <p>EV: {computed.EV.toFixed(2)}</p>
          <p>AdjF: {computed.AdjF.toFixed(2)}</p>
          <p>RB Raw: {computed.RB_raw.toFixed(2)}</p>
          <p>Risk Bag: {computed.RB.toFixed(2)}</p>
        </div>
      </div>
    </form>
  );
}