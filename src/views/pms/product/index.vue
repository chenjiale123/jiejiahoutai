<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="hover">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button class="btn-add" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddProduct()">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60px" align="center" />
        <el-table-column label="商品id" width="100px" align="center">
          <template slot-scope="scope">{{ scope.row.goodsId }}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="100px" align="center">
          <template slot-scope="scope">
            <img min-width="70" height="70" :src="scope.row.pictures[0].path">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.goodsName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品类别" width="100px" align="center">
          <template slot-scope="scope">
            <p>{{ getGoodsType(scope.row.goodsTypeId) }}</p>
          </template>
        </el-table-column>
        <!--<el-table-column label="商品描述" width="100px" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<p>{{ scope.row.detail }}</p>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="商品详情" width="140px" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.goodsDesc }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="250px" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                v-model="scope.row.isShelf"
                :active-value="'0'"
                :inactive-value="'1'"
                disabled="true"
                @change="handleShelfStatusChange(scope.$index, scope.row)"
              />
              新品：
              <el-switch
                v-model="scope.row.isNew"
                :active-value="'0'"
                :inactive-value="'1'"
                disabled="true"
                @change="handleNewStatusChange(scope.$index, scope.row)"
              />
            </p>

            <p>推荐：
              <el-switch
                v-model="scope.row.isRecommend"
                :active-value="'0'"
                :inactive-value="'1'"
                disabled="true"
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
              />
              特价：
              <el-switch
                v-model="scope.row.isDiscount"
                :active-value="'0'"
                :inactive-value="'1'"
                disabled="true"
                @change="handleDiscountStatusChange(scope.$index, scope.row)"
              />
            </p>
            <p>限购：
              <el-switch
                v-model="scope.row.isLimited"
                :active-value="'0'"
                :inactive-value="'1'"
                disabled="true"
                @change="handleLimitedStatusChange(scope.$index, scope.row)"
              />
              促销：
              <el-switch
                v-model="scope.row.isPromotion"
                :active-value="'0'"
                :inactive-value="'1'"
                disabled="true"
                @change="handlePromotionStatusChange(scope.$index, scope.row)"
              />
            </p>
            <p>
              用券：
              <el-switch
                v-model="scope.row.isVoucher"
                :active-value="'0'"
                :inactive-value="'1'"
                disabled="true"
                @change="handleVoucherStatusChange(scope.$index, scope.row)"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="商品规格" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleShowSkuEditDialog(scope.$index, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="默认价格" width="100px" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.defaultPrice }}</p>
          </template>
        </el-table-column>
        <el-table-column label="限购数量" width="100px" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.limitNum }}</p>
          </template>
        </el-table-column>
        <el-table-column label="月销量" width="100px" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.monthSellCount }}</p>
          </template>
        </el-table-column>
        <el-table-column label="总销量" width="100px" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.totalSellCount }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.status === '0'?'正常':'无效' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <p>
              <el-button type="primary" @click="handleUpdateProduct(scope.$index, scope.row)">编辑</el-button>
            </p>
            <p>
              <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="修改商品规格信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="40%"
    >
      <span>商品id：</span>
      <span>{{ editSkuInfo.productId }}</span>
      <el-input v-model="editSkuInfo.keyword" placeholder="按sku编号搜索" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku" />
      </el-input>
      <el-table
        style="width: 100%;margin-top: 20px"
        :data="editSkuInfo.stockList"
        border
      >
        <el-table-column label="规格编号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.id" />
          </template>
        </el-table-column>
        <!--<el-table-column v-for="(item,index) in editSkuInfo.productAttr" :key="item.id" :label="item.name" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--{{ getProductSkuSp(scope.row,index) }}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="商品规格" width="160px" align="center">
          <template slot-scope="scope">
            {{ formatGoodsRule(scope.row.goodsRuleValue) }}
          </template>
        </el-table-column>
        <el-table-column label="规格图片" width="80" align="center">
          <template slot-scope="scope">
            <img min-width="70" height="70" :src="scope.row.picUrl">
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.salePrice" />
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="80" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stockNum" />
          </template>
        </el-table-column>
        <el-table-column label="商品状态" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.status === '0'?'正常':'失效' }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[editProductionInfo.dialogStatus]" :visible.sync="editProductionInfo.dialogVisible">
      <product-detail :is-edit="editProductionInfo.dialogStatus !== 'create'" :goods-id="editProductionInfo.goodsId" />
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsList, deleteGoods } from '@/api/production'
import { getGoodsTypeList } from '@/api/productionType'
import ProductDetail from './components/ProductDetail'
import { getProductAttributeList } from '@/api/productionAttribution'

const defaultListQuery = {
  cursor: 0,
  pageSize: 30
}
export default {
  components: { ProductDetail },
  data() {
    return {
      productAttributeList: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      listLoading: true,
      productionTypeList: [],
      editSkuInfo: {
        dialogVisible: false,
        productId: '',
        keyword: null,
        stockList: [],
        productAttr: []
      },
      textMap: {
        update: '编辑商品',
        create: '添加商品'
      },
      editProductionInfo: {
        dialogVisible: false,
        dialogStatus: '',
        goodsId: 0
      }
    }
  },
  created() {
    this.getProductAttributeList()
    this.getList()
    this.getProductionTypeList()
  },
  methods: {
    getProductAttributeList() {
      getProductAttributeList().then(response => {
        this.productAttributeList = response.data
      })
    },
    getList() {
      this.listLoading = true
      getGoodsList(this.listQuery).then(response => {
        this.list = response.data
        console.log(this.list)
        this.total = response.total
      })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    getProductionTypeList() {
      getGoodsTypeList().then(response => {
        this.productionTypeList = response.data
      })
    },
    getGoodsType(goodsTypeId) {
      const index = this.productionTypeList.findIndex(item => {
        return item.typeId === goodsTypeId
      })
      return this.productionTypeList[index].goodsTypeName
    },
    handleShowSkuEditDialog(index, row) {
      this.editSkuInfo.dialogVisible = true
      this.editSkuInfo.productId = row.goodsId
      this.editSkuInfo.stockList = row.goodsRuleDetailDos
    },
    handleDelete(index, row) {
      const query = {
        goodsId: row.goodsId
      }
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(query).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
        })
        if (index >= 0) {
          this.list.splice(index, 1)
        }
      })
    },
    handleAddProduct() {
      this.editProductionInfo.dialogVisible = true
      this.editProductionInfo.dialogStatus = 'create'
      this.editProductionInfo.goodsId = 0
    },
    handleUpdateProduct(index, row) {
      this.editProductionInfo.dialogVisible = true
      this.editProductionInfo.dialogStatus = 'update'
      this.editProductionInfo.goodsId = row.goodsId
    },
    formatGoodsRule(value) {
      let result = ' '
      if (value !== null && this.productAttributeList !== undefined) {
        const goodsTypeList = value.split(',')
        for (let i = 0; i < goodsTypeList.length; i++) {
          const fatherId = goodsTypeList[i].split(':')[0]
          const typeId = goodsTypeList[i].split(':')[1]
          for (let j = 0; j < this.productAttributeList.length; j++) {
            if (Number(fatherId) === this.productAttributeList[j].id) {
              result += this.productAttributeList[j].name + ':'
              for (let k = 0; k < this.productAttributeList[j].goodsAttrDos.length; k++) {
                if (Number(typeId) === this.productAttributeList[j].goodsAttrDos[k].id) {
                  result += this.productAttributeList[j].goodsAttrDos[k].name + ' '
                  break
                }
              }
              break
            }
          }
        }
      }
      return result
    }
  }
}
</script>

<style scoped>

</style>
