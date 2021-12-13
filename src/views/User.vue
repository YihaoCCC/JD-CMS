<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="请输入用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
               
                <el-table-column type="index" label="ID" width="55" align="center"></el-table-column>
                 <el-table-column  label="用户名" align="center"  >
                    <template #default="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column  label="手机号" align="center"  >
                    <template #default="scope">+86 {{ scope.row.phone }}</template>
                </el-table-column>
                <el-table-column prop="sex" label="性别"  align="center" ></el-table-column>
                <el-table-column prop="points" label="用户当前积分"  align="center"  ></el-table-column>
                <el-table-column label="用户类型" align="center"  >
                    <template #default="scope">
                        <el-tag
                            :type="
                                scope.row.role === '用户'
                                    ? 'success'
                                    : 'warning'
                            "
                        >{{ scope.row.role }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template #default="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            :disabled='scope.row.role === "用户"'
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
              <el-button type="primary" plain  @click="backIndexPage" v-show='pageNum > 1'>
                   回到首页
                </el-button>
               <el-button type="primary" @click="nextPage">
                   下一页
               </el-button>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form ref="form" :model="formItem" label-width="100px">
                <el-form-item label="密码：">
                    <el-input v-model="formItem.pswd" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户类型："   >
                    <el-input placeholder="" disabled v-if="formItem.role === '用户' " v-model="formItem.role"></el-input>
                    <el-select v-else v-model="status" placeholder="">
                        <el-option
                            label="用户"
                            value="用户"
                            
                            >
                        </el-option>
                        <el-option
                            label="管理员"
                            value="管理员"
                            >
                        </el-option>
                    </el-select> 
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit" v-if="formItem.role !== '用户' " >确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            query: {
                address: "",
                name: "",
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            formItem: {},
            idx: -1,
            id: -1,
            pageNum: 1,
            status: ''
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
             this.yhService.get(`/backSuApi/admin/user/queryAll/${this.pageNum}`).then(res => {
                if(res.length !== 0) {
                    this.tableData = res
                } else {
                    this.$message.warning('没有更多数据了')
                }
            })
        },
        // 触发搜索按钮
        handleSearch() {
            // this.$set(this.query, "pageIndex", 1);
            // this.getData();
            this.$message.info('coder正在奋笔疾书中......')
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.formItem = row;
            this.editVisible = true;
            console.log(this.formItem);
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            console.log(this.status)
            
        },
        // 分页导航
        handlePageChange(val) {
            this.pageNum = val
            this.getData();
        },
        nextPage() {
            this.pageNum ++
            this.getData();
        },
        backIndexPage() {
            this.pageNum = 1
            this.getData()
        }
    }
};
</script>

<style scoped >
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.orderDetail {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;
}
.orderDetail p {
    width: 900px;
}
.title {
    line-height: 20px;
}
.table-td-thumb {
    display: inline-block;
    margin: auto;
    width: 80px;
    height: 80px;
}
.el-table .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;    
}
</style>
