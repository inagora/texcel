# Texcel
Texcel本身没有实现excel的解析和处理，它只是补充[ExcelJS](https://github.com/exceljs/exceljs/)的一些接口，方便使用。比如读取excel中的数据，下载excel，设置样式等。此文档旨在介绍ExcelJS的用法，如果有涉及texcel增加的接口，会标识出来。官方原文档[>看这里](https://github.com/exceljs/exceljs/)。

### 引入texcel
#### 通过import引入
方法就是很通用的，先安装，再使用
``` shell
npm install texcel --save-dev
```
使用texcel
``` javascript
import ExcelJS from 'texcel';

// 创建一个excel
const wb = new ExcelJS.Wrokbook();
```
#### 直接script标签在页面引入texcel
texcel本身的代码量很小，只有几K。可以把ExcelJS和texcel分开加载
``` html
<script src="https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@inagora/texcel/dist/texcel.min.js"></script>
```
当然，也可以用`texcel.bundle.min.js`，它把exceljs.min.js和texcel.min.js打包到了一起。
``` html
<script src="https://cdn.jsdelivr.net/npm/@inagora/texcel/dist/texcel.bundle.min.js"></script>
```
### 浏览器里读取excel
浏览器获取文件的方式大概有三种：input组件、拖拽、剪切板粘贴，不管哪种方式，最终都会获得file对象，比如
``` html
<input type="file" onchange="getExcel(event)" />

<script>
	async function getExcel(e) {
		// 获得文件对象file
		const file = e.target.files[0];
		// 通过工具方法readFile获得workbook实例
		const workbook = await ExcelJS.util.readFile(file);
		console.log(workbook);
	}
</script>
```
如上代码，通过input组件获得文件对象后，就可以用使用工具方法readFile获得一个Workbook实例了。然后通过这个实例的方法和属性，就可以操作excel了。

### 直接把数据下载成excel
要把数据保存成excel下载下来，首先得整理数据，以aoa（array of array）或者aoo（array of object）来存，比如
``` javascript
// aoa 格式的数据
const data1 = [
	[ 'name', 'sex', 'age' ],
	[	'张三', '男', '22' ],
	[ '李四', '女', '21' ]
];

// aoo 格式的数据
const data2 = [
	{
		name: '张三',
		sex: '男',
		age: '22'
	},
	{
		name: '李四',
		sex: '女',
		age: '21'
	}
];
```
然后用工具方法writeFile保存成excel下载
``` javascript
ExcelJS.util.writeFile('人员.xlsx', data1 );
ExcelJS.util.writeFile('人员2.xlsx', data2 );
```
