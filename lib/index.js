import { saveAs } from 'file-saver';

const util = {
	/**
	 * worksheet直接下载
	 */
	async writeFile(file, aoa, options){
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet('Sheet1');
		if(options.columns) {
			sheet.columns = options.columns;
		}
		if(aoa) {
			if(!Array.isArray(aoa)) {
				aoa = [aoa];
			}
			if(!options.columns && !Array.isArray(aoa[0])) {
				sheet.columns = Object.entries(aoa[0]).map(item=>({header: item[0], key: item[0]}));
			}
			sheet.addRows(aoa);
		}
		await workbook.writeFile(file);
	},

	readFile(file) {
		return new Promise((resolve)=>{
			const reader = new FileReader();
			reader.onload = function(){
				const buffer = reader.result;
				let type = 'xlsx';
				if(file.type=='text/csv' || /\.csv$/i.test(file.name)) {
					type = 'csv';
				}
				const wb = new ExcelJS.Workbook();
				wb[type].load(buffer).then(()=>resolve(wb));
			};
			reader.readAsArrayBuffer(file);
		});
	},

	async getFileData(file, options={}) {
		const wb = await utils.readFile(file);
		const ws = wb.worksheets[0];
		return ws.getData(options);
	}
};
const workbookPrototypeEx = {
	async writeFile(file, options) {
		let type = 'xlsx';
		const ret = file.match(/(?<name>.+?)\.(?<type>xlsx|csv)$/i);
		if(ret) {
			file = ret.groups.name;
			type = ret.groups.type.toLowerCase();
		}
		const buffer = await this[type].writeBuffer();
		saveAs(new window.Blob([buffer]), file+'.'+type);
	}
};
const worksheetPrototypeEx = {
	getData(options){
		const values = this.getSheetValues().map(row=>{
			row.shift();
			return row;
		});
		const type = options.header;
		if(type == 1) {
			return values;
		} else {
			let columns = [];
			if(type == 'A') {
				this.getRow(1).eachCell(cell=>{
					columns.push(cell.address.slice(0, -1));
				});
			} else if(Array.isArray(type))  {
				columns = type;
			} else {
				columns = rows[0].map((col,idx)=>col||'_col_'+idx);
				values.shift();
			}
			return values.map(row=>{
				return Object.fromEntries(
					columns.map(
						(c,idx)=>[c, row[idx]]
					)
				);
			});
		}
	}
};
const _tempWb = new ExcelJS.Workbook();
const _tempWs = _tempWb.addWorksheet('temp');
Object.assign(ExcelJS.Workbook.prototype, workbookPrototypeEx);
Object.assign(_tempWs.constructor.prototype, worksheetPrototypeEx);
_tempWb.removeWorksheet(_tempWs.id);

ExcelJS.util = util;
