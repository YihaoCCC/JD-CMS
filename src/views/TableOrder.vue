<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 这里是所有的订单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="请输入收货人姓名" class="handle-input mr10"></el-input>
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
                 <el-table-column  label="订单号" align="center" width="280px" >
                    <template #default="scope">{{ scope.row.orderId }}</template>
                </el-table-column>
                 <el-table-column align="center" label="订单详情" type="expand" width="80px" >
                    <template #default="scope">
                        <div >订单详情：（点击图片查看大图）
                            <div class="orderDetail" v-for="item in scope.row.orderDetails" :key="item.goodsId">
                                <p>{{item.goodsName}} x {{item.number}} {{item.goodsVersionDetail}}</p> 
                                 <el-image
                                    class="table-td-thumb"
                                    :src="item.versionPhotoUrl"
                                    :preview-src-list="[item.versionPhotoUrl]"
                                ></el-image>
                            </div>
                           
                        </div>
                        
                    </template>
                </el-table-column>
                
                <el-table-column  label="收获人信息" align="center" width="200px" >
                    <template #default="scope">{{ scope.row.address.name }} --- {{scope.row.address.phone}}</template>
                </el-table-column>
                <el-table-column prop="oriAmount" label="订单原价（￥）"  align="center" width="100" ></el-table-column>
                <el-table-column prop="realAmount" label="订单总价（￥）"  align="center" width="100" ></el-table-column>
                <el-table-column label="订单状态" align="center" width="120" >
                    <template #default="scope">
                        <el-tag
                            :type="
                                scope.row.orderStatus === '待评价'
                                    ? 'success'
                                    : scope.row.orderStatus === '待付款'
                                    ? 'warning'
                                    : scope.row.orderStatus === '待发货'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ scope.row.orderStatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" prop="orderTime" align="center" width="100px"></el-table-column>
                <el-table-column  label="收获地址信息" align="center">
                    <template #default='scoped'>
                        {{scoped.row.address.city}}{{scoped.row.address.area}}{{scoped.row.address.addressDetail}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template #default="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            :disabled='scope.row.orderStatus === "待评价" '
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="pageNum"
                    :page-size="10"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改订单状态" v-model="editVisible" width="30%">
            <el-form ref="form" :model="formItem" label-width="100px">
                <el-form-item label="原状态：">
                    <el-input v-model="formItem.orderStatus" disabled></el-input>
                </el-form-item>
                <el-form-item label="选择新状态："  >
                    <el-select v-model="status" placeholder="">
                        <el-option
                            label="待发货"
                            value="待发货"
                            :disabled='true'
                            >
                        </el-option>
                        <el-option
                            label="待收货"
                            value="待收货"
                            :disabled='formItem.orderStatus === "待收货" '
                            >
                        </el-option>
                        <el-option
                            label="待评价"
                            value="待评价"
                            :disabled='(formItem.orderStatus === "待评价" || formItem.orderStatus === "待发货") '
                            >
                        </el-option>
                    </el-select> 
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
// import { fetchData } from "../api/index";
export default {
    name: "BaseTableOrder",
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
        // 获取 easy-mock 的模拟数据
        getData() {
            // fetchData(this.query).then(res => {
            //     console.log(res);
            //     this.tableData = res.list;
            //     this.pageTotal = res.pageTotal || 50;
            // });
             this.yhService.get(`/backSuApi/admin/order/queryAll/${this.pageNum}`).then(res => {
                this.tableData = res.complexOrders
                this.pageTotal = res.total
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
            this.yhService.get(`/backSuApi/admin/order/modify/${this.formItem.orderId}/${this.status}`).then(res => {
                if(res) {
                    this.$message.success('修改成功！')
                    history.go(0)
                }
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.pageNum = val
            this.getData();
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
