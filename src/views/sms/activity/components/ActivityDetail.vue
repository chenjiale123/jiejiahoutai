<template>
  <el-form ref="activityForm" :model="activity" label-width="150px" size="small">
    <el-form-item label="活动标题：">
      <el-input v-model="activity.title" style="width: 250px" />
    </el-form-item>
    <el-form-item label="活动链接：">
      <el-input v-model="activity.linkUrl" style="width: 250px" />
    </el-form-item>
    <el-form-item label="活动图片：">
      <el-input v-model="activity.picGroupId" style="width: 250px" />
    </el-form-item>
    <el-form-item label="权重：">
      <el-input v-model="activity.orderNum" style="width: 250px" />
    </el-form-item>
    <el-form-item label="状态：">
      <el-radio-group v-model="activity.status">
        <el-radio :label="'0'">正常</el-radio>
        <el-radio :label="'1'">失效</el-radio>
        <el-radio :label="'2'">删除</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('activityForm')">提交</el-button>
      <el-button v-if="!isEdit" @click="resetForm('activityForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addActivity, getActivityById, updateActivity } from '@/api/activity'
const defaultActivity = {
  id: 0,
  linkUrl: '',
  orderNum: 0,
  title: '',
  status: '0',
  picGroupId: null
}
export default {
  name: 'ActivityDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activity: Object.assign({}, defaultActivity)
    }
  },
  watch: {
    id: function(newValue) {
      if (!this.isEdit) {
        this.resetForm('activityFrom')
        return
      }
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.getActivity()
    }
  },
  created() {
    if (this.isEdit) this.getActivity()
  },
  methods: {
    getActivity() {
      const query = {
        id: this.id
      }
      getActivityById(query).then(response => {
        this.activity = response.data
      })
    },
    onSubmit(formName) {
      console.log(this.activity)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.isEdit) {
              addActivity(this.activity).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                location.reload()
              })
            } else {
              updateActivity(this.activity).then(response => {
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
      this.activity = Object.assign({}, defaultActivity)
    }
  }
}
</script>

<style scoped>

</style>
