<template>
  <el-card class="form-container" shadow="never">
    <el-form ref="bannerForm" :model="banner" label-width="150px" size="small">
      <el-form-item label="轮播类型：" prop="bannerType">
        <el-select v-model="banner.bannerType">
          <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务id：">
        <el-input v-model="banner.busiId" placeholder="统一存放唯一标识id" />
      </el-form-item>
      <el-form-item label="权重：">
        <el-input v-model="banner.orderNum" />
      </el-form-item>
      <el-form-item label="图片id：">
        <el-input v-model="banner.picGroupId" />
      </el-form-item>
      <el-form-item label="轮播位置：">
        <el-radio-group v-model="banner.position">
          <el-radio :label="'0'">首页轮播</el-radio>
          <el-radio :label="'1'">商城</el-radio>
          <el-radio :label="'2'">活动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="轮播状态：">
        <el-radio-group v-model="banner.status">
          <el-radio :label="'0'">正常</el-radio>
          <el-radio :label="'1'">不可用</el-radio>
          <el-radio :label="'2'">删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('bannerForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('bannerForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getBannerById, updateBanner, addBanner } from '@/api/banner'
const defaultBanner = {
  bannerId: 0,
  bannerType: '',
  busiId: null,
  orderNum: 0,
  picGroupId: null,
  position: '0',
  status: '0'
}
export default {
  name: 'BannerDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    bannerId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      banner: Object.assign({}, defaultBanner),
      typeOptions: [
        { value: '0', label: '活动' },
        { value: '1', label: '商品' },
        { value: '2', label: '课程' }
      ]
    }
  },
  watch: {
    bannerId: function(newValue) {
      if (!this.isEdit) {
        this.resetForm('bannerFrom')
        return
      }
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.getBanner()
    }
  },
  created() {
    if (this.isEdit) this.getBanner()
  },
  methods: {
    getBanner() {
      const query = {
        bannerId: this.bannerId
      }
      getBannerById(query).then(response => {
        this.banner = response.data
      })
    },
    onSubmit(formName) {
      console.log(this.banner)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.isEdit) {
              addBanner(this.banner).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                location.reload()
              })
            } else {
              updateBanner(this.banner).then(response => {
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
      this.banner = Object.assign({}, defaultBanner)
    }
  }
}
</script>

<style scoped>

</style>
