
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_APPS, MOCK_ROLES, SYSTEM_PERMISSIONS } from '../constants';
import { User, RoleDefinition, RoleType } from '../types';
import { Shield, User as UserIcon, Settings, Plus, Check, Briefcase, Key, Layers, Edit3, Lock, X, Building, ArrowRight } from 'lucide-react';

interface AccountManagementProps {
    currentUser?: User;
}

export const AccountManagement: React.FC<AccountManagementProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'STAFF' | 'ROLES'>('STAFF');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  const userRole = MOCK_ROLES.find(r => r.id === currentUser?.roleId);
  const isIndividual = userRole?.type === RoleType.INDIVIDUAL;
  const isPlatformAdmin = userRole?.type === RoleType.PLATFORM_ADMIN;

  if (isIndividual) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                  <Building className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">升级为机构账号</h2>
              <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                  当前为个人账号，无法使用员工管理与角色配置功能。<br/>
                  升级为机构账号后，您可以邀请团队成员、配置精细化角色权限，并统一管理机构财务与数据。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl w-full mb-8">
                  <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                      <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-slate-500" /> 个人账号
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-500">
                          <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> 单人使用</li>
                          <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> 查看个人账单</li>
                          <li className="flex items-center gap-2"><X className="w-3 h-3 text-slate-300" /> 无法添加员工</li>
                          <li className="flex items-center gap-2"><X className="w-3 h-3 text-slate-300" /> 无法自定义角色</li>
                      </ul>
                  </div>
                  <div className="p-4 border border-primary-200 rounded-lg bg-primary-50/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] px-2 py-0.5 rounded-bl">推荐</div>
                      <h4 className="font-bold text-primary-800 mb-2 flex items-center gap-2">
                          <Building className="w-4 h-4 text-primary-600" /> 机构账号
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary-600" /> 多人团队协作</li>
                          <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary-600" /> 统一财务结算</li>
                          <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary-600" /> RBAC 角色权限管理</li>
                          <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary-600" /> 机构级数据看板</li>
                      </ul>
                  </div>
              </div>

              <button className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 transition-all flex items-center gap-2">
                  联系商务开通机构版 <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-slate-400 mt-4">
                  已有企业资质？请拨打 400-888-9999 进行认证
              </p>
          </div>
      );
  }

  return (
    <div className="space-y-6">
        {isPlatformAdmin ? (
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">美沃斯员工管理</h2>
                    <p className="text-slate-500 text-sm mt-1">管理平台内部员工账号，支持快速添加与维护。</p>
                </div>
                <button
                    onClick={() => setShowStaffModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm shadow-primary-200 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    添加员工
                </button>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">账号与权限管理</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        配置机构角色模型，支持角色批量授权与员工独立权限补充。
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                        <button 
                            onClick={() => setActiveTab('STAFF')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                activeTab === 'STAFF' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <UserIcon className="w-4 h-4" />
                            员工列表
                        </button>
                        <button 
                            onClick={() => setActiveTab('ROLES')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                activeTab === 'ROLES' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            角色设置
                        </button>
                    </div>

                    <button 
                        onClick={() => activeTab === 'ROLES' ? setShowRoleModal(true) : setShowStaffModal(true)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm shadow-primary-200 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {activeTab === 'STAFF' ? '添加员工' : '新建角色'}
                    </button>
                </div>
            </div>
        )}

      {(activeTab === 'STAFF' || isPlatformAdmin) ? (
         <StaffList isPlatformAdmin={isPlatformAdmin} />
      ) : (
         <RoleSettings onEdit={() => setShowRoleModal(true)} />
      )}

      {/* Role Configuration Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">配置角色权限</h3>
                    <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">角色名称</label>
                        <input type="text" defaultValue="新角色" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">功能权限 (System Permissions)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {SYSTEM_PERMISSIONS.map(p => (
                                <label key={p.id} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" className="text-primary-600 rounded" />
                                    <span className="text-sm text-slate-700">{p.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">应用授权 (Allowed Apps)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {MOCK_APPS.map(app => (
                                <label key={app.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" className="mt-1 text-primary-600 rounded" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">{app.name}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1">{app.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">取消</button>
                    <button onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm">保存配置</button>
                </div>
            </div>
        </div>
      )}

      {/* Staff Configuration Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-xl shadow-2xl w-full ${isPlatformAdmin ? 'max-w-md' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto`}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">{isPlatformAdmin ? '添加内部员工' : '添加新员工'}</h3>
                    <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {isPlatformAdmin ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">员工姓名</label>
                                <input type="text" placeholder="请输入姓名" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">手机号</label>
                                <input type="text" placeholder="请输入手机号" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-500 flex items-center gap-2 border border-slate-100">
                                <Shield className="w-4 h-4 text-slate-400" />
                                默认分配角色：<span className="font-bold text-slate-700">美沃斯平台管理员</span>
                            </div>
                        </div>
                    ) : (
                        // Standard Admin View
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">员工姓名</label>
                                    <input type="text" placeholder="请输入姓名" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">所属角色 (Base Role)</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                                        <option value="">请选择角色...</option>
                                        {MOCK_ROLES.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <h4 className="text-sm font-bold text-slate-800">独立权限补充 (可选)</h4>
                                    <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                                        此处勾选的权限将叠加在基础角色之上
                                    </span>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">补充功能权限</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SYSTEM_PERMISSIONS.map(p => (
                                            <label key={p.id} className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input type="checkbox" className="text-primary-600 rounded" />
                                                <span className="text-sm text-slate-700">{p.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">补充应用权限</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {MOCK_APPS.map(app => (
                                            <label key={app.id} className="flex items-center gap-3 p-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input type="checkbox" className="text-primary-600 rounded" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-slate-800 truncate">{app.name}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={() => setShowStaffModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">取消</button>
                    <button onClick={() => setShowStaffModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm">确认添加</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const StaffList: React.FC<{isPlatformAdmin: boolean}> = ({isPlatformAdmin}) => {
    // For Platform Admin, we only show users who are PLATFORM_ADMIN
    const displayUsers = isPlatformAdmin 
        ? MOCK_USERS.filter(u => MOCK_ROLES.find(r => r.id === u.roleId)?.type === RoleType.PLATFORM_ADMIN)
        : MOCK_USERS;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">员工信息</th>
              <th className="px-6 py-4">{isPlatformAdmin ? '职务' : '所属角色 (Base Role)'}</th>
              {!isPlatformAdmin && <th className="px-6 py-4">独立补充权限 (Supplements)</th>}
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayUsers.map((user) => {
                const role = MOCK_ROLES.find(r => r.id === user.roleId);
                return (
                    <tr key={user.id} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                            <div>
                                <div className="font-medium text-slate-800">{user.name}</div>
                                <div className="text-xs text-slate-400">ID: {user.id}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            {role ? (
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                        role.type === RoleType.ADMIN 
                                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                            : role.type === RoleType.INDIVIDUAL
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : role.type === RoleType.PLATFORM_ADMIN
                                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {role.type === RoleType.ADMIN ? <Shield className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                                        {role.name}
                                    </span>
                                </div>
                            ) : <span className="text-red-500">角色未定义</span>}
                        </td>
                        {!isPlatformAdmin && (
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1.5">
                                    {(user.extraAppIds.length === 0 && user.extraPermissions.length === 0) ? (
                                        <span className="text-slate-400 text-xs italic">无额外权限</span>
                                    ) : (
                                        <>
                                            {user.extraPermissions.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {user.extraPermissions.map(pId => {
                                                        const p = SYSTEM_PERMISSIONS.find(sys => sys.id === pId);
                                                        return (
                                                            <span key={pId} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded">
                                                                <Key className="w-2.5 h-2.5" />
                                                                {p?.label}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                            {user.extraAppIds.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {user.extraAppIds.map(appId => {
                                                        const app = MOCK_APPS.find(a => a.id === appId);
                                                        return app ? (
                                                            <span key={appId} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded">
                                                                <Layers className="w-2.5 h-2.5" />
                                                                {app.name}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        )}
                        <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-primary-600 p-2 rounded-full hover:bg-slate-100 transition-colors" title={isPlatformAdmin ? "编辑员工" : "配置独立权限"}>
                                {isPlatformAdmin ? <Edit3 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                            </button>
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    );
}

const RoleSettings: React.FC<{onEdit: () => void}> = ({onEdit}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_ROLES.map(role => (
                <div key={role.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:border-primary-200 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${
                                 role.type === RoleType.ADMIN ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                             }`}>
                                 {role.type === RoleType.ADMIN ? <Shield className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                             </div>
                             <div>
                                 <h3 className="font-bold text-slate-800">{role.name}</h3>
                                 <span className="text-[10px] text-slate-400 uppercase tracking-wider">{role.type}</span>
                             </div>
                        </div>
                        <button onClick={onEdit} className="text-slate-300 hover:text-primary-600">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <p className="text-slate-500 text-xs mb-4 min-h-[32px]">{role.description}</p>
                    
                    <div className="space-y-3">
                        <div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                                <Key className="w-3 h-3" /> 功能权限
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {role.permissions.length > 0 ? role.permissions.map(pId => {
                                    const p = SYSTEM_PERMISSIONS.find(sys => sys.id === pId);
                                    return (
                                        <span key={pId} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-100">
                                            {p?.label}
                                        </span>
                                    );
                                }) : <span className="text-[10px] text-slate-400">无系统管理权限</span>}
                            </div>
                        </div>
                        
                        <div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                                <Layers className="w-3 h-3" /> 授权应用
                            </div>
                             <div className="flex flex-wrap gap-1.5">
                                {role.appIds.length > 0 ? role.appIds.map(appId => {
                                    const app = MOCK_APPS.find(a => a.id === appId);
                                    return app ? (
                                        <span key={appId} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-100">
                                            {app.name}
                                        </span>
                                    ) : null;
                                }) : <span className="text-[10px] text-slate-400">无应用访问权</span>}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
