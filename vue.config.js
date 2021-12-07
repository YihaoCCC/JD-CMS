module.exports={
    devServer:{
        port:8080,
        proxy:{
            '/api':{
                target:'http://192.168.43.86:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
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