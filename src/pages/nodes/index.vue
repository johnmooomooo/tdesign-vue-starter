<template>
  <div class="list-common-table">
    <t-form
      :data="formData"
      :label-width="80"
      colon
      @reset="onReset"
      @submit="onSubmit"
      :style="{ marginBottom: '8px' }"
    >
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[16, 24]">
            <t-col :flex="1">
              <t-form-item label="域名" name="domain">
                <t-input v-model="formData.domain" placeholder="域名/关键字" type="search" />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="区域" name="region">
                <t-select v-model="formData.region" :options="regionOptions" placeholder="选择区域" />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="状态" name="status">
                <t-select v-model="formData.status" :options="statusOptions" placeholder="选择状态" />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="submit"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        :data="data"
        :columns="columns"
        :rowKey="rowKey"
        :verticalAlign="verticalAlign"
        :hover="hover"
        :pagination="pagination"
        @page-change="rehandlePageChange"
        :loading="dataLoading"
      >
        <template #status="{ row }">
          <t-tag v-if="row.status === 'running'" theme="success" variant="light">运行中</t-tag>
          <t-tag v-if="row.status === 'stopped'" theme="default" variant="light">已停止</t-tag>
          <t-tag v-if="row.status === 'error'" theme="danger" variant="light">异常</t-tag>
          <t-tag v-if="row.status === 'initializing'" theme="warning" variant="light">初始化</t-tag>
        </template>

        <template #op="slotProps">
          <a class="t-button-link" @click="goDetail(slotProps.row)">详情</a>
          <a class="t-button-link" @click="rebootNode(slotProps.row)">重启</a>
          <a class="t-button-link" @click="rotateUuid(slotProps.row)">换 UUID</a>
          <a class="t-button-link" @click="confirmDelete(slotProps.row, slotProps.rowIndex)">删除</a>
        </template>
      </t-table>

      <t-dialog header="确认删除当前所选节点？" :visible.sync="confirmVisible" @confirm="onConfirmDelete">
        删除后该节点将被移除且无法恢复。
      </t-dialog>
    </div>
  </div>
</template>

<script>
import { prefix } from '@/config/global';

export default {
  name: 'NodesList',
  data() {
    return {
      prefix,
      formData: { domain: '', region: undefined, status: undefined },
      regionOptions: [],
      statusOptions: [
        { label: '运行中', value: 'running' },
        { label: '已停止', value: 'stopped' },
        { label: '异常', value: 'error' },
        { label: '初始化', value: 'initializing' },
      ],
      data: [],
      dataLoading: false,
      columns: [
        { title: '域名', colKey: 'domain', width: 220, ellipsis: true },
        { title: '区域', colKey: 'region', width: 160 },
        { title: 'IPv4', colKey: 'ipv4', width: 160 },
        { title: '状态', colKey: 'status', width: 120, cell: { col: 'status' } },
        { title: '证书到期', colKey: 'certExpire', width: 140 },
        { title: '最后检查', colKey: 'lastCheck', width: 180 },
        { title: '操作', colKey: 'op', fixed: 'right', width: 260 },
      ],
      rowKey: 'index',
      verticalAlign: 'top',
      hover: true,
      pagination: { pageSize: 20, total: 0, current: 1 },
      confirmVisible: false,
      deleteIdx: -1,
      deleteRow: null,
    };
  },
  mounted() {
    // 简单地区选项示例（可改为动态）
    this.regionOptions = [
      { label: '北京', value: '北京' },
      { label: '上海', value: '上海' },
      { label: '广东', value: '广东' },
    ];

    this.fetchData();
  },
  methods: {
    fetchData(page = this.pagination.current) {
      this.dataLoading = true;
      const params = {
        page,
        pageSize: this.pagination.pageSize,
        domain: this.formData.domain || undefined,
        region: this.formData.region || undefined,
        status: this.formData.status || undefined,
      };
      this.$request
        .get('/api/nodes-list', { params })
        .then((res) => {
          if (res.code === 0) {
            const list = res.data?.list || [];
            this.data = list;
            this.pagination.total = res.data?.total || list.length;
            this.pagination.current = page;
          }
        })
        .catch((e) => console.error(e))
        .finally(() => {
          this.dataLoading = false;
        });
    },
    onReset() {
      this.formData = { domain: '', region: undefined, status: undefined };
      this.fetchData();
    },
    onSubmit() {
      // 简单前端过滤示例
      const { domain, region, status } = this.formData;
      const filtered = (this.data || []).filter((r) => {
        if (domain && !r.domain.includes(domain)) return false;
        if (region && r.region !== region) return false;
        if (status && r.status !== status) return false;
        return true;
      });
      this.pagination.total = filtered.length;
      this.data = filtered;
    },
    rehandlePageChange(curr) {
      this.fetchData(curr.current || curr);
    },
    goDetail(row) {
      this.$router.push(`/nodes/${row.index}/overview`);
    },
    rebootNode(row) {
      this.$message.info(`请求重启节点 ${row.domain}`);
    },
    rotateUuid(row) {
      this.$message.info(`请求更换 UUID: ${row.domain}`);
    },
    confirmDelete(row, idx) {
      this.deleteIdx = idx;
      this.deleteRow = row;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      if (this.deleteIdx > -1) {
        this.data.splice(this.deleteIdx, 1);
        this.pagination.total = this.data.length;
        this.$message.success('删除成功');
      }
      this.confirmVisible = false;
      this.deleteIdx = -1;
      this.deleteRow = null;
    },
  },
};
</script>

<style lang="less" scoped>
@import '@/style/variables.less';

.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 20px;
  border-radius: var(--td-radius-default);
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
