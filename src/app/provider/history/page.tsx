"use client";

import { Star } from "lucide-react";
import { useProviderFlow } from "@/lib/provider-flow-context";
import { generateJobHistory } from "@/lib/mock/opportunities";

export default function JobHistoryPage() {
  const { provider } = useProviderFlow();
  const jobs = generateJobHistory(provider);

  return (
    <div>
      <h1 className="font-display text-[24px] font-bold text-ink">Job history</h1>
      <p className="mt-1.5 text-[13.5px] text-ink-muted">
        This is the platform evidence GigMatch builds up as you complete jobs.
      </p>

      {jobs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-[14.5px] text-ink-muted">
            No completed jobs yet. Once you accept and complete an opportunity, it will show up here — and
            count toward your GigMatch track record.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[480px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left text-[11.5px] uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-2.5 font-semibold">Service</th>
                <th className="px-4 py-2.5 font-semibold">Date</th>
                <th className="px-4 py-2.5 font-semibold">Rating</th>
                <th className="px-4 py-2.5 font-semibold">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{j.service}</td>
                  <td className="px-4 py-3 text-ink-muted">{j.date}</td>
                  <td className="px-4 py-3">
                    {j.rating ? (
                      <span className="inline-flex items-center gap-1 text-ink">
                        <Star size={12} className="fill-gold text-gold" />
                        {j.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{j.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
