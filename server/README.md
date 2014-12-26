OurTimes服务端配置与启动  
-----------  
+ Node.js    
+ MongoDB  
+ 在使用mongodb + node.js的过程中，我建议服务功能单一化，这样更容易维护。node.js作为服务的中间层最为合理。   
+ 启动：npm install && node app.js 
   

#### Service URL(目前使用到的服务)
| 描述 | url |
| ------------- | --- |
| 用户注册 | [/user/register](/user/register) | 
| 用户登录 | [/user/login](/user/login) | 
| 获取一般用户信息 | [/user/getCommon](/user/getCommon) | 
| 获取自己的信息 | [/user/getSelf](/user/getSelf) | 
| 根据昵称获取普通用户信息 | [/user/getCommon/name](/user/getCommon/name) | 
| 获取“ben”用户信息 | [/user/getBen](/user/getBen) | 
| 获取单个“ben”用户信息 | [/user/singleBen](/user/singleBen) | 
| 获取所有用户信息 | ['/user/getAll]('/user/getAll) | 
| 根据邮箱或者昵称或者真实姓名查询用户 | [/user/getByCondition](/user/getByCondition) | 
| 更新“ben”用户信息 | [/user/updateBen](/user/updateBen) | 
| 更新一般用户信息(去敏感) | [/user/updateCommon](/user/updateCommon) | 
| 删除用户 | [/user/delete](/user/delete) | 
| 更新用户标签(角色) | [/user/updateTag](/user/updateTag) | 
| 更新用户密码 | [/user/updatePassword](/user/updatePassword) | 
| 创建微博 | [/wei/create](/wei/create) | 
| 获取微博 | [/wei/get](/wei/get) | 
| 删除微博 | [/wei/delete](/wei/delete) | 
| 微博点赞 | [/wei/zan](/wei/zan) | 
| 评论微博 | [/wei/comment](/wei/comment) | 
| 置空敏感信息 | [/wei/set2null](/wei/set2null) | 
| 根据某个条件查询微博 | [/wei/getByCondition](/wei/getByCondition) | 
| 获取自己的微博 | [/wei/getByToken](/wei/getByToken) | 
| 上传图片 | [/upload/img](/upload/img) | 
| 创建文章 | [/article/create](/article/create) | 
| 获取文章简介 | [/article/get](/article/get) | 
| 根据ID获取文章详情 | [/article/get/id](/article/get/id) | 
| 系统发送邮件 | [/email/findPassword](/email/findPassword) | 
