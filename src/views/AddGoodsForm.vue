<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 商品
                </el-breadcrumb-item>
                <el-breadcrumb-item>新增商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px" :inline='true'>
                    <el-row>
                        <el-col :span='8'>
                            <el-form-item label="商品名称：">
                                <el-input v-model="form.goodsName" placeholder="请输入商品名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='8'>
                            <el-form-item label="商品类型：">
                                <el-select v-model="form.goodsKindId" placeholder="请选择商品类型">
                                    <el-option v-for="item in goodsKindList" :key='item.kindId' :label="item.kindName" :value="item.kindId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品是否自营：">
                                <el-select v-model="form.goodsIsSelf" placeholder="商品是否为自营商品">
                                    <el-option label="是" :value="1"></el-option>
                                    <el-option label="否" :value="0"></el-option>
                                </el-select>             
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row>
                      
                      <el-col :span="20">
                        <el-form-item label="商品描述：">
                            <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 6 }" placeholder="请输入商品的描述信息"  v-model="form.goodsDetail"></el-input>
                        </el-form-item>
                      </el-col>
                      
                    </el-row>
                   <el-divider></el-divider>
                   <p class="versionTitle">商品版本详情：</p>   
                    <el-row  v-for="(item, index) in form.goodsVersions" :key="item.goodsVersionDetail">
                         <el-col :span="5">
                            <el-form-item label="商品版本名称:">
                                 <el-input v-model="item.goodsVersionDetail" placeholder="请输入版本名称" ></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="5">
                            <el-form-item label="版本图片地址:">
                                 <el-input v-model="item.versionPhotoUrl" placeholder="在此键入版本图片地址" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="商品库存:">
                                <el-input v-model.number="item.versionInvn" placeholder="请输入该版本库存"></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="5">
                            <el-form-item label="商品版本价格:">
                                 <el-input-number v-model="item.goodsPrice" :precision="2" :step="1" :min="0" ></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" class="itemDelete">
                            <el-button type="danger" @click="deleteItem(index)">删除{{index+1}}号版本</el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-button type="primary" icon="el-icon-plus" @click="AddVersion">增加版本</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='10'></el-col>
                        <el-col :span='8'>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">增加该商品</el-button>
                                <el-button type="primary" @click="goindex">fdsafasd</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-col>
                       
                    </el-row>
                    
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            options: [
                {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],
            goodsKindList: [],
            form: {
                goodsName: '',
                goodsKindId: '',
                delivery: true,
                goodsDetail: '',
                goodsVersions: [
                    {
                        goodsVersionDetail: '',
                        goodsPrice: 0,
                        versionPhotoUrl: '',
                        versionInvn: ''
                    }
                ]
            }
        };
    },
    mounted() {
        this.getKindList()
    },
    methods: {
        // getKinds
        getKindList() {
            this.yhService.get('/backSuApi/admin/getKind').then(res => {
                this.goodsKindList = res
            })
        },
        onSubmit() {
            let { goodsVersions } = this.form
            let canSubmit = 0
            let isAnyVersionPriceIsZero = 0
            // 检测版本信息中是否有空值
            for ( let item of goodsVersions ) {
                if(item.goodsVersionDetail && item.versionPhotoUrl && item.versionInvn) {
                    canSubmit ++
                    if( item.goodsPrice === 0 ) {
                        isAnyVersionPriceIsZero ++
                    }
                }
            }
            if(canSubmit === goodsVersions.length) {
                if(!isAnyVersionPriceIsZero) {
                    this.yhService.post('/backSuApi/admin/addGoods', this.form).then(res => {
                        if(res) {
                            this.$message.success('添加商品成功！')
                            this.$router.push({
                                path: '/tableOfGoods'
                            })
                        } else {
                            this.$message.error('添加商品失败，请联系管理员重试')
                        }
                    })
                    console.log(this.form)
                } else {
                    this.$confirm('检测到您有版本价格为零, 是否继续新增该商品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        console.log(this.form)
                        this.yhService.post('/backSuApi/admin/addGoods', this.form).then(res => {
                            if(res) {
                                this.$message.success('添加商品成功！')
                                
                            } else {
                                this.$message.error('添加商品失败，请联系管理员重试')
                            }
                        })
                        this.$message({
                            type: 'success',
                            message: '新增商品成功!'
                        });
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取新增'
                    });          
                    });
                }
            } else {
                this.$message.error('请完善信息后再提交！')
            }
        },
        goindex() {
            
        },
        // 新增版本
        AddVersion() {
            this.form.goodsVersions.push(
                {
                    goodsVersionDetail: '',
                    goodsPrice: 0,
                    versionPhotoUrl: '',
                    versionInvn: ''
                }
            )
        },
        // 删除版本
        deleteItem(index) {
            if ( this.form.goodsVersions.length !== 1) {
                this.form.goodsVersions.splice(index, 1 )
            } else {
                this.$message.error('至少有一个版本数')
            }
            
        }

    }
};
</script>

<style lang='scss' scoped >
.versionTitle {
    margin-bottom: 30px;
}     
.el-form-item {
    text-align: center;
    .el-input {
        width: 260px;
    }
}
.itemDelete{ 
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>