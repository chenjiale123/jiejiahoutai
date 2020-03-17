<template>
  <div style="margin-top: 50px">
    <el-form ref="productSaleForm" :model="value" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品上架：">
        <el-switch v-model="value.isShelf" :active-value="'0'" :inactive-value="'1'" />
      </el-form-item>
      <el-form-item label="特价商品：">
        <el-switch v-model="value.isDiscount" :active-value="'0'" :inactive-value="'1'" />
      </el-form-item>
      <el-form-item label="新品：">
        <el-switch v-model="value.isNew" :active-value="'0'" :inactive-value="'1'" />
      </el-form-item>
      <el-form-item label="促销：">
        <el-switch v-model="value.isPromotion" :active-value="'0'" :inactive-value="'1'" />
      </el-form-item>
      <el-form-item label="用券：">
        <el-switch v-model="value.isVoucher" :active-value="'0'" :inactive-value="'1'" />
      </el-form-item><el-form-item label="推荐：">
        <el-switch v-model="value.isRecommend" :active-value="'0'" :inactive-value="'1'" />
      </el-form-item>
      <el-form-item label="限购商品：">
        <el-switch v-model="value.isLimited" :active-value="'0'" :inactive-value="'1'" />
        <span v-if="value.isLimited === '0'" style="margin-left: 10px;margin-right: 10px">限购数量</span>
        <el-input v-if="value.isLimited === '0'" v-model="value.limitNum" style="width: 220px" />
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'ProductSaleDetail',
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.$emit('nextStep')
    }
  }
}
</script>

<style scoped>

</style>
