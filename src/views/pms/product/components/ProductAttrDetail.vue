<template>
  <div style="margin-top: 50px">
    <el-form ref="productAttrForm" :model="value" :rules="rules" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr,index) in productAttributeList">
            {{ productAttr.name }}:
            <el-checkbox-group v-model="selectProductAttr[index].values">
              <el-checkbox
                v-for="item in productAttributeList[index].goodsAttrDos"
                :key="item.id"
                :label="item.name"
                class="littleMarginLeft"
              />
            </el-checkbox-group>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px" :data="value.goodsRuleDetailDtos" border>
          <!--<el-table-column label="规格编号" align="center">-->
          <!--<template slot-scope="scope">-->
          <!--<el-input v-model="scope.row.id" />-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column v-for="(item,index) in activeSelectProductAttr" :key="item.id" :label="item.name" align="center">
            <template slot-scope="scope">
              {{ getProductAttr(scope.$index,index) }}
            </template>
          </el-table-column>
          <el-table-column label="规格图片id" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.picGroupId" />
            </template>
          </el-table-column>
          <el-table-column label="销售价格" width="80" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'goodsRuleDetailDtos.' + scope.$index + '.salePrice'" :rules="rules.salePrice">
                <el-input v-model="scope.row.salePrice" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stockNum" />
            </template>
          </el-table-column>
          <el-table-column label="商品状态" width="80" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'" />
            </template>
          </el-table-column>
        </el-table>
        <el-button disabled="true" type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList">
          刷新列表
        </el-button>
      </el-form-item>
      <el-form-item label="商品相册id：" prop="picGroupId">
        <el-input v-model="value.picGroupId" />
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getProductAttributeList } from '@/api/productionAttribution'

