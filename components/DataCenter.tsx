import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_KNOWLEDGE } from '../constants';
import { Database, BookOpen, RefreshCw, Upload, Plus, Search, Tag, FileText } from 'lucide-react';

export const DataCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'KNOWLEDGE'>('PRODUCTS');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">数据中心</h2>
          <p className="text-slate-500 text-sm mt-1">管理机构核心数据资产：商品库与医疗知识库</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex self-start">
            <button 
                onClick={() => setActiveTab('PRODUCTS')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'PRODUCTS' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Database className="w-4 h-4" />
                商品库
            </button>
            <button 
                onClick={() => setActiveTab('KNOWLEDGE')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'KNOWLEDGE' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <BookOpen className="w-4 h-4" />
                产品知识库
            </button>
        </div>
      </div>

      {activeTab === 'PRODUCTS' ? (
        <ProductLibrary />
      ) : (
        <KnowledgeBase />
      )}
    </div>
  );
};

const ProductLibrary: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="搜索商品名称或SKU..." />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 bg-white">
                        <Upload className="w-4 h-4" />
                        模板导入
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 bg-white">
                        <RefreshCw className="w-4 h-4" />
                        API同步
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-200">
                        <Plus className="w-4 h-4" />
                        手工录入
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">商品名称</th>
                            <th className="px-6 py-4">SKU编码</th>
                            <th className="px-6 py-4">分类</th>
                            <th className="px-6 py-4">同步方式</th>
                            <th className="px-6 py-4">最后更新</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_PRODUCTS.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono">{p.sku}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{p.category}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className="flex items-center gap-1">
                                        {p.syncSource === 'API' && <RefreshCw className="w-3 h-3 text-green-500" />}
                                        {p.syncSource === 'IMPORT' && <Upload className="w-3 h-3 text-orange-500" />}
                                        {p.syncSource === 'MANUAL' && <FileText className="w-3 h-3 text-slate-400" />}
                                        {p.syncSource}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">{p.lastSync}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const KnowledgeBase: React.FC = () => {
    return (
        <div className="space-y-4">
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-blue-900">平台维护标准库</h4>
                    <p className="text-xs text-blue-700 mt-1">包含产品百科、功效说明、症状匹配等标准数据。机构可在标准库基础上进行扩展与本地化修改。</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_KNOWLEDGE.map(k => (
                    <div key={k.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                k.category === 'EFFICACY' ? 'bg-purple-50 text-purple-600' :
                                k.category === 'SYMPTOM' ? 'bg-rose-50 text-rose-600' :
                                'bg-indigo-50 text-indigo-600'
                            }`}>
                                {k.category === 'EFFICACY' ? '功效' : k.category === 'SYMPTOM' ? '症状' : '设备'}
                            </span>
                            <span className="text-xs text-slate-300 group-hover:text-primary-400">编辑</span>
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-3">{k.title}</h4>
                        <div className="flex flex-wrap gap-2">
                            {k.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400 text-right">
                            最后更新: {k.lastUpdated}
                        </div>
                    </div>
                ))}
                
                {/* Add New Card */}
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-600 transition-all cursor-pointer h-full min-h-[160px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">扩展知识条目</span>
                </div>
            </div>
        </div>
    );
}
