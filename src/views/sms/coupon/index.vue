<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="couponTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="优惠劵名称" align="center">
          <template slot-scope="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column label="优惠券描述" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.couponDescribe }}</template>
        </el-table-column>
        <el-table-column label="优惠券数量" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.couponSum }}</template>
        </el-table-column>
        <el-table-column label="优惠券类型" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.couponType | formatType }}</template>
        </el-table-column>
        <el-table-column label="优惠券折扣" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.discount }}</template>
        </el-table-column>
        <el-table-column label="可使用用户" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.userType | formatUserType }}</template>
        </el-table-column>
        <el-table-column label="可使用商品" width="100" align="center">
          <template slot-scope="scope">{{ formatLimitType(scope.row.limitType, scope.$index) }}</template>
        </el-table-column>
        <el-table-column label="使用门槛" width="140" align="center">
          <template slot-scope="scope">满{{ scope.row.miniConsumption }}元可用</template>
        </el-table-column>
        <el-table-column label="面值" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.preferentialCash }}元</template>
        </el-table-column>
        <el-table-column label="有效期" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.beginTime|formatDate }}至{{ scope.row.endTime|formatDate }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.outOfDate | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="100" align="center">
          <template slot-scope="scope"><el-switch v-model="scope.row.status" :active-value="'0'" disabled="true" :inactive-value="'1'" /></template>
        </el-table-column>
        <el-table-column label="是否使用" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.isUsed | formatUsedStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleView(scope.$index, scope.row)">查看(暂未开通)</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="textMap[editCouponInfo.dialogStatus]" :visible.sync="editCouponInfo.dialogVisible">
        <coupon-detail :is-edit="editCouponInfo.dialogStatus !== 'create'" :coupon-id="editCouponInfo.couponId" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getCouponList, deleteCoupon } from '@/api/coupon'
import CouponDetail from './components/CouponDetail'
import { formatDate } from '@/utils/date'
import { getGoodsTypeList } from '@/api/productionType'

export default {
  name: 'Index',
  components: { CouponDetail },
  filters: {
    formatType(value) {
      if (value === '0') {
        return '折扣券'
      }
      if (value === '1') {
        return '现金券'
      }
    },
    formatStatus(value) {
      if (value === '0') {
        return '正常'
      }
      if (value === '1') {
        return '失效'
      }
    },
    formatUserType(value) {
      if (value === '0') {
        return '不限用户'
      }
      if (value === '1') {
        return '新人用户'
      }
    },
    formatUsedStatus(value) {
      if (value === '0') {
        return '未使用'
      }
      if (value === '1') {
        return '已使用'
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
      goodsTypeList: null,
      list: null,
      total: null,
      listLoading: false,
      textMap: {
        update: '编辑优惠券',
        create: '添加优惠券'
      },
      editCouponInfo: {
        dialogVisible: false,
        dialogStatus: '',
        couponId: 0
      }
    }
  },
  created() {
    this.getProductTypeList()
    this.getList()
  },
  methods: {
    formatLimitType(limitType, index) {
      let result = ' '
      if (limitType !== null) {
        const typeList = limitType.split(',')
        for (let i = 0; i < typeList.length; i++) {
          for (let j = 0; j < this.goodsTypeList.length; j++) {
            if (Number(typeList[i]) === this.goodsTypeList[j].typeId) {
              result += this.goodsTypeList[j].goodsTypeName + ' '
              break
            }
          }
        }
        return result
      }
    },
    getProductTypeList() {
      getGoodsTypeList().then(response => {
        this.goodsTypeList = response.data
      })
    },
    getList() {
      this.listLoading = true
      getCouponList().then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.total
      })
    },
    handleAdd() {
      this.editCouponInfo.dialogVisible = true
      this.editCouponInfo.dialogStatus = 'create'
      this.editCouponInfo.couponId = 0
    },
    handleUpdate(index, row) {
      this.editCouponInfo.dialogVisible = true
      this.editCouponInfo.dialogStatus = 'update'
      this.editCouponInfo.couponId = row.id
    },
    handleDelete(index, row) {
      this.$confirm('是否进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = {
          couponId: row.id
        }
        deleteCoupon(query).then(response => {
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
