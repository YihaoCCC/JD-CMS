<template>
    <section class="main">
        <div class="container">
            <div class="block">
                <span class="demonstration">默认 Hover 指示器触发</span>
                <el-carousel    height="150px">
                    <el-carousel-item v-for="item in photos" :key="item">
                        <h3 class="small"><img :src="item.imgsrc" ></h3>
                    </el-carousel-item>
                </el-carousel>
            </div>

        </div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-global"></i>
                    {{$t('i18n.breadcrumb')}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <span>{{$t('i18n.tips')}}</span>
            <el-button
                type="primary"
                @click="$i18n.locale = $i18n.locale === 'zh-cn'?'en':'zh-cn';"
            >{{$t('i18n.btn')}}</el-button>
            <div class="list">
                <h2>{{$t('i18n.title1')}}</h2>
                <p>{{$t('i18n.p1')}}</p>
                <p>{{$t('i18n.p2')}}</p>
                <p>{{$t('i18n.p3')}}</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "i18n",
    data(){
        return{
            photos:[
                {imgsrc: require('../assets/img/img.jpg')},
                {imgsrc: require('../assets/img/login-bg.jpg')}
            ]
        }
    }
};
</script>

<style scoped>
.list {
    padding: 30px 0;
}
.list p {
    margin-bottom: 20px;
}

 .el-carousel__item h3 {
     color: #475669;
     font-size: 14px;
     opacity: 0.75;
     line-height: 150px;
     margin: 0;
 }

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
.block{

    text-align: center;
}

</style>
