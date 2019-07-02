# yapi-plugin-import-swagger-customize
yapi自定义导入swagger数据

### 特性

* 新增、更新指定名称接口
* 新增多个接口用,隔开
* 更新接口支持下拉菜单、多选和搜索

### 安装插件

> 安装ykit（已经装过的请忽略）

```shell
npm install -g ykit
```

> 安装yapi（已经装过的请忽略）

```shell
npm install -g yapi-cli --registry https://registry.npm.taobao.org
```
> 安装插件

```shell
yapi plugin --name yapi-plugin-import-swagger-customize
```

### 在config.json中新增插件配置
```json
"plugins": [
  {
    "name": "import-swagger-customize"
  }
]
```
### 效果图
![render](https://user-images.githubusercontent.com/20868829/60428823-56c8b900-9c2c-11e9-8b7d-951f2e24e022.jpeg)
