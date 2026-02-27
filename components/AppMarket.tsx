
// ... existing imports ...
import React, { useState } from 'react';
import { MOCK_APPS, MOCK_USERS, MOCK_ROLES } from '../constants';
import { AppType, AIApp, User, RoleType } from '../types';
import { Search, Zap, Star, ShieldCheck, Box, ChevronLeft, Check, Clock, MessageSquare, CreditCard, Send, X, BarChart3, Users, Activity, Play, FileText, Image as ImageIcon, Sparkles, Megaphone, Clapperboard, Calendar, ClipboardList, RefreshCcw, Filter, QrCode, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// ... existing code for categories and main component ...

type MarketView = 'LIST' | 'DETAIL' | 'APP_DASHBOARD';

const CATEGORIES = [
    { id: 'ALL', label: '全部' },
    { id: '获客引流', label: '获客引流', icon: <Megaphone className="w-4 h-4" /> },
    { id: '咨询转化', label: '咨询转化', icon: <Zap className="w-4 h-4" /> },
    { id: '运营管理', label: '运营管理', icon: <Users className="w-4 h-4" /> },
    { id: '治疗执行', label: '治疗执行', icon: <ClipboardList className="w-4 h-4" /> },
    { id: '术后服务', label: '术后服务', icon: <MessageSquare className="w-4 h-4" /> },
    { id: '复购增购', label: '复购增购', icon: <RefreshCcw className="w-4 h-4" /> },
];

export const AppMarket: React.FC<{ user: User }> = ({ user }) => {
  // ... existing implementation of AppMarket component ...
  const [view, setView] = useState<MarketView>('LIST');
  const [selectedApp, setSelectedApp] = useState<AIApp | null>(null);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'OFFICIAL' | 'THIRD'>('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState<'ALL' | 'PURCHASED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = MOCK_APPS.filter(app => {
    const matchesCategory = categoryFilter === 'ALL' || app.category === categoryFilter;
    const matchesType = 
      typeFilter === 'ALL' || 
      (typeFilter === 'OFFICIAL' && app.type === AppType.OFFICIAL) ||
      (typeFilter === 'THIRD' && app.type === AppType.THIRD_PARTY);
    const matchesOwnership = ownershipFilter === 'ALL' || (ownershipFilter === 'PURCHASED' && app.status === 'active');
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesType && matchesOwnership && matchesSearch;
  });

  const handleAppClick = (app: AIApp) => {
    setSelectedApp(app);
    setView('DETAIL');
  };

  const handleBack = () => {
    if (view === 'APP_DASHBOARD') {
        setView('DETAIL');
    } else {
        setSelectedApp(null);
        setView('LIST');
    }
  };

  const handleEnterApp = () => {
      setView('APP_DASHBOARD');
  };

  const handleApplyTrial = () => {
      if (selectedApp) {
          const updatedApp = {...selectedApp, status: 'trial' as const, trialUsed: true};
          setSelectedApp(updatedApp);
          const appIndex = MOCK_APPS.findIndex(a => a.id === selectedApp.id);
          if(appIndex !== -1) {
              MOCK_APPS[appIndex].status = 'trial';
              MOCK_APPS[appIndex].trialUsed = true;
          }
          alert(`恭喜！已成功开通 ${selectedApp.name} 的免费试用权限！`);
      }
  };

  if (view === 'APP_DASHBOARD' && selectedApp) {
      return (
          <AppDashboard 
            app={selectedApp} 
            onBack={handleBack} 
          />
      );
  }

  if (view === 'DETAIL' && selectedApp) {
      return (
          <AppDetailView 
                app={selectedApp} 
                user={user}
                onBack={handleBack} 
                onApplyTrial={handleApplyTrial} 
                onEnterApp={handleEnterApp}
          />
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">AI 应用市场</h2>
          <p className="text-slate-500 text-sm mt-1">严选全球顶尖医美AI，覆盖机构运营全生命周期</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text"
              placeholder="搜索应用..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide border-b border-slate-50 mb-2 p-1">
             {CATEGORIES.map(cat => (
                 <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        categoryFilter === cat.id 
                            ? 'bg-primary-50 text-primary-600 shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                 >
                     {cat.icon}
                     {cat.label}
                 </button>
             ))}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4 p-2">
              {/* Type Filters */}
              <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
                      <Filter className="w-3 h-3" />
                      来源:
                  </span>
                  <div className="flex gap-2">
                    {[
                        { id: 'ALL', label: '全部' },
                        { id: 'OFFICIAL', label: '美沃斯官方' },
                        { id: 'THIRD', label: '第三方生态' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setTypeFilter(type.id as any)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
                                typeFilter === type.id
                                    ? 'bg-slate-800 text-white border-slate-800'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {type.label}
                        </button>
                    ))}
                  </div>
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

              {/* Ownership Filters */}
              <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                      状态:
                  </span>
                  <div className="flex gap-2">
                    {[
                        { id: 'ALL', label: '全部' },
                        { id: 'PURCHASED', label: '已订阅' }
                    ].map((status) => (
                        <button
                            key={status.id}
                            onClick={() => setOwnershipFilter(status.id as any)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
                                ownershipFilter === status.id
                                    ? 'bg-slate-800 text-white border-slate-800'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {status.label}
                        </button>
                    ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map(app => (
          <AppCard key={app.id} app={app} onClick={() => handleAppClick(app)} />
        ))}
        {filteredApps.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 flex flex-col items-center">
                <Box className="w-16 h-16 mb-4 opacity-20" />
                <p>没有找到符合条件的应用</p>
                <button 
                    onClick={() => {
                        setCategoryFilter('ALL'); 
                        setTypeFilter('ALL'); 
                        setOwnershipFilter('ALL');
                        setSearchTerm('');
                    }} 
                    className="mt-4 text-primary-600 text-sm hover:underline"
                >
                    清除筛选条件
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const AppCard: React.FC<{ app: AIApp; onClick: () => void }> = ({ app, onClick }) => {
  const getIcon = (iconName: string) => {
      switch(iconName) {
          case 'megaphone': return <Megaphone className="h-6 w-6" />;
          case 'clapperboard': return <Clapperboard className="h-6 w-6" />;
          case 'scan-face': return <Zap className="h-6 w-6" />;
          case 'users': return <Users className="h-6 w-6" />;
          case 'calendar': return <Calendar className="h-6 w-6" />;
          case 'clipboard-list': return <ClipboardList className="h-6 w-6" />;
          case 'refresh-ccw': return <RefreshCcw className="h-6 w-6" />;
          case 'message-circle-heart': return <MessageSquare className="h-6 w-6" />;
          case 'box': return <Box className="h-6 w-6" />;
          default: return <Star className="h-6 w-6" />;
      }
  };

  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col h-full cursor-pointer group relative overflow-hidden"
    >
      {/* Source Badge */}
      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider ${
          app.type === AppType.OFFICIAL 
            ? 'bg-primary-600 text-white' 
            : 'bg-slate-100 text-slate-500'
      }`}>
          {app.type === AppType.OFFICIAL ? '美沃斯官方' : '第三方'}
      </div>

      <div className="flex justify-between items-start mb-4 mt-2">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg transition-colors ${
              app.type === AppType.OFFICIAL 
                ? 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white' 
                : 'bg-slate-50 text-slate-600 group-hover:bg-slate-600 group-hover:text-white'
          }`}>
             {getIcon(app.icon)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{app.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-50 text-slate-500 border border-slate-100">
                {app.category}
              </span>
              <div className="flex items-center text-yellow-500 text-xs">
                <Star className="h-3 w-3 fill-current" />
                <span className="ml-1 text-slate-600">{app.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">
        {app.description}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
        <span className="text-xs text-slate-400">
          {app.integrationType === 'EXTERNAL_LINK' ? '外部链接' : app.integrationType === 'PURE_API' ? '纯 API' : '平台内嵌'}
        </span>
        <button 
          className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            app.status === 'active' 
              ? 'bg-emerald-50 text-emerald-600' 
              : 'text-primary-600 hover:bg-primary-50'
          }`}
        >
          {app.status === 'active' ? (
              <>已开通 <Check className="w-4 h-4" /></>
          ) : (
              <>查看详情</>
          )}
        </button>
      </div>
    </div>
  );
};

// ... AppDashboard code ...
export const AppDashboard: React.FC<{ app: AIApp; onBack: () => void }> = ({ app, onBack }) => {
    // ... existing implementation ...
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'WORKSPACE'>('WORKSPACE');
    const usageData = [
        { name: 'Mon', value: 24 }, { name: 'Tue', value: 18 }, { name: 'Wed', value: 45 },
        { name: 'Thu', value: 32 }, { name: 'Fri', value: 56 }, { name: 'Sat', value: 38 }, { name: 'Sun', value: 21 },
    ];
    const staffUsage = MOCK_USERS.map(u => ({ ...u, usageCount: Math.floor(Math.random() * 50) + 5, lastActive: '2小时前' })).sort((a, b) => b.usageCount - a.usageCount);

    return (
        <div className="min-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-slate-800">{app.name}</h2>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                运行中
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">控制台与工作区</p>
                    </div>
                </div>
                
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('WORKSPACE')}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                            activeTab === 'WORKSPACE' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Play className="w-4 h-4" />
                        功能工作台
                    </button>
                    <button 
                        onClick={() => setActiveTab('DASHBOARD')}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                            activeTab === 'DASHBOARD' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        数据看板
                    </button>
                </div>
            </div>

            {activeTab === 'DASHBOARD' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Simplified Dashboard for brevity in this response */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">应用使用趋势 (近7天)</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={usageData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'WORKSPACE' && (
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in">
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                         <Box className="w-16 h-16 mb-4 opacity-20" />
                         <p>功能工作台演示区域</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... existing Detail View Components ...
const AppDetailView: React.FC<{ 
    app: AIApp; 
    user: User;
    onBack: () => void; 
    onApplyTrial: () => void;
    onEnterApp: () => void;
}> = ({ app, user, onBack, onApplyTrial, onEnterApp }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PRICING' | 'REVIEWS' | 'CONTACT'>('OVERVIEW');
    const [reviewText, setReviewText] = useState('');

    const userRole = MOCK_ROLES.find(r => r.id === user.roleId);
    const isStaff = userRole?.type === RoleType.STAFF;

    const handleSubscribe = (planId: string) => {
        if (isStaff) {
             alert('您的订阅申请已提交给管理员审批。');
        } else {
             alert('订阅成功！费用已从账户余额扣除。');
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[80vh] flex flex-col">
            {/* Header Banner */}
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> 返回应用列表
                </button>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-6">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-md ${
                            app.type === AppType.OFFICIAL ? 'bg-primary-600 text-white' : 'bg-white text-meiwos-purple border border-slate-100'
                        }`}>
                             {app.icon === 'scan-face' ? <Zap className="h-10 w-10" /> : 
                              app.icon === 'users' ? <ShieldCheck className="h-10 w-10" /> : 
                              app.icon === 'box' ? <Box className="h-10 w-10" /> : 
                              <Star className="h-10 w-10" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-slate-900">{app.name}</h1>
                                <span className={`text-xs px-2 py-0.5 rounded border ${
                                    app.type === AppType.OFFICIAL ? 'bg-primary-50 text-primary-700 border-primary-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                                }`}>{app.type}</span>
                            </div>
                            <p className="text-slate-500 max-w-xl mb-4 text-sm leading-relaxed">{app.description}</p>
                            <div className="flex items-center gap-6 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-semibold">{app.rating}</span>
                                    <span className="text-slate-400">({app.reviews.length} 条评价)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span>服务商: {app.provider}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(app.status === 'active' || app.status === 'trial') && (
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {app.status === 'active' ? (
                                <button 
                                    onClick={onEnterApp}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5" /> 进入应用
                                </button>
                            ) : (
                                <button 
                                    onClick={onEnterApp}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Clock className="w-5 h-5" /> 试用中 (剩5天)
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-slate-200 px-8">
                <button 
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'OVERVIEW' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    产品详情
                </button>
                <button 
                    onClick={() => setActiveTab('PRICING')}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'PRICING' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    价格方案
                </button>
                <button 
                    onClick={() => setActiveTab('REVIEWS')}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'REVIEWS' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    评价反馈
                </button>
                {app.status === 'active' && (
                    <button 
                        onClick={() => setActiveTab('CONTACT')}
                        className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === 'CONTACT' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        联系客服
                    </button>
                )}
            </div>

            <div className="p-8 flex-1">
                {activeTab === 'OVERVIEW' && (
                    <div className="max-w-4xl animate-fade-in">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">功能简介</h3>
                        <p className="text-slate-600 leading-7 mb-8">{app.fullDescription}</p>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-4">核心亮点</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {app.features.map((feature, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{feature.title}</h4>
                                        <p className="text-sm text-slate-500">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {app.screenshots.length > 0 && (
                            <>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">应用截图</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {app.screenshots.map((src, idx) => (
                                        <img key={idx} src={src} alt={`Screenshot ${idx}`} className="rounded-xl shadow-sm border border-slate-200" />
                                    ))}
                                </div>
                            </>
                        )}
                        {/* Documentation Snippet if available */}
                        {app.documentation && (
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">使用文档预览</h3>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: app.documentation.substring(0, 200) + '...' }} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'PRICING' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                         {app.pricing.map(plan => (
                             <div key={plan.id} className={`border rounded-xl p-6 hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col ${
                                 plan.type === 'TRIAL' ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'
                             }`}>
                                 {/* Plan Type Badge */}
                                 <div className="absolute top-0 right-0">
                                     {plan.type === 'TRIAL' ? (
                                         <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-xl font-medium block">免费试用</span>
                                     ) : (
                                         <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-bl-xl font-medium block">
                                             {plan.model === 'SEAT' ? '席位订阅' : 
                                              plan.model === 'SUBSCRIPTION' ? '账户订阅' : 
                                              plan.model === 'USAGE' ? '按量付费' : '资源包'}
                                         </span>
                                     )}
                                 </div>

                                 <h4 className="text-lg font-bold text-slate-900 mb-4">{plan.name}</h4>
                                 
                                 {/* Price Display Logic */}
                                 <div className="mb-6">
                                     {plan.model === 'SEAT' ? (
                                         <div>
                                             {/* If both exist, show both (legacy data). If only one exists (new data), show just that one. */}
                                             {plan.priceMonth && !plan.priceYear && (
                                                 <div className="flex items-end gap-1">
                                                     <span className="text-3xl font-bold text-slate-900">¥{plan.priceMonth}</span>
                                                     <span className="text-slate-500 text-sm mb-1">/月</span>
                                                 </div>
                                             )}
                                             {plan.priceYear && !plan.priceMonth && (
                                                 <div className="flex items-end gap-1">
                                                     <span className="text-3xl font-bold text-slate-900">¥{plan.priceYear}</span>
                                                     <span className="text-slate-500 text-sm mb-1">/年</span>
                                                 </div>
                                             )}
                                             {plan.priceMonth && plan.priceYear && (
                                                 <div>
                                                     <div className="flex items-end gap-1">
                                                         <span className="text-3xl font-bold text-slate-900">¥{plan.priceMonth}</span>
                                                         <span className="text-slate-500 text-sm mb-1">/月</span>
                                                     </div>
                                                     <div className="text-sm text-slate-500 mt-1">或 ¥{plan.priceYear}/年</div>
                                                 </div>
                                             )}
                                             
                                             <div className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded mt-2 inline-block border border-slate-200">
                                                 包含 {plan.includedSeats || 1} 个席位
                                             </div>
                                         </div>
                                     ) : plan.model === 'SUBSCRIPTION' ? (
                                         <div>
                                             {plan.priceMonth !== undefined && plan.priceMonth > 0 ? (
                                                 <div className="flex items-end gap-1">
                                                     <span className="text-3xl font-bold text-slate-900">¥{plan.priceMonth}</span>
                                                     <span className="text-slate-500 text-sm mb-1">/月</span>
                                                 </div>
                                             ) : plan.priceYear !== undefined && plan.priceYear > 0 ? null : (
                                                 <div className="text-3xl font-bold text-slate-900">免费</div>
                                             )}
                                             
                                             {plan.priceYear !== undefined && plan.priceYear > 0 && (
                                                 <div className="text-sm text-slate-500 mt-1">
                                                     或 ¥{plan.priceYear}/年
                                                 </div>
                                             )}
                                         </div>
                                     ) : plan.model === 'USAGE' ? (
                                         <div className="flex items-end gap-1">
                                             <span className="text-3xl font-bold text-slate-900">¥{plan.pricePerUnit}</span>
                                             <span className="text-slate-500 text-sm mb-1">/{plan.unitName || '次'}</span>
                                         </div>
                                     ) : (
                                         <div>
                                             <div className="flex items-end gap-1">
                                                 <span className="text-3xl font-bold text-slate-900">¥{plan.packPrice}</span>
                                             </div>
                                             <div className="text-sm text-slate-500 mt-1">
                                                 含 {plan.packQuota} {plan.unitName || '次'}
                                             </div>
                                         </div>
                                     )}
                                 </div>

                                 <ul className="space-y-3 mb-8 flex-1">
                                     {plan.features.map((f, i) => (
                                         <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                             <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                             {f}
                                         </li>
                                     ))}
                                 </ul>

                                 {/* Button Logic based on Type and User Role */}
                                 {plan.type === 'TRIAL' ? (
                                    <button 
                                        onClick={onApplyTrial}
                                        disabled={app.trialUsed || app.status === 'active'}
                                        className={`w-full py-2 rounded-lg font-medium border transition-colors ${
                                            app.trialUsed || app.status === 'active'
                                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                                : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                                        }`}
                                    >
                                        {app.trialUsed ? '已试用过' : app.status === 'active' ? '已拥有正式版' : '免费试用'}
                                    </button>
                                 ) : (
                                    <button 
                                        onClick={() => handleSubscribe(plan.id)}
                                        className={`w-full py-2 rounded-lg font-medium border transition-colors ${
                                        plan.name.includes('专业') 
                                            ? 'bg-primary-600 text-white border-transparent hover:bg-primary-700'
                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {isStaff ? '申请订阅 (需审批)' : '立即订阅'}
                                    </button>
                                 )}
                             </div>
                         ))}
                    </div>
                )}

                {activeTab === 'REVIEWS' && (
                    <div className="max-w-3xl animate-fade-in">
                        <div className="bg-slate-50 p-6 rounded-xl mb-8 flex items-start gap-4">
                            <div className="bg-white p-3 rounded-full border border-slate-200 text-slate-400">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">使用体验反馈</label>
                                <textarea 
                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none mb-2"
                                    rows={3}
                                    placeholder="分享您的使用感受，帮助更多机构选择..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                ></textarea>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(star => (
                                            <Star key={star} className="w-5 h-5 text-slate-300 hover:text-yellow-400 cursor-pointer transition-colors" />
                                        ))}
                                    </div>
                                    <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center gap-2">
                                        <Send className="w-4 h-4" /> 提交评价
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {app.reviews.length > 0 ? app.reviews.map(review => (
                                <div key={review.id} className="border-b border-slate-100 pb-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {review.user[0]}
                                            </div>
                                            <span className="font-medium text-slate-800">{review.user}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{review.date}</span>
                                    </div>
                                    <div className="flex text-yellow-400 mb-2">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                    <p className="text-slate-600 text-sm">{review.content}</p>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400">暂无评价，快来抢沙发吧！</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'CONTACT' && (
                    <div className="max-w-3xl animate-fade-in flex justify-center py-10">
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg text-center max-w-sm w-full">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <MessageSquare className="w-8 h-8" /> 
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">专属客户经理</h3>
                            <p className="text-slate-500 text-sm mb-8">扫码添加微信，获取一对一技术支持</p>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block mb-6">
                                <div className="w-40 h-40 bg-white flex items-center justify-center">
                                     <QrCode className="w-32 h-32 text-slate-800" strokeWidth={1} />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-slate-700 bg-slate-50 py-3 rounded-lg">
                                    <Phone className="w-4 h-4" />
                                    <span className="font-bold">400-888-6666</span>
                                </div>
                                <p className="text-xs text-slate-400">工作时间: 周一至周日 9:00 - 21:00</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
