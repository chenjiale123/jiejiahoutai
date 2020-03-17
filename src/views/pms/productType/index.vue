<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" type="primary" @click="handleAddProductType()">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTypeTable" v-loading="listLoading" style="width: 100%" :data="list" border>
        <el-table-column label="编号" width="100px" align="center">
          <template slot-scope="scope">{{ scope.row.typeId }}</template>
        </el-table-column>
        <el-table-column label="上级类别编号" width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.row.fatherId }}
          </template>
        </el-table-column>
        <el-table-column label="类别名称" width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.row.goodsTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="类别图片" width="100px" align="center">
          <template slot-scope="scope">
            <img min-width="70" height="70" :src="scope.row.picUrl">
          </template>
        </el-table-column>
        <el-table-column label="是否生效" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="'0'" :inactive-value="'1'" disabled="true" @change="handleStatusChange(scope.$index, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="textMap[editProductionTypeInfo.dialogStatus]" :visible.sync="editProductionTypeInfo.dialogVisible">
      <product-type-detail :is-edit="editProductionTypeInfo.dialogStatus !== 'create'" :type-id="editProductionTypeInfo.typeId"/>
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsTypeList, deleteGoodsType } from '@/api/productionType'
import ProductTypeDetail from './components/ProductTypeDetail'

export default {
  name: 'Index',
  components: { ProductTypeDetail },
  data: function() {
    return {
      list: [],
      total: null,
      listLoading: true,
      textMap: {
        update: '编辑商品类别',
        create: '添加商品类别'
      },
      editProductionTypeInfo: {
        dialogVisible: false,
        dialogStatus: '',
        typeId: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGoodsTypeList().then(response => {
        this.listLoading = false
        this.list = response.data
        this.total = response.total
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该品牌', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = {
          typeId: row.typeId
        }
        deleteGoodsType(query).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    },
    handleUpdate(index, row) {
      this.editProductionTypeInfo.dialogVisible = true
      this.editProductionTypeInfo.dialogStatus = 'update'
      this.editProductionTypeInfo.typeId = row.typeId
    },
    handleAddProductType() {
      this.editProductionTypeInfo.dialogVisible = true
      this.editProductionTypeInfo.dialogStatus = 'create'
      this.editProductionTypeInfo.typeId = 0
    }
  }
}

</script>
<style scoped>

</style>
