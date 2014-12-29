###一、MongoDB安装及配置
####MongoDB安装
**linux EV: centOS**

	1. 下载linux-64压缩包
	2. 解压tar -zxvf mongodb-linux-i686-2.6.6.tgz
	3. 配置文件：mongodb/bin/mongodb.conf
		fork = true 
		bind_ip = 127.0.0.1
		port = “server/config.json文件中的端口”
		dbpath = /mongodb/data/db/ 
		logpath = /mongodb/log/mongodb.log
		logappend = true
		journal = false 
	4. 启动Mongodb进程 ./mongodb -f mongodb.conf


**windows EV**
	
	1. 下载win-64版本
	2. 在对应文件下建立data/db 和 config目录
	3. 在启动服务目录下建立start.bat文件，里面输入：
	   mongod --dbpath "d:\pcode\MongoDB\data\db" --logpath "d:\pcode\MongoDB\log\mongo.log" 
	   --logappend -auth --port 端口
    4. 双击start.bat文件即可启动

####创建数据库用户
1. 创建数据库，按照server/config.json文件即可；里面有对应的数据库名称、用户、密码
2. 启动mongodb 命令行客户端，必要情况下，加入到环境变量中
   mongo --port 端口号
   > show dbs;
   > use 数据库名称(例如，myDB)
   > myDB.addUser('数据库管理员名称', '管理员密码');
   > 1 =>OK

####创建项目的管理员用户
	由于注册用户服务默认是guest用户，但是在后台需要admin用户才能管理。为了各整个网站(系统)一个管理员账户。因此，有两种方式：
	1.修改server/lib/user的用户模型
	var user = {
            userid: guid.create() + '-' + mcrypto.md5Password(params.email).toUpperCase(),
            token: guid.create(),
            email: xss(params.email),
            password: mcrypto.md5Password(params.password),
            time: new Date(),
            tag: USER_TYPE.GUEST, //这里改为USER_TYPE.ADMIN，将自己的账户注册为管理员用户
            nickname: '',
            realname: '',
            avatar: SERVER_URL + 'zhu.png',
            address: '',
            job: '',
            tel: '',
            hometown: '',
            sign: '',
            hometown_lnglat: '',
            address_lnglat: ''
        };
     2. 手动在mongodb中insert改模型的一条记录
     
###二、Node.js服务配置
	1. 修改自己的Node服务端口：server/app.js文件中的port，可以不改
	2. 修改server/config中对应的port与app.js一致，可以不改
	3. 修改server/util/mcrypto.js中的加密算法，可以不改
	4. 修改server/util/guid生成方式等，可以不改
	5. 等确认了静态文件服务后，修改config中email_server和uploadRedirectUrl。
	6. 其中uploadRedirectUrl对应是上传完成中重定向的页面，这个后面静态服务器部署好后再修改


###三、静态服务器配置
	1. 如果是本地，推荐使用HBuilder，这个工具自动启一个静态服务。
	2. 修改client-web && client-admin下lib/main.js中的SERVER_BASE_URL，对应你的node服务启动的端口和IP
	3. 上传配置，这里是为了不使用第三方库，所以直接Form表单；因此，修改client-web下views/contacts/userinfo.html
	  中的form表单的action="http://127.0.0.1:3000/upload/img/"这个对应第二个"Node.js服务配置"中的6。
###四、整体顺序
	1. 安装MongoDB && 配置(数据库管理员) 
	2. 修改Node.js服务配置，包括端口以及加密随机算法等(上线后一定要改)。
	3. 系统管理员(可以ajax post一个注册服务) 
	4. 修改静态服务器的页面相关配置