export default {
  name: 'ProductAttrDetail',
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      firstTimeLoading: true,
      goodsTypeFirstTimeLoading: true,
      productAttributeList: [],
      selectProductAttr: [],
      rules: {
        picGroupId: [{ required: true, message: 'picGroupId is required', trigger: 'blur' }],
        salePrice: [{ required: true, message: 'salePrice is required', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 商品的编号
    goodsId() {
      return this.value.goodsId
    },
    activeSelectProductAttr() {
      if (!this.goodsTypeFirstTimeLoading) {
        this.refreshProductSkuList()
      } else if (!this.firstTimeLoading) {
        this.refreshGoodsTypeTime()
      }
      return this.selectProductAttr.filter(item => {
        return item.values.length
      })
    }
  },
  watch: {
    goodsId: function(newValue) {
      if (!this.isEdit) {
        this.getProductAttributeList()
        this.firstTimeLoading = false
        this.goodsTypeFirstTimeLoading = false
        return
      } else if (!this.goodsTypeFirstTimeLoading) {
        this.goodsTypeFirstTimeLoading = true
      }
      if (newValue === undefined || newValue == null || newValue === 0) return
      if (this.firstTimeLoading) {
        setTimeout(() => {
          this.handleEditCreated()
        }, 0.5 * 1000)
      } else {
        this.handleEditCreated()
      }
      return
    }
  },
  created() {
    if (!this.isEdit) {
      this.firstTimeLoading = false
      this.goodsTypeFirstTimeLoading = false
    }
    this.getProductAttributeList()
  },
  methods: {
    refreshGoodsTypeTime() {
      this.goodsTypeFirstTimeLoading = false
    },
    handleEditCreated() {
      this.selectProductAttr = []
      for (let i = 0; i < this.productAttributeList.length; i++) {
        this.selectProductAttr.push({
          name: this.productAttributeList[i].name,
          id: this.productAttributeList[i].id,
          values: []
        })
      }
      for (let i = 0; i < this.value.goodsRuleDetailDtos.length; i++) {
        const list = this.value.goodsRuleDetailDtos[i].goodsRuleValue.split(',')
        for (let j = 0; j < list.length; j++) {
          const fatherIdValue = list[j].split(':')[0]
          const typeIdValue = list[j].split(':')[1]
          const index = this.selectProductAttr.findIndex(function(item) {
            return item.id === Number(this)
          }, fatherIdValue)
          const name = this.productAttributeList[index].goodsAttrDos.find(function(item) {
            return item.id === Number(this)
          }, typeIdValue).name
          const isExist = this.selectProductAttr[index].values.findIndex(function(item) {
            return item === name
          }, name)
          if (isExist === -1) {
            this.selectProductAttr[index].values.push(name)
          }
        }
      }
      this.firstTimeLoading = false
    },
    getProductAttributeList() {
      getProductAttributeList().then(response => {
        this.selectProductAttr = []
        this.productAttributeList = response.data
        for (let i = 0; i < this.productAttributeList.length; i++) {
          this.selectProductAttr.push({
            name: this.productAttributeList[i].name,
            id: this.productAttributeList[i].id,
            values: []
          })
        }
      })
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.$refs['productAttrForm'].validate((valid) => {
        if (valid) {
          this.$emit('nextStep')
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    handleRefreshProductSkuList() {
      this.$confirm('刷新列表将导致商品规格信息重新生成，是否要刷新', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refreshProductSkuList()
      })
    },
    refreshProductSkuList() {
      this.value.goodsRuleDetailDtos = []
      const skuList = this.value.goodsRuleDetailDtos
      let length = 0
      const values = []
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        if (this.selectProductAttr[i].values.length > 0) {
          values.push(this.selectProductAttr[i].values)
          length++
        }
      }
      if (length === 3) {
        for (let i = 0; i < values[0].length; i++) {
          for (let j = 0; j < values[1].length; j++) {
            for (let k = 0; k < values[2].length; k++) {
              let goodsRuleValue = ''
              goodsRuleValue = '' + this.generateGoodsRuleValue(values[0][i]) + ',' + this.generateGoodsRuleValue(values[1][j]) + ',' + this.generateGoodsRuleValue(values[2][k])
              skuList.push({
                goodsRuleValue: goodsRuleValue
              })
            }
          }
        }
      }
      if (length === 2) {
        for (let i = 0; i < values[0].length; i++) {
          for (let j = 0; j < values[1].length; j++) {
            let goodsRuleValue = ''
            goodsRuleValue = '' + this.generateGoodsRuleValue(values[0][i]) + ',' + this.generateGoodsRuleValue(values[1][j])
            skuList.push({
              goodsRuleValue: goodsRuleValue
            })
          }
        }
      }
      if (length === 1) {
        for (let i = 0; i < values[0].length; i++) {
          let goodsRuleValue = ''
          goodsRuleValue = '' + this.generateGoodsRuleValue(values[0][i])
          skuList.push({
            goodsRuleValue: goodsRuleValue
          })
        }
      }
    },
    generateGoodsRuleValue(productionAttr) {
      for (let i = 0; i < this.productAttributeList.length; i++) {
        for (let j = 0; j < this.productAttributeList[i].goodsAttrDos.length; j++) {
          let goodsRuleValue = ''
          if (this.productAttributeList[i].goodsAttrDos[j].name === productionAttr) {
            goodsRuleValue = '' + this.productAttributeList[i].goodsAttrDos[j].fatherId + ':' + this.productAttributeList[i].goodsAttrDos[j].id
            return goodsRuleValue
          }
        }
      }
    },
    generateProductAttr() {
      let length = 0
      const values = []
      const list = []
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        if (this.selectProductAttr[i].values.length > 0) {
          values.push(this.selectProductAttr[i].values)
          length++
        }
      }
      if (length === 3) {
        for (let i = 0; i < values[0].length; i++) {
          for (let j = 0; j < values[1].length; j++) {
            for (let k = 0; k < values[2].length; k++) {
              list.push([values[0][i], values[1][j], values[2][k]])
            }
          }
        }
      }
      if (length === 2) {
        for (let i = 0; i < values[0].length; i++) {
          for (let j = 0; j < values[1].length; j++) {
            list.push([values[0][i], values[1][j]])
          }
        }
      }
      if (length === 1) {
        for (let i = 0; i < values[0].length; i++) {
          list.push([values[0][i]])
        }
      }
      return list
    },
    getProductAttr(rowIndex, index) {
      const list = this.generateProductAttr()
      return list[rowIndex][index]
    }
  }
}
</script>

<style scoped>

</style>
