
import React, { useState } from 'react';
import { MOCK_APPS, MOCK_INSTITUTIONS, MOCK_SERVICE_PROVIDERS } from '../constants';
import { AIApp, Institution, ServiceProvider } from '../types';
import { Check, X, Search, Building2, MapPin, Phone, User as UserIcon, Calendar, Filter, Eye, AlertCircle, Plus, Mail, Briefcase, FileText, Settings, Code } from 'lucide-react';

interface PlatformManagementProps {
    view: 'APP_REVIEW' | 'INSTITUTION' | 'PROVIDER_REVIEW';
}

export const PlatformManagement: React.FC<PlatformManagementProps> = ({ view }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {view === 'APP_REVIEW' ? '应用审核' : view === 'PROVIDER_REVIEW' ? '服务商资质审核' : '机构入驻管理'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {view === 'APP_REVIEW' 
                            ? '审核服务商提交的AI应用上架申请' 
                            : view === 'PROVIDER_REVIEW'
                            ? '审核服务商的企业资质与入驻申请'
                            : '管理平台入驻的医美机构信息'}
                    </p>
                </div>
            </div>

            {view === 'APP_REVIEW' && <AppReviewList />}
            {view === 'INSTITUTION' && <InstitutionList />}
            {view === 'PROVIDER_REVIEW' && <ProviderReviewList />}
        </div>
    );
};

