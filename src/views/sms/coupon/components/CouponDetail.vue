<template>
  <el-card class="form-container" shadow="never">
    <el-form ref="couponFrom" :model="coupon" :rules="rules" label-width="150px" size="small">
      <el-form-item label="优惠券名称：" prop="couponName">
        <el-input v-model="coupon.couponName" class="input-width" />
      </el-form-item>
      <el-form-item label="优惠券描述：">
        <el-input v-model="coupon.couponDescribe" class="input-width" />
      </el-form-item>
      <el-form-item label="优惠券类型：" prop="couponType">
        <el-select v-model="coupon.couponType">
          <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="coupon.couponType==='0'" label="折扣：">
        <el-input v-model="coupon.discount" class="input-width" />
      </el-form-item>
      <el-form-item v-if="coupon.couponType==='1'" label="优惠金额：">
        <el-input v-model="coupon.preferentialCash" class="input-width"><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="有效期：">
        <el-date-picker v-model="coupon.beginTime" type="date" placeholder="选择日期" style="width: 150px" value-format="yyyy-MM-dd HH:mm:ss" />
        <span style="margin-left: 20px;margin-right: 20px">至</span>
        <el-date-picker v-model="coupon.endTime" type="date" placeholder="选择日期" style="width: 150px" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="有效天数：">
        <el-input v-model="coupon.expiryDate" class="input-width"><template slot="append">天</template></el-input>
      </el-form-item>
      <el-form-item label="发放数量：">
        <el-input v-model="coupon.couponSum" class="input-width" />
      </el-form-item>
      <el-form-item label="使用门槛：" prop="minPoint">
        <el-input v-model.number="coupon.miniConsumption" placeholder="只能输入正整数" class="input-width">
          <template slot="prepend">满</template>
          <template slot="append">元可用</template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-switch v-model="coupon.status" :active-value="'0'" :inactive-value="'1'" active-text="启用" inactive-text="不启用" />
      </el-form-item>
      <el-form-item label="限用用户：">
        <el-switch v-model="coupon.userType" :active-value="'0'" :inactive-value="'1'" active-text="不限用户" inactive-text="新人用户" />
      </el-form-item>
      <el-form-item label="可使用商品：">
        <el-cascader
          v-model="selectProductTypeValue"
          clearable
          placeholder="请选择分类名称"
          :options="productTypeOptions"
        />
        <el-button @click="handleAddProductTypeRelation()">添加</el-button>
        <el-table
          ref="productTypeRelationTable"
          :data="productTypeRelationList"
          style="width: 100%;margin-top: 20px"
          border
        >
          <el-table-column label="分类名称" align="center">
            <template slot-scope="scope">{{ scope.row.goodsTypeName }}</template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('couponFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('couponFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getGoodsTypeList } from '@/api/productionType'
import { addCoupon, getCouponById, updateCoupon } from '@/api/coupon'

const defaultCoupon = {
  couponName: '',
  couponId: 0,
  beginTime: null,
  endTime: null,
  couponSum: 0,
  couponType: '',
  discount: '1',
  couponDescribe: '',
  expiryDate: 0,
  limitType: '',
  miniConsumption: 0,
  preferentialCash: 0,
  status: '0',
  userType: '0'
}
export default {
  name: 'CouponDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    couponId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectProductTypeValue: [],
      productTypeOptions: [],
      goodsTypeList: [],
      coupon: Object.assign({}, defaultCoupon),
      typeOptions: [
        { label: '折扣券', value: '0' },
        { label: '现金券', value: '1' }
      ],
      rules: {
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        couponType: { required: true, message: '请选择优惠券类型', trigger: 'blur' }
      }
    }
  },
  computed: {
    productTypeRelationList() {
      const value = this.coupon.limitType
      const productTypeList = []
      if (value !== '') {
        const list = value.split(',')
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < this.goodsTypeList.length; j++) {
            if (this.goodsTypeList[j].typeId === Number(list[i])) {
              productTypeList.push({
                goodsTypeName: this.goodsTypeList[j].goodsTypeName
              })
              break
            }
          }
        }
      }
      return productTypeList
    }
  },
  watch: {
    couponId: function(newValue) {
      if (!this.isEdit) {
        this.resetForm('couponFrom')
        return
      }
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.getCoupon()
    }
  },
  created() {
    this.getProductTypeList()
    if (this.isEdit) this.getCoupon()
  },
  methods: {
    getCoupon() {
      const query = {
        couponId: this.couponId
      }
      getCouponById(query).then(response => {
        this.coupon = response.data
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
    },
    handleAddProductTypeRelation() {
      if (this.selectProductTypeValue === null || this.selectProductTypeValue.length === 0) {
        this.$message({
          message: '请先选择商品分类',
          type: 'warning'
        })
        return
      }
      if (this.selectProductTypeValue.length === 1) {
        if (this.coupon.limitType === '') {
          this.coupon.limitType += this.selectProductTypeValue[0]
        } else {
          this.coupon.limitType += ',' + this.selectProductTypeValue[0]
        }
      }
      if (this.selectProductTypeValue.length === 2) {
        if (this.coupon.limitType === '') {
          this.coupon.limitType += this.selectProductTypeValue[1]
        } else {
          this.coupon.limitType += ',' + this.selectProductTypeValue[0]
        }
      }
      if (this.selectProductTypeValue.length === 3) {
        if (this.coupon.limitType === '') {
          this.coupon.limitType += this.selectProductTypeValue[2]
        } else {
          this.coupon.limitType += ',' + this.selectProductTypeValue[0]
        }
      }
      this.selectProductTypeValue = []
    },
    onSubmit(formName) {
      console.log(this.coupon)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.isEdit) {
              addCoupon(this.coupon).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                location.reload()
              })
            } else {
              this.coupon.couponId = this.coupon.id
              updateCoupon(this.coupon).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                location.reload()
              })
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
      this.$refs[formName].resetFields()
      this.coupon = Object.assign({}, defaultCoupon)
    }
  }
}
</script>

<style scoped>

</style>
