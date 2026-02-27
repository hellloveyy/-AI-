
import React, { useState } from 'react';
import { MOCK_TASKS, MOCK_APPS, MOCK_ROLES, MOCK_SUBSCRIPTION_REQUESTS, MOCK_USERS, MOCK_USAGE_RECORDS } from '../constants';
import { AIApp, User, RoleType, SubscriptionRequest, AppUsageRecord } from '../types';
import { Activity, Zap, TrendingUp, CheckCircle, XCircle, ArrowRight, Star, Box, ShieldCheck, Timer, Layers, BarChart3, Users, Filter, Search, Clock, FileText, Check, X, AlertCircle, ChevronLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';

interface WorkbenchProps {
    onLaunchApp: (app: AIApp) => void;
    user: User;
}

// --- Shared Components ---

const AppGrid: React.FC<{ apps: AIApp[], onClick: (app: AIApp) => void, title?: string }> = ({ apps, onClick, title }) => (
    <div>
        {title && (
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 px-1">
                <Box className="w-5 h-5 text-primary-500" />
                {title}
            </h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apps.map(app => (
                <div 
                    key={app.id} 
                    onClick={() => onClick(app)}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className={`absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform ${
                        app.icon === 'scan-face' ? 'text-blue-500' : 'text-purple-500'
                    }`}>
                        {app.icon === 'scan-face' ? <Zap className="w-24 h-24" /> : <Box className="w-24 h-24" />}
                    </div>

                    <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors shadow-sm ${
                            app.icon === 'scan-face' ? 'bg-blue-50 text-blue-600' : 
                            app.icon === 'users' ? 'bg-purple-50 text-purple-600' :
                            'bg-slate-50 text-slate-600'
                        }`}>
                             {app.icon === 'scan-face' ? <Zap className="h-6 w-6" /> : 
                              app.icon === 'users' ? <ShieldCheck className="h-6 w-6" /> : 
                              <Box className="h-6 w-6" />}
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">{app.name}</h4>
                        <div className="flex items-center gap-2 mb-3">
                             <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                 app.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                             }`}>
                                 {app.status === 'active' ? '已订阅' : '试用中'}
                             </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mb-4 h-4">{app.description}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" /> {app.rating}
                            </div>
                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary-300 hover:bg-primary-50/30 hover:text-primary-600 transition-all cursor-pointer min-h-[180px]">
                <div className="p-3 bg-slate-50 rounded-full mb-2 group-hover:bg-white transition-colors">
                        <Box className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">前往应用市场</span>
            </div>
        </div>
    </div>
);

// --- Role-Specific Components ---

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
    const [requests, setRequests] = useState(MOCK_SUBSCRIPTION_REQUESTS);

    const handleApprove = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
        alert('已批准订阅申请，权限将自动下发。');
    };

    const handleReject = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    };

    const pendingRequests = requests.filter(r => r.status === 'PENDING');

    // Mock Summary Data with Weekly Consumption
    const appSummaryData = [
        { id: 'app-1', name: 'AI面部智能诊断', usageCount: 1240, consumption: 45680.00, weeklyConsumption: 5200.00, trend: '+12%' },
        { id: 'app-2', name: '美沃斯SCRM助手', usageCount: 890, consumption: 28450.00, weeklyConsumption: 0, trend: '+5%' },
        { id: 'app-3', name: '3D身形模拟器', usageCount: 560, consumption: 14200.00, weeklyConsumption: 1800.00, trend: '-2%' },
        { id: 'app-xhs', name: '小红书爆文生成器', usageCount: 350, consumption: 5200.00, weeklyConsumption: 850.00, trend: '+20%' },
        { id: 'app-record', name: '治疗记录AI助理', usageCount: 200, consumption: 2980.00, weeklyConsumption: 420.00, trend: '+8%' },
    ];

    // Mock Data for App Trends (Weekly Dimension)
    const appTrendData = [
        { name: '9月W4', 'AI面部智能诊断': 850, '美沃斯SCRM助手': 620, '3D身形模拟器': 340 },
        { name: '10月W1', 'AI面部智能诊断': 920, '美沃斯SCRM助手': 750, '3D身形模拟器': 410 },
        { name: '10月W2', 'AI面部智能诊断': 1100, '美沃斯SCRM助手': 890, '3D身形模拟器': 520 },
        { name: '10月W3', 'AI面部智能诊断': 1240, '美沃斯SCRM助手': 1050, '3D身形模拟器': 680 },
        { name: '10月W4', 'AI面部智能诊断': 1450, '美沃斯SCRM助手': 1120, '3D身形模拟器': 750 },
    ];

    // Mock Data for Staff Trends (Weekly Dimension)
    const staffTrendData = [
         { name: '9月W4', '李咨询': 105, '王客服': 140, '张医生': 35 },
         { name: '10月W1', '李咨询': 130, '王客服': 165, '张医生': 45 },
         { name: '10月W2', '李咨询': 158, '王客服': 180, '张医生': 60 },
         { name: '10月W3', '李咨询': 190, '王客服': 210, '张医生': 85 },
         { name: '10月W4', '李咨询': 245, '王客服': 230, '张医生': 110 },
    ];

    // Custom Tooltip for cleaner look
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl z-50">
                    <p className="text-sm font-bold text-slate-800 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-500">{entry.name}:</span>
                            <span className="font-bold text-slate-700">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Admin Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">管理控制台</h2>
                    <p className="text-slate-500 text-sm mt-1">全局监控机构AI应用运行状况与人员效率。</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> 筛选
                    </button>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> 刷新数据
                    </button>
                </div>
            </div>

            {/* App Summary Table (Updated with Weekly Consumption) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50/50 to-white">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary-500" />
                        应用消耗与使用汇总
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 pl-8">应用名称</th>
                                <th className="px-6 py-4">分类</th>
                                <th className="px-6 py-4 text-center">本周使用次数</th>
                                <th className="px-6 py-4 text-center">周环比</th>
                                <th className="px-6 py-4">本周消耗</th>
                                <th className="px-6 py-4 text-right pr-8">总消耗金额</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {appSummaryData.map(summary => {
                                const appDef = MOCK_APPS.find(a => a.id === summary.id);
                                return (
                                    <tr key={summary.id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-6 py-4 pl-8">
                                             <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm ${
                                                    appDef?.icon === 'scan-face' ? 'bg-blue-50 text-blue-600' : 
                                                    appDef?.icon === 'users' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-slate-50 text-slate-600'
                                                }`}>
                                                     {appDef?.icon === 'scan-face' ? <Zap className="w-5 h-5" /> : 
                                                      appDef?.icon === 'users' ? <ShieldCheck className="w-5 h-5" /> :
                                                      <Box className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{summary.name}</div>
                                                    <div className="text-xs text-slate-400">{appDef?.provider || '自营应用'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {appDef?.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="font-semibold text-slate-700 bg-slate-50 inline-block px-3 py-1 rounded-md">{summary.usageCount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${summary.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {summary.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                                {summary.trend}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">¥ {summary.weeklyConsumption.toLocaleString('zh-CN', {minimumFractionDigits: 2})}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="font-medium text-slate-500">¥ {summary.consumption.toLocaleString('zh-CN', {minimumFractionDigits: 2})}</div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Charts Column */}
                 <div className="lg:col-span-2 space-y-6">
                    {/* App Usage Chart - Weekly View - Line Chart */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary-500" />
                                应用使用趋势 (周维度)
                            </h3>
                        </div>

                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={appTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="AI面部智能诊断" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="美沃斯SCRM助手" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#8b5cf6' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="3D身形模拟器" stroke="#f97316" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#f97316' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Staff Activity Chart - Weekly View - Line Chart */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary-500" />
                                员工活跃度趋势 (周维度)
                            </h3>
                        </div>

                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={staffTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="李咨询" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#0ea5e9' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="王客服" stroke="#ec4899" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#ec4899' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="张医生" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                 </div>

                 {/* Subscription Request Checklist */}
                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full lg:max-h-[calc(100vh-140px)] sticky top-24">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                         <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-500" />
                            应用订阅审批
                        </h3>
                        <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{pendingRequests.length} 待办</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {pendingRequests.length > 0 ? pendingRequests.map(req => (
                            <div key={req.id} className="p-3 border border-slate-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src={req.userAvatar} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">{req.userName}</div>
                                        <div className="text-xs text-slate-500">申请开通: <span className="text-primary-600">{req.appName}</span></div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleReject(req.id)} className="flex-1 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                                        <X className="w-3 h-3" /> 驳回
                                    </button>
                                    <button onClick={() => handleApprove(req.id)} className="flex-1 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center justify-center gap-1">
                                        <Check className="w-3 h-3" /> 批准并购买
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                <CheckCircle className="w-10 h-10 mb-2 opacity-20" />
                                <span className="text-xs">暂无待审批事项</span>
                            </div>
                        )}
                        
                        {/* Show Approved History Briefly */}
                        {requests.filter(r => r.status !== 'PENDING').length > 0 && (
                             <div className="mt-4 pt-4 border-t border-slate-50">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">最近处理记录</h4>
                                {requests.filter(r => r.status !== 'PENDING').slice(0, 3).map(req => (
                                    <div key={req.id} className="flex justify-between items-center text-xs py-1">
                                        <span className="text-slate-600">{req.userName} - {req.appName}</span>
                                        <span className={req.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}>
                                            {req.status === 'APPROVED' ? '已通过' : '已驳回'}
                                        </span>
                                    </div>
                                ))}
                             </div>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );
};

// StaffDashboard Component
const StaffDashboard: React.FC<{ user: User; onLaunchApp: (app: AIApp) => void }> = ({ user, onLaunchApp }) => {
    const role = MOCK_ROLES.find(r => r.id === user.roleId);
    
    // Combine role-based apps and extra assigned apps
    const allowedAppIds = new Set([
        ...(role?.appIds || []),
        ...(user.extraAppIds || [])
    ]);
    
    const myApps = MOCK_APPS.filter(app => allowedAppIds.has(app.id));
    const myUsage = MOCK_USAGE_RECORDS.filter(r => r.userId === user.id).slice(0, 5); // Last 5 records

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">你好，{user.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {role?.name} | {role?.type === RoleType.INDIVIDUAL ? '个人版' : '机构版'}
                    </p>
                </div>
                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <AppGrid apps={myApps} onClick={onLaunchApp} title="我的应用工作台" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-500" />
                            最近任务与记录
                        </h3>
                        <button className="text-xs text-primary-600 hover:underline">查看全部</button>
                    </div>
                    
                    <div className="space-y-3">
                         {myUsage.length > 0 ? myUsage.map(record => (
                            <div key={record.id} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${
                                    record.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                }`}>
                                    {record.status === 'SUCCESS' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-800 text-sm truncate">{record.appName}</h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">{record.date.split(' ')[0]}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-0.5 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                        {record.actionType}: {record.resultSummary}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <Box className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">暂无操作记录</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary-600 to-meiwos-purple rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">探索更多能力</h3>
                        <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                            美沃斯 AI Hub 持续更新中。前往应用市场发现更多提效工具。
                        </p>
                        <button className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-50 transition-colors shadow-sm">
                            浏览应用市场
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// IndividualDashboard Component
const IndividualDashboard: React.FC<{ user: User; onLaunchApp: (app: AIApp) => void }> = ({ user, onLaunchApp }) => {
    const role = MOCK_ROLES.find(r => r.id === user.roleId);
    const allowedAppIds = new Set([ ...(role?.appIds || []), ...(user.extraAppIds || []) ]);
    const myApps = MOCK_APPS.filter(app => allowedAppIds.has(app.id));

    // Mock Data for Individual Summary
    const individualSummaryData = [
        { id: 'app-1', name: 'AI面部智能诊断', usageCount: 42, consumption: 850.00, weeklyConsumption: 120.00, trend: '+8%' },
        { id: 'app-xhs', name: '小红书爆文生成器', usageCount: 28, consumption: 150.00, weeklyConsumption: 35.00, trend: '+15%' },
        { id: 'app-3', name: '3D身形模拟器', usageCount: 15, consumption: 750.00, weeklyConsumption: 100.00, trend: '-5%' },
    ];

    // Mock Data for Individual Trends (Weekly)
    const individualTrendData = [
        { name: '9月W4', 'AI面部智能诊断': 5, '小红书爆文生成器': 3, '3D身形模拟器': 2 },
        { name: '10月W1', 'AI面部智能诊断': 8, '小红书爆文生成器': 5, '3D身形模拟器': 2 },
        { name: '10月W2', 'AI面部智能诊断': 12, '小红书爆文生成器': 8, '3D身形模拟器': 4 },
        { name: '10月W3', 'AI面部智能诊断': 10, '小红书爆文生成器': 10, '3D身形模拟器': 5 },
        { name: '10月W4', 'AI面部智能诊断': 15, '小红书爆文生成器': 12, '3D身形模拟器': 6 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl z-50">
                    <p className="text-sm font-bold text-slate-800 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-500">{entry.name}:</span>
                            <span className="font-bold text-slate-700">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">你好，{user.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        个人专业版 | 专注于您的医美业务效能提升
                    </p>
                </div>
                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Section 1: My Apps */}
            <AppGrid apps={myApps} onClick={onLaunchApp} title="我的应用工作台" />

            {/* Section 2: Summary Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50/50 to-white">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary-500" />
                        应用消耗与使用汇总
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 pl-8">应用名称</th>
                                <th className="px-6 py-4">分类</th>
                                <th className="px-6 py-4 text-center">本周调用</th>
                                <th className="px-6 py-4">本周消耗</th>
                                <th className="px-6 py-4">总消耗金额</th>
                                <th className="px-6 py-4 text-right pr-8">周环比</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {individualSummaryData.map(summary => {
                                const appDef = MOCK_APPS.find(a => a.id === summary.id);
                                return (
                                    <tr key={summary.id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-6 py-4 pl-8">
                                             <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm ${
                                                    appDef?.icon === 'scan-face' ? 'bg-blue-50 text-blue-600' : 
                                                    appDef?.icon === 'users' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-slate-50 text-slate-600'
                                                }`}>
                                                     {appDef?.icon === 'scan-face' ? <Zap className="w-5 h-5" /> : 
                                                      appDef?.icon === 'users' ? <ShieldCheck className="w-5 h-5" /> :
                                                      <Box className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{summary.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                {appDef?.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="font-semibold text-slate-700 bg-slate-50 inline-block px-3 py-1 rounded-md">{summary.usageCount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">¥ {summary.weeklyConsumption.toLocaleString('zh-CN', {minimumFractionDigits: 2})}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-500">¥ {summary.consumption.toLocaleString('zh-CN', {minimumFractionDigits: 2})}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${summary.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {summary.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                                {summary.trend}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section 3: Trend Chart - Line Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary-500" />
                        应用使用趋势 (周维度)
                    </h3>
                </div>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={individualTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Line type="monotone" dataKey="AI面部智能诊断" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="小红书爆文生成器" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#8b5cf6' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="3D身形模拟器" stroke="#f97316" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#f97316' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export const Workbench: React.FC<WorkbenchProps> = ({ onLaunchApp, user }) => {
    const role = MOCK_ROLES.find(r => r.id === user.roleId);
    
    if (role?.type === RoleType.ADMIN) {
        return <AdminDashboard user={user} />;
    }

    if (role?.type === RoleType.INDIVIDUAL) {
        return <IndividualDashboard user={user} onLaunchApp={onLaunchApp} />;
    }

    // Default to Staff Dashboard for STAFF
    return <StaffDashboard user={user} onLaunchApp={onLaunchApp} />;
};
