<template>
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createDate)" />
        <el-step title="支付订单" :description="formatTime(order.tranTime)" />
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)" />
        <el-step title="确认收货" :description="formatTime(order.receiveTime)" />
        <el-step title="完成评价" :description="formatTime(order.commentTime)" />
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px" />
        <span class="color-danger">当前订单状态：{{ order.status | formatStatus }}</span>
        <div v-show="order.status==='0'" class="operate-button-container">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini">修改商品信息</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showCloseOrderDialog">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div v-show="order.status==='1'" class="operate-button-container">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini">取消订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div v-show="order.status==='2'||order.status==='3'" class="operate-button-container">
          <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div v-show="order.status==='4'" class="operate-button-container">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ order.id }}</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{ order.contactName }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.payType | formatPayType }}</el-col>
          <el-col :span="4" class="table-cell">app订单</el-col>
          <el-col :span="4" class="table-cell">正常订单</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">配送方式</el-col>
          <el-col :span="4" class="table-cell-title">物流单号</el-col>
          <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
          <el-col :span="4" class="table-cell-title">订单可得优币</el-col>
          <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
          <el-col :span="4" class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">默认10天</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover placement="top-start" title="活动信息" width="200" trigger="hover" :content="order.promotionInfo">
              <span slot="reference">暂无活动</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ order.contactName }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.contactPhone }}</el-col>
          <el-col :span="6" class="table-cell">暂无</el-col>
          <el-col :span="6" class="table-cell">{{ order | formatAddress }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">商品信息</span>
      </div>
      <el-table ref="orderItemTable" :data="order.orderGoodsDos" style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.goodsImgPath" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.goodsName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{ scope.row.price }}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{ formatProductAttr(scope.row.goodsRuleValue) }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.goodsNum }}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{ scope.row.price*scope.row.goodsNum }}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券id</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{ order.totalPrice }}</el-col>
          <el-col :span="6" class="table-cell">暂无</el-col>
          <el-col :span="6" class="table-cell">{{ order.voucherId }}</el-col>
          <el-col :span="6" class="table-cell">暂无</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">暂无</el-col>
          <el-col :span="6" class="table-cell">暂无</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.totalPrice }}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.payAmount }}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">操作信息</span>
      </div>
      <el-table
        ref="orderHistoryTable"
        style="margin-top: 20px;width: 100%"
        :data="order.historyList"
        border
      >
        <el-table-column label="操作者" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.operateMan }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="160" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatPayStatus }}
          </template>
        </el-table-column>
        <el-table-column label="发货状态" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderStatus | formatDeliverStatus }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{ scope.row.note }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date'
import { getOrderByOrderId } from '@/api/order'
import { getProductAttributeList } from '@/api/productionAttribution'

export default {
  name: 'OrderDetail',
  filters: {
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
    formatAddress(order) {
      let str = order.province
      str += '  ' + order.city
      str += '  ' + order.district
      if (order.addressdetail !== null) {
        str += '  ' + order.addressdetail
      }
      return str
    }
  },
  props: {
    orderId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      order: {},
      productAttributeList: []
    }
  },
  watch: {
    orderId: function(newValue) {
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.getOrder()
    }
  },
  created() {
    this.getOrder()
    this.getProductAttributeList()
  },
  methods: {
    getProductAttributeList() {
      getProductAttributeList().then(response => {
        this.productAttributeList = response.data
      })
    },
    getOrder() {
      const query = {
        orderId: this.orderId
      }
      getOrderByOrderId(query).then(response => {
        this.order = response.data
      })
    },
    formatTime(time) {
      if (time == null || time === '') {
        return ''
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatStepStatus(value) {
      if (value === '1') {
        // 待发货
        return 2
      } else if (value === '2') {
        // 已发货
        return 3
      } else if (value === '3') {
        // 已完成
        return 4
      } else if (value === '0' || value === '4') {
        // 待付款、已关闭、无效订单、退款/售后
        return 1
      }
    },
    formatProductAttr(value) {
      if (value === null) {
        return ''
      } else {
        let result = ''
        const attr = value.split(',')
        for (let i = 0; i < attr.length; i++) {
          const fatherId = attr[i].split(':')[0]
          const typeId = attr[i].split(':')[1]
          for (let j = 0; j < this.productAttributeList.length; j++) {
            if (this.productAttributeList[j].id === Number(fatherId)) {
              result += this.productAttributeList[j].name + ':'
              for (let k = 0; k < this.productAttributeList[j].goodsAttrDos.length; k++) {
                if (Number(typeId) === this.productAttributeList[j].goodsAttrDos[k].id) {
                  result += this.productAttributeList[j].goodsAttrDos[k].name + ';'
                  break
                }
              }
              break
            }
          }
        }
        return result
      }
    }
  }
}
</script>

<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>
