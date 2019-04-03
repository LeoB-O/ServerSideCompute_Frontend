<template>
  <div class="app-container">
    <el-form :inline="true" label-width="120px">
      <el-form-item label="城市">
        <el-input v-model="city"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleClick">查看天气</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="3">城市:</el-col>
      <el-col :span="11">{{ weather.today.city }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="3">气温:</el-col>
      <el-col :span="11">{{ weather.today.temperature }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="3">天气:</el-col>
      <el-col :span="21">{{ weather.today.weather }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="3">建议穿着:</el-col>
      <el-col :span="21">{{ weather.today.dressing_advice }}</el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      show-summary
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="支出项">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="明细">
        <template slot-scope="scope">
          <span>{{ scope.row.detail }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="支出金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ new Date(scope.row.createdAt).toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-row><el-button type="text" @click="handleEdit(scope.row)">编辑</el-button></el-row>
          <el-row><el-button type="danger" icon="el-icon-delete" size="mini" circle @click="handleDelete(scope.row)"/></el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="isVisible">
      <el-form ref="form" :model="current" label-width="120px">
        <el-form-item prop="name" label="支出名称">
          <el-input v-model="current.name"/>
        </el-form-item>
        <el-form-item prop="date1" label="支出时间">
          <el-col :span="11">
            <el-date-picker v-model="current.date1" type="date" placeholder="Pick a date" style="width: 100%;"/>
          </el-col>
          <el-col :span="2" class="line">-</el-col>
          <el-col :span="11">
            <el-time-picker v-model="current.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;"/>
          </el-col>
        </el-form-item>
        <el-form-item prop="amount" label="支出金额">
          <el-input-number v-model="current.amount"/>
        </el-form-item>
        <el-form-item prop="detail" label="详情">
          <el-input v-model="current.detail" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">Submit</el-button>
          <el-button @click="onCancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import { deleteConsumption, getWeather, editConsumption } from '../../api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      isVisible: false,
      list: null,
      listLoading: true,
      city: '',
      current: {
        date1: '',
        date2: ''
      },
      weather: {
        'today': {
          'temperature': '9℃~13℃',
          'weather': '小雨',
          'weather_id': {
            'fa': '07',
            'fb': '07'
          },
          'wind': '持续无风向微风',
          'week': '星期三',
          'city': '东阳',
          'date_y': '2019年04月03日',
          'dressing_index': '较冷',
          'dressing_advice': '建议着厚外套加毛衣等服装。年老体弱者宜着大衣、呢外套加羊毛衫。',
          'uv_index': '最弱',
          'comfort_index': '',
          'wash_index': '不宜',
          'travel_index': '较不宜',
          'exercise_index': '较不宜',
          'drying_index': ''
        },
        'future': {
          'day_20190403': {
            'temperature': '9℃~13℃',
            'weather': '小雨',
            'weather_id': {
              'fa': '07',
              'fb': '07'
            },
            'wind': '持续无风向微风',
            'week': '星期三',
            'date': '20190403'
          },
          'day_20190404': {
            'temperature': '10℃~15℃',
            'weather': '小雨',
            'weather_id': {
              'fa': '07',
              'fb': '07'
            },
            'wind': '西南风微风',
            'week': '星期四',
            'date': '20190404'
          },
          'day_20190405': {
            'temperature': '11℃~22℃',
            'weather': '多云转晴',
            'weather_id': {
              'fa': '01',
              'fb': '00'
            },
            'wind': '持续无风向微风',
            'week': '星期五',
            'date': '20190405'
          },
          'day_20190406': {
            'temperature': '13℃~26℃',
            'weather': '晴转多云',
            'weather_id': {
              'fa': '00',
              'fb': '01'
            },
            'wind': '持续无风向微风',
            'week': '星期六',
            'date': '20190406'
          },
          'day_20190407': {
            'temperature': '13℃~28℃',
            'weather': '多云转晴',
            'weather_id': {
              'fa': '01',
              'fb': '00'
            },
            'wind': '持续无风向微风',
            'week': '星期日',
            'date': '20190407'
          },
          'day_20190408': {
            'temperature': '10℃~15℃',
            'weather': '小雨',
            'weather_id': {
              'fa': '07',
              'fb': '07'
            },
            'wind': '西南风微风',
            'week': '星期一',
            'date': '20190408'
          },
          'day_20190409': {
            'temperature': '10℃~15℃',
            'weather': '小雨',
            'weather_id': {
              'fa': '07',
              'fb': '07'
            },
            'wind': '西南风微风',
            'week': '星期二',
            'date': '20190409'
          }
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.consumption.consumptions
        this.listLoading = false
      })
    },
    handleClick() {
      getWeather(this.city).then(response => {
        this.weather = response.data.result
      })
    },
    handleDelete(row) {
      deleteConsumption(row._id).then(response => {
        this.fetchData()
      })
    },
    handleEdit(row) {
      this.current = row
      this.isVisible = true
    },
    handleSubmit() {
      let date1 = this.current.date1
      let date2 = this.current.date2
      this.current.createdAt = new Date()
      this.current.createdAt.setUTCFullYear(date1.getUTCFullYear(), date1.getMonth(), date1.getDate())
      this.current.createdAt.setHours(date2.getHours(), date2.getMinutes())
      editConsumption(this.current)
      this.isVisible=false
    }
  }
}
</script>
