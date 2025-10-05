'use client';
import ProfileManager from '@/components/ProfileManager';
import { ConnectButton } from '@mysten/dapp-kit';

export default function Home() {
  return (
    <main className="min-h-screen relative p-4 md:p-10">
      {/* Decorative Grid */}
      <div className="cyber-grid" />

      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center">
            <span className="text-black font-bold -rotate-45 text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter orbitron hidden sm:block">
            SUI<span className="text-cyan-500">BIO</span>
          </h1>
        </div>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        <ProfileManager />
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-gray-500 text-xs uppercase tracking-widest orbitron opacity-50">
        Connected to Sui Neural Network // v0.1.0
      </footer>
    </main>
  );
}
