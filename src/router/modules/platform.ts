import Layout from '@/layouts/index.vue';
// use string icon identifiers in meta to avoid icon type imports

export default [
  {
    path: '/nodes',
    name: 'nodes',
    component: Layout,
    redirect: '/nodes',
    meta: { title: '节点管理', icon: 'server' },
    children: [
      {
        path: '',
        name: 'NodesList',
        component: () => import('@/pages/nodes/index.vue'),
        meta: { title: '列表' },
      },
      {
        path: 'new',
        name: 'NodeCreate',
        component: () => import('@/pages/nodes/new/index.vue'),
        meta: { title: '新建节点' },
      },
      {
        path: ':id',
        name: 'NodeLayout',
        component: () => import('@/pages/nodes/layout/index.vue'),
        meta: { title: '节点详情' },
        children: [
          { path: '', redirect: 'overview' },
          {
            path: 'overview',
            name: 'NodeOverview',
            component: () => import('@/pages/nodes/overview/index.vue'),
            meta: { title: '概览' },
          },
          {
            path: 'connection',
            name: 'NodeConnection',
            component: () => import('@/pages/nodes/connection/index.vue'),
            meta: { title: '连接信息' },
          },
          {
            path: 'metrics',
            name: 'NodeMetrics',
            component: () => import('@/pages/nodes/metrics/index.vue'),
            meta: { title: '指标' },
          },
          {
            path: 'logs',
            name: 'NodeLogs',
            component: () => import('@/pages/nodes/logs/index.vue'),
            meta: { title: '日志' },
          },
          {
            path: 'tasks',
            name: 'NodeTasks',
            component: () => import('@/pages/nodes/tasks/index.vue'),
            meta: { title: '任务历史' },
          },
          {
            path: 'settings',
            name: 'NodeSettings',
            component: () => import('@/pages/nodes/settings/index.vue'),
            meta: { title: '设置' },
          },
        ],
      },
    ],
  },

  {
    path: '/observability',
    name: 'observability',
    component: Layout,
    redirect: '/observability/traefik',
    meta: { title: '日志与指标', icon: 'chart' },
    children: [
      {
        path: 'traefik',
        name: 'TraefikMetrics',
        component: () => import('@/pages/observability/traefik/index.vue'),
        meta: { title: 'Traefik 指标' },
      },
      {
        path: 'xray',
        name: 'XrayMetrics',
        component: () => import('@/pages/observability/xray/index.vue'),
        meta: { title: 'Xray 指标' },
      },
      {
        path: 'logs',
        name: 'LogsExplorer',
        component: () => import('@/pages/observability/logs/index.vue'),
        meta: { title: '日志浏览' },
      },
    ],
  },

  {
    path: '/automation',
    name: 'automation',
    component: Layout,
    redirect: '/automation',
    meta: { title: '自动化任务', icon: 'task' },
    children: [
      {
        path: '',
        name: 'TasksList',
        component: () => import('@/pages/automation/index.vue'),
        meta: { title: '任务列表' },
      },
      {
        path: 'schedules',
        name: 'Schedules',
        component: () => import('@/pages/automation/schedules/index.vue'),
        meta: { title: '计划任务' },
      },
    ],
  },

  {
    path: '/users',
    name: 'users',
    component: Layout,
    redirect: '/users',
    meta: { title: '用户与权限', icon: 'user-group', role: ['Owner', 'Admin'] },
    children: [
      { path: '', name: 'UsersList', component: () => import('@/pages/users/index.vue'), meta: { title: '用户管理' } },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/pages/users/roles/index.vue'),
        meta: { title: '角色与权限', role: ['Owner'] },
      },
    ],
  },

  {
    path: '/audit',
    name: 'audit',
    component: Layout,
    redirect: '/audit',
    meta: { title: '审计日志', icon: 'history', role: ['Owner', 'Admin'] },
    children: [
      { path: '', name: 'AuditTable', component: () => import('@/pages/audit/index.vue'), meta: { title: '审计日志' } },
    ],
  },

  {
    path: '/integrations',
    name: 'integrations',
    component: Layout,
    redirect: '/integrations/cloudflare',
    meta: { title: '通知与集成', icon: 'api', role: ['Owner', 'Admin'] },
    children: [
      {
        path: 'cloudflare',
        name: 'CFSettings',
        component: () => import('@/pages/integrations/cloudflare/index.vue'),
        meta: { title: 'Cloudflare' },
      },
      {
        path: 'aws',
        name: 'AWSSettings',
        component: () => import('@/pages/integrations/aws/index.vue'),
        meta: { title: 'AWS' },
      },
      {
        path: 'telegram',
        name: 'TGSettings',
        component: () => import('@/pages/integrations/telegram/index.vue'),
        meta: { title: 'Telegram' },
      },
      {
        path: 'webhook',
        name: 'WebhookSettings',
        component: () => import('@/pages/integrations/webhook/index.vue'),
        meta: { title: 'Webhook', hidden: true },
      },
    ],
  },

  {
    path: '/settings',
    name: 'settings',
    component: Layout,
    redirect: '/settings',
    meta: { title: '系统设置', icon: 'setting', role: ['Owner'] },
    children: [
      {
        path: '',
        name: 'SystemSettings',
        component: () => import('@/pages/settings/index.vue'),
        meta: { title: '系统设置' },
      },
    ],
  },
];
