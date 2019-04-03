<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item prop="name" label="支出名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item prop="date1" label="支出时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;"/>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;"/>
        </el-col>
      </el-form-item>
      <el-form-item prop="amount" label="支出金额">
        <el-input-number v-model="form.amount"/>
      </el-form-item>
      <el-form-item prop="detail" label="详情">
        <el-input v-model="form.detail" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addConsumption } from '../../api/table'

export default {
  data() {
    return {
      form: {
        name: '',
        date1: '',
        date2: '',
        amount: 0,
        detail: '',
        createdAt: ''
      }
    }
  },
  methods: {
    onSubmit() {
      let date1 = this.form.date1
      let date2 = this.form.date2
      this.form.createdAt = new Date()
      this.form.createdAt.setUTCFullYear(date1.getUTCFullYear(), date1.getMonth(), date1.getDate())
      this.form.createdAt.setHours(date2.getHours(), date2.getMinutes())
      addConsumption(this.form).then(response => {
        if (response.code == 20000) {
          this.$message.success('提交成功')
          this.$refs['form'].resetFields()
        }
      })
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

