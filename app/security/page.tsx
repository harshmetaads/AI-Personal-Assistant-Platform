import AppShell from '@/components/app-shell';
import { SecureAuthPanel } from '@/components/secure-auth-panel';

export default function SecurityPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '30px 18px 50px' }}>
        <SecureAuthPanel />
      </div>
    </AppShell>
  );
}