const AppReviewList: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
    const [auditApp, setAuditApp] = useState<AIApp | null>(null);
    
    // In a real app, we would filter for 'PENDING' status, but for mock purposes we show all or inactive as pending
    // We also use local state for apps to simulate approval changes
    const [apps, setApps] = useState(MOCK_APPS);

    const filteredApps = apps.filter(app => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return app.status === 'active';
        if (filter === 'INACTIVE') return app.status !== 'active';
        return true;
    });

    const handleViewProvider = (providerName: string) => {
        const provider = MOCK_SERVICE_PROVIDERS.find(p => p.name === providerName);
        if (provider) {
            setSelectedProvider(provider);
        } else {
            alert(`未找到服务商 ${providerName} 的信息`);
        }
    };

    const handleOpenAudit = (app: AIApp) => {
        setAuditApp(app);
    };

    const handleApproveApp = (appId: string, integrationType: 'API_EMBEDDED' | 'EXTERNAL_LINK' | 'PURE_API') => {
        setApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'active', integrationType } : a));
        setAuditApp(null);
    };

    const handleRejectApp = (appId: string) => {
        // In real app, we might set status to 'rejected'
        setApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'inactive' } : a)); // Simulating reject keeps it inactive
        setAuditApp(null);
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary-500 outline-none" placeholder="搜索应用名称或服务商..." />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['ALL', 'ACTIVE', 'INACTIVE'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {f === 'ALL' ? '全部' : f === 'ACTIVE' ? '已上架' : '待审核/下架'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">应用信息</th>
                            <th className="px-6 py-4">分类</th>
                            <th className="px-6 py-4">服务商</th>
                            <th className="px-6 py-4">提交时间</th>
                            <th className="px-6 py-4">状态</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredApps.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                             {/* Simplified Icon */}
                                             <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{app.name}</div>
                                            <div className="text-xs text-slate-400 line-clamp-1 max-w-[150px]">{app.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 rounded border border-slate-200 bg-slate-50 text-xs text-slate-600">
                                        {app.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleViewProvider(app.provider)}
                                        className="text-primary-600 hover:underline flex items-center gap-1"
                                    >
                                        {app.provider}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs">2023-10-26</td>
                                <td className="px-6 py-4">
                                    {app.status === 'active' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            <Check className="w-3 h-3" /> 已上架
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                            <AlertCircle className="w-3 h-3" /> 待审核
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {app.status !== 'active' ? (
                                            <button 
                                                onClick={() => handleOpenAudit(app)}
                                                className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors flex items-center gap-1"
                                            >
                                                <Settings className="w-3 h-3" /> 审核配置
                                            </button>
                                        ) : (
                                            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-lg" title="查看详情">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Audit Modal */}
            {auditApp && (
                <AppAuditModal 
                    app={auditApp} 
                    onClose={() => setAuditApp(null)} 
                    onApprove={handleApproveApp}
                    onReject={handleRejectApp}
                />
            )}

            {/* Provider Info Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800">服务商详情</h3>
                            <button onClick={() => setSelectedProvider(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-primary-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{selectedProvider.name}</div>
                                    <div className="text-xs text-slate-500">入驻时间: {selectedProvider.joinDate}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">联系人</label>
                                    <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                        <UserIcon className="w-3 h-3" /> {selectedProvider.contactPerson}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">联系电话</label>
                                    <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> {selectedProvider.phone}
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs text-slate-400">商务邮箱</label>
                                    <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {selectedProvider.email}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 border-t border-slate-100 pt-3">
                                <label className="text-xs text-slate-400">企业简介</label>
                                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                                    {selectedProvider.description || "暂无简介"}
                                </p>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400">资质证明</label>
                                <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg text-sm text-slate-600">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span>营业执照_副本.jpg</span>
                                    <button className="text-primary-600 text-xs ml-auto">预览</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AppAuditModal: React.FC<{
    app: AIApp;
    onClose: () => void;
    onApprove: (id: string, type: 'API_EMBEDDED' | 'EXTERNAL_LINK' | 'PURE_API') => void;
    onReject: (id: string) => void;
}> = ({ app, onClose, onApprove, onReject }) => {
    const [integrationType, setIntegrationType] = useState<'API_EMBEDDED' | 'EXTERNAL_LINK' | 'PURE_API'>('API_EMBEDDED');

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">应用上架审核</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-500">
                            <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">{app.name}</h4>
                            <p className="text-sm text-slate-500">{app.description}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{app.category}</span>
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Provider: {app.provider}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                        <h5 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                            <Settings className="w-4 h-4" /> 平台配置确认
                        </h5>
                        <p className="text-xs text-orange-600 mb-3">
                            请确认该应用在美沃斯平台上的接入方式。此配置将决定用户在工作台的交互体验。
                        </p>
                        
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 bg-white border border-orange-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                                <input 
                                    type="radio" 
                                    name="audit_integration_type" 
                                    value="API_EMBEDDED" 
                                    checked={integrationType === 'API_EMBEDDED'}
                                    onChange={() => setIntegrationType('API_EMBEDDED')}
                                    className="text-orange-600 focus:ring-orange-500"
                                />
                                <div>
                                    <div className="text-sm font-bold text-slate-800">API 内嵌模式</div>
                                    <div className="text-xs text-slate-500">应用界面直接嵌入平台工作台，数据互通。</div>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white border border-orange-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                                <input 
                                    type="radio" 
                                    name="audit_integration_type" 
                                    value="EXTERNAL_LINK" 
                                    checked={integrationType === 'EXTERNAL_LINK'}
                                    onChange={() => setIntegrationType('EXTERNAL_LINK')}
                                    className="text-orange-600 focus:ring-orange-500"
                                />
                                <div>
                                    <div className="text-sm font-bold text-slate-800">外部链接跳转</div>
                                    <div className="text-xs text-slate-500">点击后新窗口打开第三方服务页面。</div>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white border border-orange-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                                <input 
                                    type="radio" 
                                    name="audit_integration_type" 
                                    value="PURE_API" 
                                    checked={integrationType === 'PURE_API'}
                                    onChange={() => setIntegrationType('PURE_API')}
                                    className="text-orange-600 focus:ring-orange-500"
                                />
                                <div>
                                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        纯 API 调用 <Code className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <div className="text-xs text-slate-500">仅提供后端接口能力，无可视化界面。</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={() => onReject(app.id)} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-slate-200 hover:bg-red-50 rounded-lg">驳回申请</button>
                    <button onClick={() => onApprove(app.id, integrationType)} className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-200 flex items-center gap-2">
                        <Check className="w-4 h-4" /> 确认并通过
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProviderReviewList: React.FC = () => {
    const [providers, setProviders] = useState(MOCK_SERVICE_PROVIDERS);
    const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');

    const filteredProviders = providers.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'APPROVED') return p.status === 'APPROVED';
        if (filter === 'PENDING') return p.status === 'PENDING';
        return true;
    });

    const handleApprove = (id: string) => {
        setProviders(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
    };

    const handleReject = (id: string) => {
        setProviders(prev => prev.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
    };

    return (
        <div className="space-y-4 animate-fade-in">
             <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary-500 outline-none" placeholder="搜索服务商..." />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['ALL', 'PENDING', 'APPROVED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {f === 'ALL' ? '全部' : f === 'PENDING' ? '待审核' : '已通过'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">服务商名称</th>
                            <th className="px-6 py-4">联系人</th>
                            <th className="px-6 py-4">联系方式</th>
                            <th className="px-6 py-4">申请时间</th>
                            <th className="px-6 py-4">状态</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProviders.map(provider => (
                            <tr key={provider.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                            {provider.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{provider.name}</div>
                                            <div className="text-xs text-slate-400">ID: {provider.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{provider.contactPerson}</td>
                                <td className="px-6 py-4 text-slate-600">{provider.phone}</td>
                                <td className="px-6 py-4 text-slate-500 text-xs">{provider.joinDate}</td>
                                <td className="px-6 py-4">
                                    {provider.status === 'APPROVED' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            <Check className="w-3 h-3" /> 已认证
                                        </span>
                                    ) : provider.status === 'PENDING' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                            <AlertCircle className="w-3 h-3" /> 待审核
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                            <X className="w-3 h-3" /> 已拒绝
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {provider.status === 'PENDING' ? (
                                            <>
                                                <button onClick={() => handleReject(provider.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-slate-200 hover:bg-red-50 rounded-lg transition-colors">
                                                    拒绝
                                                </button>
                                                <button onClick={() => handleApprove(provider.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm">
                                                    通过
                                                </button>
                                            </>
                                        ) : (
                                            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const InstitutionList: React.FC = () => {
    const [institutions, setInstitutions] = useState(MOCK_INSTITUTIONS);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'REJECTED'>('ALL');

    const filteredInstitutions = institutions.filter(inst => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return inst.status === 'ACTIVE';
        if (filter === 'PENDING') return inst.status === 'PENDING';
        if (filter === 'REJECTED') return inst.status === 'REJECTED';
        return true;
    });

    const handleApprove = (id: string) => {
        setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, status: 'ACTIVE' } : inst));
    };

    const handleReject = (id: string) => {
        setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, status: 'REJECTED' } : inst));
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary-500 outline-none" placeholder="搜索机构名称..." />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['ALL', 'PENDING', 'ACTIVE'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {f === 'ALL' ? '全部' : f === 'PENDING' ? '待审核' : '已通过'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">机构名称</th>
                            <th className="px-6 py-4">城市</th>
                            <th className="px-6 py-4">联系人</th>
                            <th className="px-6 py-4">电话</th>
                            <th className="px-6 py-4">入驻日期</th>
                            <th className="px-6 py-4">状态</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredInstitutions.map(inst => (
                            <tr key={inst.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{inst.name}</td>
                                <td className="px-6 py-4 text-slate-600">{inst.city}</td>
                                <td className="px-6 py-4 text-slate-600">{inst.contactPerson}</td>
                                <td className="px-6 py-4 text-slate-600">{inst.phone}</td>
                                <td className="px-6 py-4 text-slate-500">{inst.joinDate}</td>
                                <td className="px-6 py-4">
                                    {inst.status === 'ACTIVE' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            <Check className="w-3 h-3" /> 已认证
                                        </span>
                                    ) : inst.status === 'PENDING' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                            <AlertCircle className="w-3 h-3" /> 待审核
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                            <X className="w-3 h-3" /> 已拒绝
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {inst.status === 'PENDING' ? (
                                            <>
                                                <button onClick={() => handleReject(inst.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-slate-200 hover:bg-red-50 rounded-lg transition-colors">
                                                    拒绝
                                                </button>
                                                <button onClick={() => handleApprove(inst.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm">
                                                    通过
                                                </button>
                                            </>
                                        ) : (
                                            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
