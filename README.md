# yapi-plugin-import-swagger-customize
yapi自定义导入swagger数据

### 特性

* 新增、更新指定名称接口
* 新增、更新多个接口用,隔开
* 更新接口支持下拉菜单、多选和搜索
* 支持保存swaggerUrl

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

使用yapi命令下载插件时，本配置会自动添加

```json
"plugins": [
  {
    "name": "import-swagger-customize"
  }
]
```
### 新增接口
![add](https://user-images.githubusercontent.com/20868829/61109083-9ad27e00-a4b6-11e9-9805-5e6a977bc0ff.png)

### 更新接口
![update](https://user-images.githubusercontent.com/20868829/61109045-7e364600-a4b6-11e9-9a89-dfe52e6716be.png)
