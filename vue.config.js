module.exports={
    devServer:{
        port:8080,
        proxy:{
            // 服务器1：朱禹兴： http://192.168.43.86:8080
            '/backYuApi':{ 
                target:'http://crocuta.5gzvip.91tunnel.com/',
                changeOrigin:true,
                pathRewrite:{
                    '/backYuApi':''
                }
            },
             // 服务器2：尚妍： http://192.168.226:8080
             '/backYanApi': {
                 target: 'http://192.168.43.226:8080',
                 changeOrigin: true,
                 pathRewrite: {
                    '/backYanApi': ''
                 }
             },
             // 服务器3：苏聪杰：http://192.168.43.149:8080
             '/backSuApi': {
                 target: 'http://192.168.43.149:8080',
                 changeOrigin: true,
                 pathRewrite: {
                     'backSuApi': ''
                 }
             }
        },
        hot:true,
 
    },
     productionSourceMap:false,
     chainWebpack:(config)=>{
         config.plugins.delete('prefetch')
     }
 
 }