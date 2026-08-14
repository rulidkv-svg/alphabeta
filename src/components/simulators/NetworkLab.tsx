import React, { useState } from 'react';
import { Network, Server, Router, Globe, CheckCircle2, AlertCircle, Play, Terminal, RefreshCw } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'pc' | 'switch' | 'router' | 'internet';
  ip: string;
  netmask: string;
  gateway: string;
  connectedTo: string[];
}

export const NetworkLab: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: 'pc1', name: 'PC Client 1 (Laboratorium)', type: 'pc', ip: '192.168.1.10', netmask: '255.255.255.0', gateway: '192.168.1.1', connectedTo: ['switch1'] },
    { id: 'pc2', name: 'PC Client 2 (Siswa)', type: 'pc', ip: '192.168.1.20', netmask: '255.255.255.0', gateway: '192.168.1.1', connectedTo: ['switch1'] },
    { id: 'switch1', name: 'Switch Utama (24-Port)', type: 'switch', ip: '192.168.1.2', netmask: '255.255.255.0', gateway: '', connectedTo: ['pc1', 'pc2', 'router1'] },
    { id: 'router1', name: 'Router Gateway Mikrotik', type: 'router', ip: '192.168.1.1', netmask: '255.255.255.0', gateway: '202.152.0.1', connectedTo: ['switch1', 'internet'] },
    { id: 'internet', name: 'Internet Cloud (WAN)', type: 'internet', ip: '8.8.8.8', netmask: '0.0.0.0', gateway: '', connectedTo: ['router1'] }
  ]);

  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(nodes[0]);
  const [targetIP, setTargetIP] = useState('8.8.8.8');
  const [pingLogs, setPingLogs] = useState<string[]>([
    'Terminal Virtual Network Lab Alpha Beta v2.0',
    'Ketik atau pilih IP tujuan dan klik [Jalankan Tes Ping].'
  ]);
  const [isRunningPing, setIsRunningPing] = useState(false);

  const handleUpdateNodeIP = (id: string, newIp: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ip: newIp } : n));
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode(prev => prev ? { ...prev, ip: newIp } : null);
    }
  };

  const handleRunPing = () => {
    if (!selectedNode || isRunningPing) return;
    setIsRunningPing(true);

    const logHeader = `PING ${targetIP} from ${selectedNode.name} (${selectedNode.ip}): 56 data bytes`;
    setPingLogs(prev => [...prev, '----------------------------------------', logHeader]);

    setTimeout(() => {
      // Check if target exists in topology or simulated WAN
      const targetNode = nodes.find(n => n.ip === targetIP);

      if (targetIP === '8.8.8.8' || targetNode) {
        setPingLogs(prev => [
          ...prev,
          `64 bytes from ${targetIP}: icmp_seq=1 ttl=64 time=1.24 ms`,
          `64 bytes from ${targetIP}: icmp_seq=2 ttl=64 time=1.08 ms`,
          `64 bytes from ${targetIP}: icmp_seq=3 ttl=64 time=1.15 ms`,
          `--- ${targetIP} ping statistics ---`,
          `3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
          `✅ CONNECTION SUCCESSFUL: Route established via Gateway ${selectedNode.gateway}`
        ]);
      } else {
        setPingLogs(prev => [
          ...prev,
          `Request timeout for icmp_seq 1`,
          `Request timeout for icmp_seq 2`,
          `--- ${targetIP} ping statistics ---`,
          `2 packets transmitted, 0 received, 100% packet loss`,
          `❌ HOST UNREACHABLE: Periksa IP Address, Subnet Mask, atau Default Gateway!`
        ]);
      }
      setIsRunningPing(false);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Virtual Lab
            </span>
            <h3 className="text-lg font-bold text-white">Virtual Network Lab & Topology Simulator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulasi jaringan lokal (LAN), router gateway, subnetting, dan pengujian koneksi Ping ICMP.
          </p>
        </div>
      </div>

      {/* Topology Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-950 p-4 rounded-3xl border border-slate-800">
        {nodes.map(node => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50 scale-102'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 mb-2 text-blue-400">
                {node.type === 'pc' && <Server className="w-6 h-6 text-emerald-400" />}
                {node.type === 'switch' && <Network className="w-6 h-6 text-amber-400" />}
                {node.type === 'router' && <Router className="w-6 h-6 text-blue-400" />}
                {node.type === 'internet' && <Globe className="w-6 h-6 text-purple-400" />}
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">{node.name}</p>
              <p className="text-[10px] font-mono text-blue-300 mt-1">{node.ip}</p>
            </div>
          );
        })}
      </div>

      {/* Config & Ping Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Config Panel */}
        {selectedNode && (
          <div className="lg:col-span-5 bg-slate-800/80 p-4 rounded-3xl border border-slate-700 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-400" />
              <span>Konfigurasi IP: {selectedNode.name}</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">IP Address (IPv4)</label>
                <input
                  type="text"
                  value={selectedNode.ip}
                  onChange={e => handleUpdateNodeIP(selectedNode.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subnet Mask</label>
                <input
                  type="text"
                  value={selectedNode.netmask}
                  readOnly
                  className="w-full bg-slate-900/60 border border-slate-800 text-slate-400 p-2.5 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Default Gateway</label>
                <input
                  type="text"
                  value={selectedNode.gateway || '0.0.0.0'}
                  readOnly
                  className="w-full bg-slate-900/60 border border-slate-800 text-slate-400 p-2.5 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="text-slate-400 block mb-1">Target Ping IP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetIP}
                    onChange={e => setTargetIP(e.target.value)}
                    placeholder="Contoh: 8.8.8.8"
                    className="flex-1 bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleRunPing}
                    disabled={isRunningPing}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Ping</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terminal Logs */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-3xl border border-slate-800 font-mono text-xs flex flex-col justify-between min-h-[260px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Simulated Ping Console Terminal</span>
              </span>
              <button
                onClick={() => setPingLogs([])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-1 max-h-[180px] overflow-y-auto text-emerald-400/90 text-[11px] leading-relaxed">
              {pingLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
