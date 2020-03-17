<template>
  <el-card class="form-container" shadow="never">
    <el-form ref="productTypeFrom" :model="productType" :rules="rules" label-width="150px">
      <el-form-item label="商品类别编号：">
        <el-input v-model="productType.typeId" placeholder="商品类别id,添加时默认传0" />
      </el-form-item>
      <el-form-item label="商品类别名称：">
        <el-input v-model="productType.goodsTypeName" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="商品上级类别编号：" prop="fatherId">
        <el-cascader v-model="selectProductTypeValue" :options="productTypeOptions" change-on-select="true" />
      </el-form-item>
      <el-form-item v-if="isEdit" label="商品上级类别编号：">
        <el-cascader v-model="selectProductTypeValue" :options="productTypeOptions" change-on-select="true" />
      </el-form-item>
      <el-form-item label="商品类别排序：">
        <el-input v-model="productType.orderNum" />
      </el-form-item>
      <el-form-item label="商品类别状态：">
        <el-switch v-model="productType.status" :active-value="'0'" :inactive-value="'1'" active-text="生效" inactive-text="不生效" />
      </el-form-item>
      <el-form-item label="商品类别图标id：">
        <el-input v-model="productType.picGroupId" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productTypeFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productTypeFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getGoodsTypeList, addGoodsType, getGoodsTypeById } from '@/api/productionType'

const defaultProductType = {
  typeId: null,
  fatherId: 0,
  orderNum: 0,
  status: '0',
  picGroupId: '',
  goodsTypeName: ''
}
export default {
  name: 'ProductTypeDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    typeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      firstTimeLoading: true,
      productType: Object.assign({}, defaultProductType),
      productTypeOptions: [],
      goodsTypeList: [],
      selectProductTypeValue: [],
      rules: {
        fatherId: [{ required: true, message: 'fatherId is required', trigger: 'blur' }]
      }
    }
  },
  watch: {
    typeId: function(newValue) {
      if (!this.isEdit) {
        this.selectProductTypeValue = []
        this.productType = Object.assign({}, defaultProductType)
        return
      }
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.handleEditCreated()
    },
    selectProductTypeValue: function(newValue) {
      if (newValue !== null) {
        if (newValue.length === 3) {
          this.productType.fatherId = newValue[2]
        } else if (newValue.length === 2) {
          this.productType.fatherId = newValue[1]
        } else {
          this.productType.fatherId = newValue[0]
        }
      }
    }
  },
  created() {
    this.getProductTypeList()
    if (this.isEdit) {
      if (this.firstTimeLoading) {
        setTimeout(() => {
          this.handleEditCreated()
        }, 0.5 * 1000)
        return
      } else {
        this.handleEditCreated()
      }
    }
  },
  methods: {
    // 处理编辑逻辑
    handleEditCreated() {
      const query = {
        typeId: this.typeId
      }
      getGoodsTypeById(query).then(response => {
        const list = response.data
        this.productType.typeId = list.typeId
        this.productType.fatherId = list.fatherId
        this.productType.orderNum = list.orderNum
        this.productType.status = list.status
        this.productType.picGroupId = list.picGroupId
        this.productType.goodsTypeName = list.goodsTypeName
        this.firstTimeLoading = false
        this.selectProductTypeValue = []
        if (this.productType.typeId !== null) {
          const index = this.goodsTypeList.findIndex(function(item) {
            return item.typeId === this
          }, this.productType.typeId)
          if (this.goodsTypeList[index].fatherId === 0 || this.goodsTypeList[index].fatherId === -1) {
            this.selectProductTypeValue = []
          } else {
            for (let i = 0; i < this.productTypeOptions.length; i++) {
              if (this.goodsTypeList[index].fatherId === this.productTypeOptions[i].value) {
                this.selectProductTypeValue.push(this.goodsTypeList[index].fatherId)
              }
              if (this.productTypeOptions[i].children !== undefined) {
                for (let j = 0; j < this.productTypeOptions[i].children.length; j++) {
                  if (this.goodsTypeList[index].fatherId === this.productTypeOptions[i].children[j].value) {
                    this.selectProductTypeValue.push(this.productTypeOptions[i].value)
                    this.selectProductTypeValue.push(this.goodsTypeList[index].fatherId)
                  }
                }
              }
            }
          }
        }
      })
      this.firstTimeLoading = false
    },
    getProductTypeList() {
      getGoodsTypeList().then(response => {
        this.goodsTypeList = response.data
        const list = response.data
        this.productTypeOptions = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].fatherId === 0 || list[i].fatherId === -1) {
            this.productTypeOptions.push({
              label: list[i].goodsTypeName, value: list[i].typeId
            })
          }
        }
        for (let i = 0; i < this.productTypeOptions.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (this.productTypeOptions[i].value === list[j].fatherId) {
              if (this.productTypeOptions[i].children === undefined) {
                this.productTypeOptions[i].children = []
              }
              this.productTypeOptions[i].children.push({
                label: list[j].goodsTypeName, value: list[j].typeId
              })
            }
          }
        }
        for (let i = 0; i < this.productTypeOptions.length; i++) {
          if (this.productTypeOptions[i].children !== undefined) {
            for (let j = 0; j < this.productTypeOptions[i].children.length; j++) {
              for (let k = 0; k < list.length; k++) {
                if (this.productTypeOptions[i].children[j].value === list[k].fatherId) {
                  if (this.productTypeOptions[i].children[j].children === undefined) {
                    this.productTypeOptions[i].children[j].children = []
                  }
                  this.productTypeOptions[i].children[j].children.push({
                    label: list[k].goodsTypeName, value: list[k].typeId
                  })
                }
              }
            }
          }
        }
      })
    },
    onSubmit(formName) {
      console.log(this.productType)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.isEdit) {
              const query = {
                typeId: this.productType.typeId,
                fatherId: this.productType.fatherId,
                orderNum: this.productType.orderNum,
                status: this.productType.status,
                picGroupId: this.productType.picGroupId,
                goodsTypeName: this.productType.goodsTypeName
              }
              addGoodsType(query).then(response => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 1000
                })
              })
              location.reload()
            }
          })
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
    resetForm(formName) {
      this.selectProductTypeValue = []
      this.$refs[formName].resetFields()
      this.productType = Object.assign({}, defaultProductType)
    }
  }
}
</script>

<style scoped>

</style>
