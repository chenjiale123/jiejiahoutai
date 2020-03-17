<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="商品ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品月销量" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.monthSellCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品总销量" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.totalSellCount }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="商品详情" align="center" width="150px" class-name="small-padding fixed-width">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.detail }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="是否新品" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isNew !== '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否特价" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isDiscount !== '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isRecommend !== '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否用券" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isVoucher !== '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否促销" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isPromotion !== '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否限购" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isLimited !== '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否上架" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isShelf !== '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="限购数量" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.limitNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品默认价格" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{ scope.row.defaultPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品规格" align="center" width="1100px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>
            <el-table
              max-height="250px"
              :data="scope.row.goodsRuleDetailDos"
              border
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column label="规格id" align="center" width="150px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="规格信息" align="center" width="150px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>{{ scope.row.goodsRuleValue }}</span>
                </template>
              </el-table-column>
              <el-table-column label="销售价格" align="center" width="150px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>{{ scope.row.salePrice }}</span>
                </template>
              </el-table-column>
              <el-table-column label="库存数量" align="center" width="150px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>{{ scope.row.stockNum }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" width="150px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品状态" align="center" width="150px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === '0'">正常</span>
                  <span v-if="scope.row.status !== '0'">失效</span>
                </template>
              </el-table-column>
              <el-table-column label="图片" align="center" width="150px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>
                    <img :src="scope.row.picUrl" min-width="70" height="70">
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </span>
        </template>>
      </el-table-column>
      <el-table-column label="图片" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>
            <img v-for="item in scope.row.pictures" :src="item.path" min-width="70" height="70">
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane label="商品信息" name="production">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
            <el-form-item label="默认价格" prop="defaultPrice">
              <el-input v-model="temp.defaultPrice" />
            </el-form-item>
            <el-form-item label="商品详情" prop="detail">
              <el-input v-model="temp.detail" />
            </el-form-item>
            <el-form-item label="商品描述" prop="goodsDesc">
              <el-input v-model="temp.goodsDesc" />
            </el-form-item>
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="temp.goodsName" />
            </el-form-item>
            <el-form-item label="商品类型id" prop="goodsTypeId">
              <el-input v-model="temp.goodsTypeId" />
            </el-form-item>
            <el-form-item label="是否特价" prop="isDiscount">
              <el-input v-model="temp.isDiscount" />
            </el-form-item>
            <el-form-item label="是否限购" prop="isLimited">
              <el-input v-model="temp.isLimited" />
            </el-form-item>
            <el-form-item label="是否新品" prop="isNew">
              <el-input v-model="temp.isNew" />
            </el-form-item>
            <el-form-item label="是否促销" prop="isPromotion">
              <el-input v-model="temp.isPromotion" />
            </el-form-item>
            <el-form-item label="是否推荐" prop="isRecommend">
              <el-input v-model="temp.isRecommend" />
            </el-form-item>
            <el-form-item label="是否上架" prop="isShelf">
              <el-input v-model="temp.isShelf" />
            </el-form-item>
            <el-form-item label="是否用券" prop="isVoucher">
              <el-input v-model="temp.isVoucher" />
            </el-form-item>
            <el-form-item label="限购数量" prop="limitNum">
              <el-input v-model="temp.limitNum" />
            </el-form-item>
            <el-form-item label="图标组id" prop="picGroupId">
              <el-input v-model="temp.picGroupId" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="商品规格" name="productionType">
          <el-form ref="productionType" :rules="productionTypeTempRules" :model="productionTypeTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
            <el-form-item label="规格键值对" prop="goodsRuleValue">
              <el-input v-model="productionTypeTemp.goodsRuleValue" />
            </el-form-item>
            <el-form-item label="图片组id" prop="productionType_picGroupId">
              <el-input v-model="productionTypeTemp.picGroupId" />
            </el-form-item>
            <el-form-item label="销售价格" prop="salePrice">
              <el-input v-model="productionTypeTemp.salePrice" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-input v-model="productionTypeTemp.status" />
            </el-form-item>
            <el-form-item label="库存" prop="stockNum">
              <el-input v-model="productionTypeTemp.stockNum" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { getGoodsList, addGoods, deleteGoods, updateGoods } from '@/api/production'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      activeName: 'production',
      tableKey: 0,
      list: [],
      total: 30,
      listLoading: true,
      listQuery: {
        page: 1,
        cursor: 0,
        pageSize: 10
      },
      productionTypeTemp: {
        goodsRuleValue: '',
        picGroupId: '',
        salePrice: '',
        status: '',
        stockNum: 0
      },
      temp: {
        goodsId: '',
        defaultPrice: '',
        detail: '',
        goodsDesc: '',
        goodsName: '',
        goodsRuleDetailDos: [],
        goodsTypeId: 0,
        isDiscount: '',
        isLimited: '',
        isNew: '',
        isPromotion: '',
        isRecommend: '',
        isShelf: '',
        isVoucher: '',
        limitNum: 0,
        picGroupId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        defaultPrice: [{ required: true, message: 'defaultPrice is required', trigger: 'blur' }],
        detail: [{ required: true, message: 'detail is required', trigger: 'blur' }],
        goodsDesc: [{ required: true, message: 'goodsDesc is required', trigger: 'blur' }],
        goodsName: [{ required: true, message: 'goodsName is required', trigger: 'blur' }],
        goodsRuleDetailDos: [{ required: true, message: 'goodsRuleDetailDtos is required', trigger: 'blur' }],
        goodsTypeId: [{ required: true, message: 'goodsTypeId is required', trigger: 'blur' }],
        isDiscount: [{ required: true, message: 'isDiscount is required', trigger: 'blur' }],
        isLimited: [{ required: true, message: 'isLimited is required', trigger: 'blur' }],
        isNew: [{ required: true, message: 'isNew is required', trigger: 'blur' }],
        isPromotion: [{ required: true, message: 'isPromotion is required', trigger: 'blur' }],
        isRecommend: [{ required: true, message: 'isRecommend is required', trigger: 'blur' }],
        isShelf: [{ required: true, message: 'isShelf is required', trigger: 'blur' }],
        isVoucher: [{ required: true, message: 'isVoucher is required', trigger: 'blur' }],
        limitNum: [{ required: true, message: 'limitNum is required', trigger: 'blur' }],
        picGroupId: [{ required: true, message: 'picGroupId is required', trigger: 'blur' }]
      },
      productionTypeTempRules: {
        salePrice: [{ required: true, message: 'salePrice is required', trigger: 'blur' }],
        stockNum: [{ required: true, message: 'stockNum is required', trigger: 'blur' }],
        // productionType_picGroupId: [{ required: true, message: 'productionType_picGroupId is required', trigger: 'blur' }],
        status: [{ required: true, message: 'status is required', trigger: 'blur' }],
        goodsRuleValue: [{ required: true, message: 'goodsRuleValue is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGoodsList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
      })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.productionTypeTemp = Object.assign({}, this.temp.goodsRuleDetailDos[0])
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['productionType'].clearValidate()
      })
    },
    updateData() {
      this.$refs['productionType'].validate((valid) => {
        if (valid) {
          this.temp.goodsRuleDetailDos = []
          this.temp.goodsRuleDetailDos.push(this.productionTypeTemp)
        }
      })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const query = {
          //   goodsId: this.temp.goodsId
          // }
          const data = {
            goodsId: this.temp.goodsId,
            defaultPrice: this.temp.defaultPrice,
            detail: this.temp.detail,
            goodsDesc: this.temp.goodsDesc,
            goodsName: this.temp.goodsName,
            goodsRuleDetailDtos: [{
              goodsRuleValue: this.temp.goodsRuleDetailDos[0].goodsRuleValue,
              picGroupId: this.temp.goodsRuleDetailDos[0].picGroupId,
              salePrice: this.temp.goodsRuleDetailDos[0].salePrice,
              status: this.temp.goodsRuleDetailDos[0].status,
              stockNum: this.temp.goodsRuleDetailDos[0].stockNum
            }],
            goodsTypeId: this.temp.goodsTypeId,
            isDiscount: this.temp.isDiscount,
            isLimited: this.temp.isLimited,
            isNew: this.temp.isNew,
            isPromotion: this.temp.isPromotion,
            isRecommend: this.temp.isRecommend,
            isShelf: this.temp.isShelf,
            isVoucher: this.temp.isVoucher,
            limitNum: this.temp.limitNum,
            picGroupId: this.temp.picGroupId
          }
          updateGoods(data).then(() => {
            const tempData = Object.assign({}, this.temp)
            for (const v of this.list) {
              if (v.goodsId === this.temp.goodsId) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, tempData)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      const query = {
        goodsId: row.goodsId
      }
      deleteGoods(query).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
      console.log(row.goodsId)
      const index = this.list.indexOf(row)
      if (index >= 0) {
        this.list.splice(index, 1)
      }
    },
    resetTemp() {
      this.temp = {
        id: '',
        defaultPrice: '',
        detail: '',
        goodsDesc: '',
        goodsName: '',
        goodsRuleDetailDos: [],
        goodsTypeId: 0,
        isDiscount: '',
        isLimited: '',
        isNew: '',
        isPromotion: '',
        isRecommend: '',
        isShelf: '',
        isVoucher: '',
        limitNum: 0,
        picGroupId: ''
      }
      this.productionTypeTemp = {
        goodsRuleValue: '',
        picGroupId: '',
        salePrice: '',
        status: '',
        stockNum: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['productionType'].clearValidate()
      })
    },
    createData() {
      this.$refs['productionType'].validate((valid) => {
        if (valid) {
          this.temp.goodsRuleDetailDos.push(this.productionTypeTemp)
        }
      })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addGoods(this.temp).then(response => {
            this.temp.id = response.data
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'information']
          const filterVal = ['id', 'information']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

<style scoped>

</style>
