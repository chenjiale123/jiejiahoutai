<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息" />
      <el-step title="填写商品促销" />
      <el-step title="填写商品属性" />
      <el-step title="选择商品关联" />
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
    />
    <product-sale-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep"
    />
    <product-attr-detail
      v-show="showStatus[2]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep"
    />
    <product-relation-detail
      v-show="showStatus[3]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit"
    />
  </el-card>
</template>

<script>
import ProductInfoDetail from './ProductInfoDetail'
import ProductSaleDetail from './ProductSaleDetail'
import ProductAttrDetail from './ProductAttrDetail'
import ProductRelationDetail from './ProductRelationDetail'
import { getGoodsById, addGoods, updateGoods } from '@/api/production'

const defaultProductParam = {
  goodsId: 0,
  goodsTypeId: 0,
  goodsName: '',
  detail: '',
  goodsDesc: '',
  defaultPrice: 0,
  isShelf: '1',
  isDiscount: '1',
  isLimited: '1',
  isNew: '1',
  isVoucher: '1',
  isPromotion: '1',
  isRecommend: '1',
  limitNum: 0,
  goodsRuleDetailDtos: [],
  picGroupId: ''
}

export default {
  name: 'ProductDetail',
  components: { ProductInfoDetail, ProductSaleDetail, ProductAttrDetail, ProductRelationDetail },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    goodsId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      active: 0,
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false, false, false]
    }
  },
  computed: {
    edit() {
      return this.isEdit
    },
    currentGoodsId() {
      return this.goodsId
    }
  },
  watch: {
    edit: function() {
      if (this.isEdit) {
        return
      } else {
        this.productParam = Object.assign({}, defaultProductParam)
        this.refreshShowStatus()
      }
    },
    currentGoodsId: function(newValue) {
      if (!this.isEdit) return
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.getGoods()
      this.refreshShowStatus()
    }
  },
  created() {
    if (this.isEdit) {
      this.getGoods()
    }
  },
  methods: {
    refreshShowStatus() {
      this.active = 0
      this.showStatus = [true, false, false, false]
    },
    getGoods() {
      const query = {
        goodsId: this.goodsId
      }
      getGoodsById(query).then(response => {
        const list = response.data
        this.productParam.goodsRuleDetailDtos = []
        for (let i = 0; i < list.goodsRuleDetailDos.length; i++) {
          this.productParam.goodsRuleDetailDtos.push({
            goodsRuleValue: list.goodsRuleDetailDos[i].goodsRuleValue,
            salePrice: list.goodsRuleDetailDos[i].salePrice,
            stockNum: list.goodsRuleDetailDos[i].stockNum,
            picGroupId: list.goodsRuleDetailDos[i].picGroupId,
            status: list.goodsRuleDetailDos[i].status
          })
        }
        this.productParam.goodsId = this.goodsId
        this.productParam.goodsTypeId = list.goodsTypeId
        this.productParam.goodsName = list.goodsName
        this.productParam.detail = list.detail
        this.productParam.goodsDesc = list.goodsDesc
        this.productParam.defaultPrice = list.defaultPrice
        this.productParam.isShelf = list.isShelf
        this.productParam.isDiscount = list.isDiscount
        this.productParam.isLimited = list.isLimited
        this.productParam.isNew = list.isNew
        this.productParam.isVoucher = list.isVoucher
        this.productParam.isPromotion = list.isPromotion
        this.productParam.isRecommend = list.isRecommend
        this.productParam.limitNum = list.limitNum
        this.productParam.picGroupId = list.picGroupId
        console.log(this.productParam)
      })
    },
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--
        this.hideAll()
        this.showStatus[this.active] = true
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++
        this.hideAll()
        this.showStatus[this.active] = true
      }
    },
    finishCommit(isEdit) {
      console.log(this.productParam)
      this.$confirm('是否要提交该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!isEdit) {
          const rempProductParam = Object.assign({}, this.productParam)
          delete rempProductParam.goodsId
          addGoods(rempProductParam).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功',
              duration: 1000
            })
            location.reload()
          })
        } else {
          updateGoods(this.productParam).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功',
              duration: 1000
            })
            location.reload()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
