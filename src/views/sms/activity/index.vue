<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="activityTable" v-loading="listLoading" :data="list" style="width: 100%;" border>
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="活动标题" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="活动图片" align="center">
          <template slot-scope="scope"><img :src="scope.row.path" width="70px" height="70px"></template>
        </el-table-column>
        <el-table-column label="活动链接" align="center">
          <template slot-scope="scope"><a :href="scope.row.linkUrl">点击跳转</a> </template>
        </el-table-column>
        <el-table-column label="权重" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.orderNum }}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDate }}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.updateTime | formatDate }}</template>
        </el-table-column>
        <el-table-column label="活动状态" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.status |formatActiveStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectSession(scope.$index, scope.row)"
            >设置商品(暂未开放)
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="textMap[editActivityInfo.dialogStatus]" :visible.sync="editActivityInfo.dialogVisible">
        <activity-detail :is-edit="editActivityInfo.dialogStatus !== 'create'" :id="editActivityInfo.id" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getActivitylist, deleteActivity } from '@/api/activity'
import { formatDate } from '@/utils/date'
import ActivityDetail from './components/ActivityDetail'

export default {
  name: 'Index',
  components: { ActivityDetail },
  filters: {
    formatActiveStatus(value) {
      if (value === '0') {
        return '正常'
      } else if (value === '1') {
        return '无效'
      } else if (value === '2') {
        return '删除'
      }
    },
    formatDate(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      textMap: {
        update: '编辑活动',
        create: '添加活动'
      },
      editActivityInfo: {
        dialogVisible: false,
        dialogStatus: '',
        id: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getActivitylist().then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.total
      })
    },
    handleAdd() {
      this.editActivityInfo.dialogVisible = true
      this.editActivityInfo.dialogStatus = 'create'
      this.editActivityInfo.id = 0
    },
    handleUpdate(index, row) {
      this.editActivityInfo.dialogVisible = true
      this.editActivityInfo.dialogStatus = 'update'
      this.editActivityInfo.id = row.id
    },
    handleDelete(index, row) {
      this.$confirm('是否进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = {
          id: row.id
        }
        deleteActivity(query).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
