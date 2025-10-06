'use client';

import { 
  useCurrentAccount, 
  useSuiClient, 
  useSignAndExecuteTransaction, 
  ConnectButton 
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useEffect, useState } from 'react';
import { LucideExternalLink, LucidePlus, LucideEdit, LucideUser, LucideDollarSign, LucideSave, LucideX } from 'lucide-react';

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID;

type ProfileData = {
  id: string;
  name: string;
  bio: string;
  links: string[];
  owner: string;
};

export default function ProfileManager() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<string[]>(['']);

  const fetchProfile = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const { data } = await client.getOwnedObjects({
        owner: account.address,
        filter: { StructType: `${PACKAGE_ID}::suibio::Profile` },
        options: { showContent: true }
      });

      if (data && data.length > 0) {
        const obj = data[0].data?.content as any;
        if (obj && obj.fields) {
          setProfile({
            id: obj.fields.id.id,
            name: obj.fields.name,
            bio: obj.fields.bio,
            links: obj.fields.links,
            owner: obj.fields.owner
          });
          setName(obj.fields.name);
          setBio(obj.fields.bio);
          setLinks(obj.fields.links);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [account]);

  const handleMint = async () => {
    if (!account) return;
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::suibio::create_profile`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(bio),
        tx.pure.vector('string', links.filter(l => l.trim() !== '')),
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          setTimeout(fetchProfile, 2000); // Wait for indexing
          setIsMinting(false);
        },
        onError: (err) => console.error('Mint failed:', err),
      }
    );
  };

  const handleUpdate = async () => {
    if (!account || !profile) return;
    const tx = new Transaction();
    
    // Update Bio if changed
    tx.moveCall({
      target: `${PACKAGE_ID}::suibio::update_bio`,
      arguments: [
        tx.object(profile.id),
        tx.pure.string(bio),
      ],
    });

    // Update Links
    tx.moveCall({
      target: `${PACKAGE_ID}::suibio::update_links`,
      arguments: [
        tx.object(profile.id),
        tx.pure.vector('string', links.filter(l => l.trim() !== '')),
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          setTimeout(fetchProfile, 2000);
          setIsEditing(false);
        },
        onError: (err) => console.error('Update failed:', err),
      }
    );
  };

  const handleTip = async () => {
    if (!account || !profile) return;
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [1_000_000_000]); // 1 SUI (MIST)
    tx.transferObjects([coin], profile.owner);

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => alert('Tip sent! Thank you!'),
        onError: (err) => console.error('Tip failed:', err),
      }
    );
  };

  const addLinkInput = () => setLinks([...links, '']);
  const updateLinkInput = (index: number, val: string) => {
    const newLinks = [...links];
    newLinks[index] = val;
    setLinks(newLinks);
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl glow-text mb-8 text-center">Protocol: SUI-BIO</h1>
        <p className="text-gray-400 mb-8 max-w-md text-center">Initialize your decentralized neural identity. Connect your wallet to begin.</p>
        <ConnectButton />
      </div>
    );
  }

  if (loading) return <div className="text-center py-20 orbitron animate-pulse">Scanning On-Chain Data...</div>;

  // View Mode
  if (profile && !isEditing) {
    return (
      <div className="max-w-2xl mx-auto py-10 scale-in">
        <div className="glass-card text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          
          <div className="mb-6 relative inline-block">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-500 p-1 mx-auto">
              <div className="w-full h-full rounded-full bg-cyan-900 flex items-center justify-center">
                <LucideUser size={48} className="text-cyan-400" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl mb-2 glow-text">{profile.name}</h2>
          <p className="text-cyan-200/70 mb-8 italic">"{profile.bio}"</p>

          <div className="flex flex-col gap-2 mb-10">
            {profile.links.map((link, i) => {
              const url = link.startsWith('http') ? link : `https://${link}`;
              let title = link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
              
              return (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-card link-stagger"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center">
                    <div className="link-icon-box">
                      <LucideExternalLink size={20} />
                    </div>
                    <div className="link-card-content text-left">
                      <span className="link-title">{title}</span>
                      <span className="link-url">{url}</span>
                    </div>
                  </div>
                  <LucideExternalLink size={16} className="text-white/20" />
                </a>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => setIsEditing(true)} className="neo-button flex items-center gap-2">
              <LucideEdit size={16} /> Edit Profile
            </button>
            <button onClick={handleTip} className="neo-button flex items-center gap-2 !border-pink-500 !text-pink-500 hover:!bg-pink-500">
              <LucideDollarSign size={16} /> Tip 1 SUI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mint / Edit Form
  return (
    <div className="max-w-2xl mx-auto py-10 fade-in">
      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl glow-text">{isEditing ? 'Neural Update' : 'Initialize Identity'}</h2>
          {isEditing && (
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors">
              <LucideX size={24} />
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-cyan-500 mb-2">Display Name</label>
            <input 
              disabled={isEditing}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Satoshi" 
              className="neo-input disabled:opacity-50" 
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-cyan-500 mb-2">Neural Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Tell the grid about yourself..." 
              className="neo-input min-h-[100px]" 
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-cyan-500 mb-2">Hyperlinks</label>
            <div className="space-y-3">
              {links.map((link, i) => (
                <input 
                  key={i}
                  value={link} 
                  onChange={(e) => updateLinkInput(i, e.target.value)} 
                  placeholder="https://..." 
                  className="neo-input" 
                />
              ))}
              <button onClick={addLinkInput} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 mt-2">
                <LucidePlus size={16} /> Add Link
              </button>
            </div>
          </div>

          <button 
            onClick={isEditing ? handleUpdate : handleMint} 
            className="neo-button w-full flex items-center justify-center gap-2 !bg-cyan-500 !text-black font-bold mt-4"
          >
            {isEditing ? <LucideSave size={20} /> : <LucidePlus size={20} />}
            {isEditing ? 'Save Changes' : 'Mint Identity'}
          </button>
        </div>
      </div>
    </div>
  );
}
