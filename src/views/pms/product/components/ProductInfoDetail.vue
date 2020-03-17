<template>
  <div style="margin-top: 50px">
    <el-form ref="productInfoForm" :model="value" :rules="rules" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="goodsTypeId">
        <el-cascader v-model="selectProductTypeValue" :options="productTypeOptions" change-on-select="true" />
      </el-form-item>
      <el-form-item label="商品名称：" prop="goodsName">
        <el-input v-model="value.goodsName" placeholder="商品名称限制100长度，不能输入特殊字符和空格" />
      </el-form-item>
      <el-form-item label="商品描述：" prop="goodsDesc">
        <el-input v-model="value.goodsDesc" :auto-size="true" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="默认价格：" prop="defaultPrice">
        <el-input v-model="value.defaultPrice" />
      </el-form-item>
      <el-form-item label="商品详情：" prop="detail">
        <Tinymce :id="value.goodsId" v-model="value.detail" width="580px" />
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getGoodsTypeList } from '@/api/productionType'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'ProductInfoDetail',
  components: { Tinymce },
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
      selectProductTypeValue: [],
      productTypeOptions: [],
      goodsTypeList: [],
      rules: {
        defaultPrice: [{ required: true, message: 'defaultPrice is required', trigger: 'blur' }],
        detail: [{ required: true, message: 'detail is required', trigger: 'blur' }],
        goodsDesc: [{ required: true, message: 'goodsDesc is required', trigger: 'blur' }],
        goodsTypeId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        goodsName: [
          { required: true, message: 'goodsName is required', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 商品的编号
    goodsId() {
      return this.value.goodsId
    }
  },
  watch: {
    goodsId: function(newValue) {
      if (!this.isEdit) {
        this.selectProductTypeValue = []
        return
      }
      if (newValue === undefined || newValue == null || newValue === 0) return
      if (this.firstTimeLoading) {
        setTimeout(() => {
          this.handleEditCreated()
        }, 0.5 * 1000)
        return
      } else {
        this.handleEditCreated()
      }
    },
    selectProductTypeValue: function(newValue) {
      if (newValue !== null) {
        if (newValue.length === 3) {
          this.value.goodsTypeId = newValue[2]
        } else if (newValue.length === 2) {
          this.value.goodsTypeId = newValue[1]
        } else {
          this.value.goodsTypeId = newValue[0]
        }
      }
    }
  },
  created() {
    this.getProductTypeList()
  },
  methods: {
    // 处理编辑逻辑
    handleEditCreated() {
      this.firstTimeLoading = false
      this.selectProductTypeValue = []
      if (this.value.goodsTypeId !== null) {
        const index = this.goodsTypeList.findIndex(function(item) {
          return item.typeId === this
        }, this.value.goodsTypeId)
        if (this.goodsTypeList[index].fatherId === 0 || this.goodsTypeList[index].fatherId === -1) {
          this.selectProductTypeValue.push(this.goodsTypeList[index].typeId)
        } else {
          for (let i = 0; i < this.productTypeOptions.length; i++) {
            if (this.goodsTypeList[index].fatherId === this.productTypeOptions[i].value) {
              this.selectProductTypeValue.push(this.goodsTypeList[index].fatherId)
              this.selectProductTypeValue.push(this.value.goodsTypeId)
            }
          }
        }
      }
    },
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
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
    }
  }
}
</script>

<style scoped>

</style>
