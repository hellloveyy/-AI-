import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, MOCK_SETTLEMENTS } from '../constants';
import { SettlementRecord } from '../types';
import { Wallet, TrendingUp, Download, Receipt, AlertCircle, ChevronRight, ArrowLeft, CheckCircle, Clock, History, Box, Zap, Users, Megaphone, ClipboardList, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend as RechartsLegend } from 'recharts';

const data = [
  { name: '10-01', value: 4000 },
  { name: '10-05', value: 3000 },
  { name: '10-10', value: 5000 },
  { name: '10-15', value: 2780 },
  { name: '10-20', value: 1890 },
  { name: '10-24', value: 2390 },
  { name: '10-25', value: 3490 },
];

const APP_CONSUMPTION_STATS = [
    { id: '1', name: 'AI面部智能诊断', monthAmount: 1245.50, totalAmount: 45680.00, trend: '+12%', color: 'bg-blue-500' },
    { id: '2', name: '美沃斯SCRM助手', monthAmount: 890.00, totalAmount: 28450.00, trend: '+5%', color: 'bg-purple-500' },
    { id: '3', name: '3D身形模拟器', monthAmount: 560.00, totalAmount: 14200.00, trend: '-2%', color: 'bg-orange-500' },
    { id: '4', name: '小红书爆文生成器', monthAmount: 350.00, totalAmount: 5200.00, trend: '+20%', color: 'bg-emerald-500' },
    { id: '5', name: '治疗记录AI助理', monthAmount: 200.00, totalAmount: 2980.00, trend: '+8%', color: 'bg-slate-500' },
];

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#64748b'];

type FinanceView = 'DASHBOARD' | 'SETTLEMENT_LIST' | 'SETTLEMENT_DETAIL' | 'RECHARGE_LIST';

