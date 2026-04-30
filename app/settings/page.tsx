import { AppShell } from '@/components/layout/AppShell';
import { CheckCircle, ExternalLink, ToggleLeft, AlertTriangle } from 'lucide-react';

const integrations = [
  {
    name: 'Gong',
    description: 'Call recordings, transcripts, and AI summaries',
    status: 'Connected',
    lastSync: '4 minutes ago',
    icon: '🎙',
  },
  {
    name: 'HubSpot',
    description: 'CRM notes, contacts, and email summaries',
    status: 'Connected',
    lastSync: '4 minutes ago',
    icon: '🔶',
  },
  {
    name: 'Copilot',
    description: 'Platform activity, subscriptions, and engagement data',
    status: 'Connected',
    lastSync: '4 minutes ago',
    icon: '🔷',
  },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-[#0A0A0A] tracking-tight mb-8">Settings</h1>

        {/* Profile */}
        <section className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-6">
          <h2 className="text-sm font-semibold text-[#0A0A0A] mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#6A2B7E' }}>
              PW
            </div>
            <div>
              <p className="font-medium text-[#0A0A0A]">Phoebe Willoughby</p>
              <p className="text-sm text-[#6B6B6B]">pwilloughby@iconnections.io</p>
              <p className="text-xs text-[#B89BC4] mt-0.5">Senior CSM</p>
            </div>
          </div>
          <button className="text-sm text-[#6A2B7E] hover:underline">Edit profile</button>
        </section>

        {/* Integrations */}
        <section className="bg-white rounded-2xl border border-[#E5E5E5] mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E5E5]">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Integrations</h2>
          </div>
          {integrations.map((int, i) => (
            <div key={int.name} className={`px-6 py-4 flex items-center gap-4 ${i < integrations.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-[#F5F0F7] flex items-center justify-center text-lg flex-shrink-0">
                {int.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#0A0A0A]">{int.name}</p>
                  <span className="flex items-center gap-1 text-xs text-[#4A7C59] font-medium">
                    <CheckCircle size={12} />
                    {int.status}
                  </span>
                </div>
                <p className="text-xs text-[#6B6B6B]">{int.description}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">Last sync: {int.lastSync}</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-[#6A2B7E] hover:underline flex-shrink-0">
                Manage
                <ExternalLink size={11} />
              </button>
            </div>
          ))}
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl border border-[#E5E5E5] mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E5E5]">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Notifications</h2>
          </div>
          {[
            { label: 'Daily brief digest', sub: 'Morning summary of upcoming meetings' },
            { label: 'Renewal alerts',     sub: 'Notify 60 days before renewal date' },
            { label: 'Health score changes', sub: 'Alert when a client moves to At Risk' },
          ].map((item, i, arr) => (
            <div key={item.label} className={`px-6 py-3 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}>
              <div>
                <p className="text-sm font-medium text-[#0A0A0A]">{item.label}</p>
                <p className="text-xs text-[#6B6B6B]">{item.sub}</p>
              </div>
              <ToggleLeft size={22} className="text-[#6A2B7E]" />
            </div>
          ))}
        </section>

        {/* Danger zone */}
        <section className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E5E5]">
            <h2 className="text-sm font-semibold text-[#B5564E]">Danger Zone</h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-[#B5564E] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#0A0A0A]">Disconnect all integrations</p>
                <p className="text-xs text-[#6B6B6B]">This will remove all synced data. Decorative only.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg border border-[#B5564E] text-[#B5564E] text-sm font-medium hover:bg-[#FFF0EF] transition-colors">
              Disconnect all
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
