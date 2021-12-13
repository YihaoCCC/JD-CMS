<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="商品名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                max-height="630"
            >
               
                <el-table-column type="index" label="ID" width="55" align="center"></el-table-column>
                <el-table-column  label="商品名称" align="center" width="240px" >
                    <template #default="scope">{{ scope.row.goodsName }}</template>
                </el-table-column>
                <!-- <el-table-column prop="goodsPrice" label="商品价格"  align="center" width="100" ></el-table-column> -->
               <el-table-column label="商品价格" align="center">
                   <template #default="scope">￥{{ scope.row.goodsPrice }}</template>
                </el-table-column>
                <el-table-column label="图片(点击查看大图)" align="center" width="160">
                    <template #default="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.photoUrl"
                            :preview-src-list="[scope.row.photoUrl]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsIsSelf" label="商品是否自营"  align="center" width="140px">
                    <template #default='scoped'>
                        <button style="border:none;background:none">
                            <el-tag :type=" scoped.row.goodsIsSelf? '':'danger'">
                                {{ scoped.row.goodsIsSelf ? '自营' : '非自营'}}
                            </el-tag>
                        </button>
                       
                    </template>
                </el-table-column>
                <el-table-column label="促销状态" align="center" width="140">
                    <template #default="scope">
                        <el-tag
                            :type="
                                scope.row.promotionDetail === '满300减20'
                                    ? 'success'
                                    : scope.row.promotionDetail === '满500减60'
                                    ? ''
                                    : !scope.row.promotionDetail
                                    ? 'danger'
                                    : 'warning'
                            "
                        >{{ scope.row.promotionDetail || '无优惠' }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="是否上架" align="center">
                    <template #default='scoped'>
                        <el-tag
                            :type="
                                scoped.row.goodsStatus === 1
                                    ? 'success'
                                    : 'danger'
                            "
                        >
                        {{scoped.row.goodsStatus === 1 ? '已上架' : '已下架'}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="goodsInvn" label="库存" align="center" width="80px"></el-table-column>
                <el-table-column prop="date" label="版本信息" align="center">
                    <template #default='scoped'>
                       {{scoped.row.goodsVersions.length}} 个版本
                    </template>
                </el-table-column>
                <el-table-column align="center" label="详情" type="expand" width="50px" >
                   <template #default="scope">
                        <div >商品版本详情：（点击图片查看大图）
                            <div class="orderDetail" v-for="item in scope.row.goodsVersions" :key="item.goodsVersionId">
                                <p style="margin-top:10px"> <em style="font-size:12px;color:#e1251b"> 价格:</em> {{item.goodsPrice}} <em style="font-size:12px;color:#e1251b">版本：</em> {{item.goodsVersionDetail}} <em style="font-size:12px;color:#e1251b">库存：</em>{{item.versionInvn}}</p> 
                                 <el-image
                                    class="table-td-thumb"
                                    :src="item.versionPhotoUrl"
                                    :preview-src-list="[item.versionPhotoUrl]"
                                ></el-image>
                            </div>
                            评论信息：
                            <div class="goodsComment" v-for="item in scope.row.reviews" :key="item.reviewId" :title="item.reviewMessage">
                                <span>{{item.userName}}</span>
                                <p>{{item.reviewMessage}}</p>
                            </div>
                           
                        </div>
                        
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template #default="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            :disabled='scope.row.promotionDetail!==null'
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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
        <el-dialog title="新增促销" v-model="editVisible" width="30%">
            <el-form ref="form" label-width="80px">
                <el-form-item label="添加促销:">
                    <span style="display:block">促销触发价格（最低300）</span>
                    <el-input-number v-model="promotionStartNum" :min="300" :step="100" />
                    <span style="display:block">促销满减优惠(最低20)</span>
                    <el-input-number v-model="promotionNum" :min="20" :step="10" />   
                </el-form-item>
                <el-form-item label="优惠区间:">
                   <el-date-picker
                        v-model="TimeValue"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="截至日期"
                    >
                    </el-date-picker>
                    <span class="demonstration">默认从开始日期9:00开始, 至截至日期23:59结束</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">修改商品促销信息</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
// import { fetchData } from "../api/index";
export default {
    name: "basetable",
    data() {
        return {
            query: {
                address: "",
                name: "",
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            pageNum: 1,
            TimeValue: [],
            promotionStartNum: 300, 
            promotionNum: 20,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.yhService.get(`/backSuApi/admin/queryAll/${this.pageNum}`).then(res => {
                if(res.length !== 0) {
                    this.tableData = res
                } else {
                    this.$message.warning('没有更多数据了')
                }
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.yhService.get(`/backSuApi/admin/queryByGoodsName/${this.query.name}`).then(res=> {
                if(res.length!==0) {
                    this.tableData = res
                } else {
                    this.$message.warning('没有搜索到相关数据！')
                }
            })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm("该商品已经上架，确定要删除此商品吗？", "来自达达利亚的提示", {
                type: "warning"
            })
                .then(() => {
                    this.yhService.delete(`/backSuApi/admin/deleteGoods/${row.goodsId}`).then(res => {
                        if(res) {
                            this.$message.success("删除成功");
                            this.tableData.splice(index, 1);
                            history.go(0)        
                        }
                    }).catch(res=> {
                        return new Promise(res)
                    })
                    
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            console.log(row.goodsId+"````````"+index);
        },
        // 保存编辑
        saveEdit() { 
            if(!this.TimeValue[0]) {
                this.$message.error('时间区间不可有空值')
            } else {
                let d1 = new Date(this.TimeValue[0].toString())
                let d2 = new Date(this.TimeValue[1].toString())
                let startTime =  d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate()
                let endTime = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate()
                this.yhService.post('/backSuApi/admin/promotion/add', {
                    goodsId: this.form.goodsId,
                    promotionFull: this.promotionStartNum,
                    promotionSub: this.promotionNum,
                    startTime,
                    endTime
                }).then(res => {
                    if(res) {
                        this.$message.success('修改成功！')
                        this.editVisible = false;
                        history.go(0)
                    } else {
                        return 0
                    }
                }) 
             
            }
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

<style >
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
.orderDetail {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;
}
.goodsComment {
    display: flex;
    align-items: center;
    margin: 6px 0;
    color: #777;
}
.goodsComment p {
    margin-left: 100px;
    width: 800px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.goodsComment span {
    width: 50px;
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.el-table .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;    
}
.table-td-thumb {
    display: inline-block;
    margin: auto;
    width: 50px;
    height: 50px;
}
.el-dialog__body{
    padding: 10px 30px;
}

</style>
