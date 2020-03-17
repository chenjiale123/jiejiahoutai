<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="bannerTable" v-loading="listLoading" :data="list" style="width: 100%;" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.bannerId }}</template>
        </el-table-column>
        <el-table-column label="轮播类型" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.bannerType |formatType }}</template>
        </el-table-column>
        <el-table-column label="类别图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 70px" :src="scope.row.picUrl"></template>
        </el-table-column>
        <el-table-column label="权重" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.orderNum }}</template>
        </el-table-column>
        <el-table-column label="轮播位置" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.position |formatPosition }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.status |formatStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="textMap[editBannerInfo.dialogStatus]" :visible.sync="editBannerInfo.dialogVisible">
        <banner-detail :is-edit="editBannerInfo.dialogStatus !== 'create'" :banner-id="editBannerInfo.bannerId" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getBannerList, deleteBanner } from '@/api/banner'
import BannerDetail from './components/BannerDetail'
export default {
  name: 'Index',
  components: { BannerDetail },
  filters: {
    formatType(value) {
      if (value === '0') {
        return '活动'
      } else if (value === '1') {
        return '商品'
      } else if (value === '2') {
        return '课程'
      } else {
        return '未知'
      }
    },
    formatPosition(value) {
      if (value === '0') {
        return '首页轮播'
      } else if (value === '1') {
        return '商城'
      } else if (value === '2') {
        return '活动'
      } else {
        return '未知'
      }
    },
    formatStatus(value) {
      if (value === '0') {
        return '正常'
      } else if (value === '1') {
        return '不可用'
      } else if (value === '2') {
        return '删除'
      }
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      textMap: {
        update: '编辑轮播',
        create: '添加轮播'
      },
      editBannerInfo: {
        dialogVisible: false,
        dialogStatus: '',
        bannerId: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getBannerList().then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.total
      })
    },
    handleAdd() {
      this.editBannerInfo.dialogVisible = true
      this.editBannerInfo.dialogStatus = 'create'
      this.editBannerInfo.bannerId = 0
    },
    handleUpdate(index, row) {
      this.editBannerInfo.dialogVisible = true
      this.editBannerInfo.dialogStatus = 'update'
      this.editBannerInfo.bannerId = row.bannerId
    },
    handleDelete(index, row) {
      this.$confirm('是否进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = {
          bannerId: row.bannerId
        }
        deleteBanner(query).then(response => {
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
