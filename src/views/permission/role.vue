<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'添加角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 1, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            :default-expand-all="true"
            node-key="name"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoles, getRoutes, addRole, getRoutesByRoleId, deleteRole } from '@/api/role'
import { deepClone } from '@/utils'

const defaultRole = {
  id: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'submenu',
        label: 'name'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    generateRoutes(routes) {
      const res = []

      for (let route of routes) {
        const onlyOneShowingChild = this.onlyOneShowingChild(route.submenu, route)

        if (route.submenu && onlyOneShowingChild) {
          route = onlyOneShowingChild
        }

        const data = {
          name: route.name
        }

        // recursive child routes
        if (route.submenu.length !== 0) {
          data.submenu = this.generateRoutes(route.submenu)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      const data = []
      routes.forEach(route => {
        data.push(route)
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
      const res = await getRoutesByRoleId(this.role.id)
      this.$nextTick(() => {
        // const routes = this.generateRoutes(res.data.tbMenuList)
        this.$refs.tree.setCheckedNodes(this.generateArr(res.data.tbMenuList))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    generateTree(routes, checkedKeys) {
      const res = []

      for (const route of routes) {
        // recursive child routes
        if (route.submenu.length !== 0) {
          route.submenu = this.generateTree(route.submenu, checkedKeys)
        }

        if (checkedKeys.includes(route.name) || (route.submenu && route.submenu.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const ids = [row.id]
          await deleteRole(ids)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succeed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log(checkedKeys)
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), checkedKeys)

      if (isEdit) {
        console.log('123')
      } else {
        const request = {
          id: 12345,
          name: this.role.name,
          tbMenuList: this.role.routes
          // tbResourceList: []
        }
        const { data } = await addRole(request)
        this.role.id = request.id
        this.rolesList.push(this.role)
      }

      const { description, id, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${id}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
</style>