export const FinancialBilling: React.FC = () => {
  const [view, setView] = useState<FinanceView>('DASHBOARD');
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRecord | null>(null);

  const handleOpenDetail = (record: SettlementRecord) => {
      setSelectedSettlement(record);
      setView('SETTLEMENT_DETAIL');
  };

  const handleBack = () => {
      if (view === 'SETTLEMENT_DETAIL') {
          setView('SETTLEMENT_LIST');
          setSelectedSettlement(null);
      } else {
          setView('DASHBOARD');
      }
  };

  if (view === 'SETTLEMENT_LIST') {
      return (
          <SettlementList 
            onBack={handleBack} 
            onSelect={handleOpenDetail} 
          />
      );
  }

  if (view === 'SETTLEMENT_DETAIL' && selectedSettlement) {
      return (
          <SettlementDetail 
            record={selectedSettlement} 
            onBack={handleBack} 
          />
      );
  }

  if (view === 'RECHARGE_LIST') {
      return (
          <RechargeList onBack={handleBack} />
      );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">财务与账单中心</h2>
        <div className="flex gap-3">
            <button 
                onClick={() => setView('SETTLEMENT_LIST')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
                <Receipt className="w-4 h-4" />
                月度账单记录
            </button>
            <button 
                onClick={() => setView('RECHARGE_LIST')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
                <History className="w-4 h-4" />
                充值记录
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-200">
                充值账户
            </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg shadow-primary-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4 opacity-90 relative z-10">
            <Wallet className="w-5 h-5" />
            <span className="font-medium text-sm">账户余额</span>
          </div>
          <div className="text-4xl font-bold mb-2 relative z-10">¥ 12,450.00</div>
          <div className="text-primary-100 text-xs flex gap-4 relative z-10">
             <span className="bg-white/20 px-2 py-0.5 rounded">预付费模式</span>
             <span className="bg-white/20 px-2 py-0.5 rounded">自动扣费中</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
           <div className="flex justify-between items-start mb-4">
             <div>
                <div className="text-slate-500 text-sm mb-1">本月消耗 (实时)</div>
                <div className="text-3xl font-bold text-slate-800">¥ 3,245.50</div>
             </div>
             <div className="bg-red-50 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-red-500" />
             </div>
           </div>
           <p className="text-xs text-slate-400">较上月同期增长 +12.5%</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">AI用量消费趋势</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                cursor={{stroke: '#e2e8f0'}}
              />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* App Consumption Summary (Replaces Recent Transactions) */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">各应用消耗汇总</h3>
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4">应用名称</th>
                        <th className="px-6 py-4">本月消耗</th>
                        <th className="px-6 py-4">历史总消耗</th>
                        <th className="px-6 py-4 text-right">环比趋势</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {APP_CONSUMPTION_STATS.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${app.color}`}></span>
                                {app.name}
                            </td>
                            <td className="px-6 py-4 text-slate-800 font-bold">
                                ¥ {app.monthAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                                ¥ {app.totalAmount.toFixed(2)}
                            </td>
                            <td className={`px-6 py-4 text-right font-medium ${
                                app.trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'
                            }`}>
                                {app.trend}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const SettlementList: React.FC<{ onBack: () => void, onSelect: (record: SettlementRecord) => void }> = ({ onBack, onSelect }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">月度账单记录</h2>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">结算月份</th>
                            <th className="px-6 py-4">消费总金额</th>
                            <th className="px-6 py-4">账单日期</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_SETTLEMENTS.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onSelect(item)}>
                                <td className="px-6 py-4 font-medium text-slate-800">{item.month}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">¥ {item.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-slate-500">{item.dueDate}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary-600 hover:text-primary-700 font-medium text-xs flex items-center justify-end gap-1 w-full">
                                        查看详情 <ChevronRight className="w-3 h-3" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SettlementDetail: React.FC<{ record: SettlementRecord, onBack: () => void }> = ({ record, onBack }) => {
    // Generate Mock Pie Data based on APP_CONSUMPTION_STATS logic but scaled to current record amount
    const pieData = APP_CONSUMPTION_STATS.map(app => ({
        name: app.name,
        value: (app.monthAmount / 3245.50) * record.totalAmount // Scale roughly to the record total
    })).sort((a, b) => b.value - a.value);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{record.month} 账单详情</h2>
                        <div className="text-xs text-slate-500 mt-1">账单ID: {record.id}</div>
                    </div>
                </div>
            </div>

            {/* Summary Card - Removed Status */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-2">
                    <Receipt className="w-5 h-5 text-primary-500" />
                    <span className="text-slate-500 font-medium">本月消耗总额</span>
                 </div>
                 <div className="text-4xl font-bold text-slate-900">¥ {record.totalAmount.toFixed(2)}</div>
                 <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    费用已实时扣除
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* App Consumption Breakdown Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">本月应用消耗分布</h3>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centered Total Text */}
                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-xs text-slate-400">总计</div>
                            <div className="text-sm font-bold text-slate-800">¥{record.totalAmount.toFixed(0)}</div>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                                    <span className="text-slate-600 truncate max-w-[120px]">{entry.name}</span>
                                </div>
                                <span className="font-medium text-slate-800">¥{entry.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">本月消耗明细</h3>
                    <TransactionTable />
                </div>
            </div>
        </div>
    );
};

const RechargeList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Filter only recharge type transactions
    const recharges = MOCK_TRANSACTIONS.filter(t => t.type === 'recharge');

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">充值记录</h2>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">充值时间</th>
                            <th className="px-6 py-4">操作员</th>
                            <th className="px-6 py-4">充值金额</th>
                            <th className="px-6 py-4 text-right">状态</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {recharges.length > 0 ? recharges.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-600">{t.date}</td>
                                <td className="px-6 py-4 text-slate-800 font-medium">{t.user}</td>
                                <td className="px-6 py-4 text-emerald-600 font-bold">+{t.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                        <CheckCircle className="w-3 h-3" />
                                        成功
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                    暂无充值记录
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const TransactionTable: React.FC<{ limit?: number }> = ({ limit }) => {
    const displayData = limit ? MOCK_TRANSACTIONS.slice(0, limit) : MOCK_TRANSACTIONS;
    
    return (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm h-full">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4">时间</th>
                        <th className="px-6 py-4">关联应用</th>
                        <th className="px-6 py-4">操作员</th>
                        <th className="px-6 py-4">类型</th>
                        <th className="px-6 py-4 text-right">金额</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {displayData.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-slate-600">{t.date}</td>
                            <td className="px-6 py-4 text-slate-800 font-medium">{t.appName}</td>
                            <td className="px-6 py-4 text-slate-600">{t.user}</td>
                            <td className="px-6 py-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    t.type === 'recharge' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {t.type === 'recharge' ? '账户充值' : '服务扣费'}
                                </span>
                            </td>
                            <td className={`px-6 py-4 text-right font-medium ${
                                t.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                            }`}>
                                {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
