<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" v-loading="listLoading" :data="list" style="width: 100%;" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column label="订单编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.createDate | formatCreateTime }}</template>
        </el-table-column>
        <el-table-column label="用户id" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.userId }}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{ scope.row.contactName }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template slot-scope="scope">￥{{ scope.row.totalPrice }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.payType | formatPayType }}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleViewOrder(scope.$index, scope.row)">查看订单</el-button>
            <el-button v-show="scope.row.status==='0'" size="mini" @click="handleDeleteOrder(scope.$index, scope.row)">删除订单</el-button>
            <el-button v-show="scope.row.status==='1'" size="mini" @click="handleDeliveryOrder(scope.$index, scope.row)">订单发货</el-button>
            <el-button v-show="scope.row.status==='2'" size="mini" @click="handleViewLogistics(scope.$index, scope.row)">
              订单跟踪
            </el-button>
            <el-button v-show="scope.row.status==='3'" size="mini">订单评价</el-button>
            <el-button v-show="scope.row.status==='4'" size="mini" type="danger">订单退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="textMap[orderInfo.dialogStatus]" :visible.sync="orderInfo.dialogVisible" align="center">
      <order-detail :order-id="orderInfo.orderId" />
    </el-dialog>
  </div>
</template>

<script>
import { getAllOrder } from '@/api/order'
import { formatDate } from '@/utils/date'
import OrderDetail from './orderDetail'

const defaultListQuery = {
  cursor: 0,
  pageSize: 5
}
export default {
  name: 'Index',
  components: { OrderDetail },
  filters: {
    formatCreateTime(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatPayType(value) {
      if (value === '1') {
        return '支付宝'
      } else if (value === '0') {
        return '微信'
      } else if (value === '2') {
        return '余额'
      } else {
        return '未支付'
      }
    },
    formatStatus(value) {
      if (value === '1') {
        return '待发货'
      } else if (value === '2') {
        return '待收货'
      } else if (value === '3') {
        return '评价'
      } else if (value === '4') {
        return '退款/售后'
      } else if (value === '0') {
        return '待付款'
      } else {
        return '无效订单'
      }
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      textMap: {
        orderInfo: '订单详情'
      },
      orderInfo: {
        dialogVisible: false,
        dialogStatus: '',
        orderId: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAllOrder().then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.total
      })
    },
    handleViewOrder(index, row) {
      this.orderInfo.dialogVisible = true
      this.orderInfo.dialogStatus = 'orderInfo'
      this.orderInfo.orderId = row.id
    }
  }
}
</script>

<style scoped>

</style>
