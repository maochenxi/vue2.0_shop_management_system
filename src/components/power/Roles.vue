<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--添加角色的对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主体区域-->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色的对话框-->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主体区域-->
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editRole">确定</el-button>
      </span>
    </el-dialog>
    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="rightDialogClosed"
    >
      <!--树形控件-->
      <el-tree :default-expand-all="true" :data="rightsList" :props="treeProps" show-checkbox node-key="id"
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotKeys">确 定</el-button>
  </span>
    </el-dialog>
    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="rolesList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
                    :class="['bdbottom', i1 === 0?'bdtop':'', 'vcenter']">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeTagsById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for渲染二级权限-->
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0?'':'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeTagsById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeTagsById(scope.row, item3.id)" type="warning"
                            v-for="(item3) in item2.children" :key="item3.id">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="300px">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleById(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUsersById(scope.row.id)">删除
            </el-button>
            <el-tooltip content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<!--未来-->
<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 所有权限列表
      rightsList: [],
      // 分配权限树形控件的配置对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      roleId: '',
      // 添加角色的表单内容
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      editForm: {},
      addRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: blur
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: blur
          }
        ]
      },
      editRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: blur
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: blur
          }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },
    // 删除角色
    async deleteUsersById (id) {
      const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message.info('已取消删除')
      })
      if (confirm !== 'confirm') return
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    // 添加角色
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 用id获取角色的信息
    async showEditRoleById (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 确定修改角色信息
    editRole () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败')
        this.editDialogVisible = false
        this.$message.success('编辑角色信息成功！')
        this.getRolesList()
      })
    },
    async removeTagsById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('已取消了删除')
      const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
      if (res.meta.status !== 200) return this.$message.error('删除角色权限失败')
      role.children = res.data
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      // 递归获取三级节点的id
      this.getDefaultKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的方式，获取所有三级标签的id，保存到defaultKeys数组中
    getDefaultKeys (node, arr) {
      // 如果当前是第三级标签
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果不是第三级标签，遍历进行递归
      node.children.forEach(item => this.getDefaultKeys(item, arr))
    },
    // 监听分配权限对话框的关闭
    rightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定为角色分配权限
    async allotKeys() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const str = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: str })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px 7px 7px 14px;
}

.bdtop {
  border-top: 1px solid #eee
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  /*纵向上的居中对齐*/
  display: flex;
  align-items: center;
}
</style>
