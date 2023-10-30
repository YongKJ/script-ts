import * as path from "path";
import * as XLSX from "xlsx-js-style";
import {Coords} from "../pojo/po/Coords";
import {CellObject, CellStyle, ColInfo, Range, RowInfo, WorkBook, WorkSheet} from "xlsx-js-style";
import {FileUtil} from "./FileUtil";

export class SheetUtil {

    private static workbook: WorkBook | null = null;
    //行高
    private static height: number = 36;
    //数据行
    private static dataRow: number = -1;
    //自动设置列宽
    private static widthAuto: boolean = false;
    //单元格合并列表
    private static lstRange: Array<Range> = [];
    //列宽列表
    private static lstColInfo: Array<ColInfo> = [];
    //行高列表
    private static lstRowInfo: Array<RowInfo> = [];
    //列表冻结
    private static freezeInfo: Record<string, any> = {};
    //单元格数据列表
    private static lstValue: Array<Array<CellObject>> = [];
    //图片数据列表
    private static lstPicture: Array<Record<string, any>> = [];
    //样式列表
    private static lstCellStyle: Array<CellStyle> = [];
    //移动方向：上、右、下、左
    private static readonly MOVE: Array<Array<number>> = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    //获取excel表数据
    public static toMap(excelName: string, sheetName: string | number, headerRow?: number, headerCol?: number, headerLastCol?: number, dataRow?: number, dataLastRow?: number, extraData?: Map<string, string>): Array<Map<string, string>> {
        let workbook = XLSX.readFile(excelName);
        if (typeof sheetName === "number") {
            sheetName = workbook.SheetNames[sheetName];
        }
        let sheet = workbook.Sheets[sheetName];
        //表数据转数组数据
        let sheetJson = <Array<Array<any>>>XLSX.utils.sheet_to_json(sheet, {header: 1});

        //数据初始化
        headerRow = headerRow || 0;
        headerCol = headerCol || 0;
        dataRow = dataRow || headerRow + 1;
        this.lstRange = sheet["!merges"] || [];
        dataLastRow = dataLastRow || sheetJson.length;
        extraData = extraData || new Map<string, string>();
        headerLastCol = headerLastCol || sheetJson[headerRow].length;

        //列号列表
        let lstHeaderCol: Array<number> = [];
        for (let i = headerCol; i < headerLastCol; i++) {
            lstHeaderCol.push(i);
        }
        //行号列表
        let lstDataRow: Array<number> = [];
        for (let i = dataRow; i < dataLastRow; i++) {
            lstDataRow.push(i);
        }
        return this.getSheetData(sheetJson, headerRow, lstHeaderCol, lstDataRow, extraData);
    }

    //excel表数据解析
    private static getSheetData(sheet: Array<Array<any>>, headerRow: number, headerCol: Array<number>, dataRow: Array<number>, extraData: Map<string, string>): Array<Map<string, string>> {
        //获取列头与列号的对应关系
        let mapHeader = new Map<string, number>();
        for (let col of headerCol) {
            this.getSheetHeader(sheet, mapHeader, headerRow, col);
        }
        //根据列头与列号关系解析表格数据
        let lstData = new Array<Map<string, string>>;
        for (let row of dataRow) {
            let map = this.getSheetBody(sheet, mapHeader, row);
            if (map.size == 0) continue;
            //添加外部数据
            extraData.forEach((v, k) => map.set(k, v));
            lstData.push(map);
        }
        return lstData;
    }

    //列头与列号对应关系
    private static getSheetHeader(sheet: Array<Array<any>>, mapHeader: Map<string, number>, row: number, col: number) {
        //格式化字符串数据
        let value: string = (sheet[row][col] + "").trim();
        mapHeader.set(value, col);
    }

    //获取与列头对应的列数据
    private static getSheetBody(sheet: Array<Array<any>>, mapHeader: Map<string, number>, row: number): Map<string, string> {
        let map = new Map<string, string>;
        if (row > sheet.length) {
            return map;
        }
        for (let [header, col] of mapHeader) {
            //格式化字符串数据
            let value = (sheet[row][col] + "").trim();
            if (value.length == 0) {
                //尝试获取单元格数据
                value = this.getMergedCellValue(sheet, row, col);
            }
            if (value.length == 0) continue;
            map.set(header, value);
        }
        return map;
    }

    //获取合并单元格数据
    private static getMergedCellValue(sheet: Array<Array<any>>, row: number, col: number): string {
        for (let range of this.lstRange) {
            let minCell = range.s;
            let maxCell = range.e;
            if (minCell.r <= row && row <= maxCell.r &&
                minCell.c <= col && col <= maxCell.c) {
                //格式化字符串数据
                return (sheet[minCell.r][minCell.c] + "").trim();
            }
        }
        return "";
    }

    //行高、列宽初始化
    private static init(rowSize: number, colSize: number): void {
        this.dataRow = -1;
        this.lstRange = [];
        this.lstValue = [];
        this.lstColInfo = [];
        this.lstRowInfo = [];
        this.freezeInfo = {};
        this.lstPicture = [];
        this.lstCellStyle = [];
        for (let i = 0; i < rowSize; i++) {
            this.lstValue.push([]);
            this.lstRowInfo.push({});
            for (let j = 0; j < colSize; j++) {
                if (i == 0) {
                    this.lstColInfo.push({});
                }
                this.lstValue[i].push({v: "", t: "s"});
            }
        }
        this.initCellStyle();
    }

    //样式列表初始化
    private static initCellStyle(): void {
        let lstColor = ["F2F2F2", "FAFAFA", "D4D4D4"];
        this.lstCellStyle.push(this.chooseCellStyle(lstColor, 0));
        this.lstCellStyle.push(this.chooseCellStyle(lstColor, 1));
        this.lstCellStyle.push(this.chooseCellStyle(lstColor, 2));
    }

    //单元格样式选择
    private static chooseCellStyle(lstColor: Array<string>, choose: number): CellStyle {
        let cellStyle: CellStyle = {};
        cellStyle.alignment = {};
        cellStyle.border = {};
        cellStyle.font = {};
        if (choose == 0) {
            //设置表头字体样式：粗体、大小
            cellStyle.font = {bold: true, sz: 11};
            //设置背景色
            cellStyle.fill = {fgColor: {rgb: lstColor[0]}, patternType: "solid"};
        } else if (choose == 1) {
            //设置数据显示字体样式：大小
            cellStyle.font = {sz: 10};
            //设置背景色
            cellStyle.fill = {fgColor: {rgb: lstColor[1]}, patternType: "solid"};
        } else if (choose == 2) {
            //设置数据显示字体样式：大小
            cellStyle.font = {sz: 10};
        }
        //设置字体: 微软雅黑
        cellStyle.font.name = "Microsoft YaHei";
        //设置居中：垂直居中、水平居中
        cellStyle.alignment.vertical = "center";
        cellStyle.alignment.horizontal = "center";
        //设置边框宽度、颜色
        cellStyle.border.top = {style: "thin", color: {rgb: lstColor[2]}};
        cellStyle.border.bottom = {style: "thin", color: {rgb: lstColor[2]}};
        cellStyle.border.left = {style: "thin", color: {rgb: lstColor[2]}};
        cellStyle.border.right = {style: "thin", color: {rgb: lstColor[2]}};
        return cellStyle;
    }

    //图片数据写入
    public static writePicture(rowIndex: number, rowOffset: number, colIndex: number, colOffset: number, filePath: string): void {
        //写入单元格数据并设置单元格样式
        let cellStyle = this.getCellStyle(this.dataRow, rowIndex);
        for (let row = rowIndex; row <= rowIndex + rowOffset; row++) {
            for (let col = colIndex; col <= colIndex + colOffset; col++) {
                if (this.widthAuto) {
                    //自动设置列宽
                    this.lstColInfo[col] = {wch: this.getWidthColByAuto(col, "")};
                }
                this.saveCellValue(row, col, cellStyle, "");
                if (col == 0) {
                    //设置行高
                    this.lstRowInfo[row] = {hpt: this.height};
                }
            }
        }
        let index = filePath.lastIndexOf(".");
        let suffix = filePath.substring(index + 1);
        let number = this.lstPicture.length + 1;
        let image: Record<string, any> = {};
        image.position = {};
        image.type = suffix;
        image.opts = {base64: true};
        image.position.attrs = {editAs: 'oneCell'};
        image.position.type = "twoCellAnchor";
        image.name = "image" + number + "." + suffix;
        image.position.from = {row: rowIndex, col: colIndex};
        image.position.to = {row: rowIndex + rowOffset, col: colIndex + colOffset};
        image.data = FileUtil.readFile(filePath);
        this.lstPicture.push(image);
    }

    //表格数据写入
    public static writeCellData(rowIndex: number, colIndex: number, cellData: string): void {
        //写入单元格数据并设置单元格样式
        let cellStyle = this.getCellStyle(this.dataRow, rowIndex);
        if (this.widthAuto) {
            //自动设置列宽
            this.lstColInfo[colIndex] = {wch: this.getWidthColByAuto(colIndex, cellData)};
        }
        this.saveCellValue(rowIndex, colIndex, cellStyle, cellData);
        if (colIndex == 0) {
            //设置行高
            this.lstRowInfo[rowIndex] = {hpt: this.height};
        }
    }

    //表头数据写入
    public static writeHeader(lstHeader: Array<Array<string>>, widthCol?: number, dataCol?: number, lstExcludeRow?: Array<number>): void {
        let colSize = lstHeader.length;
        let rowSize = lstHeader[0].length;
        this.init(rowSize, colSize);
        this.dataRow = rowSize;
        this.widthAuto = widthCol == null;
        let lstFlag = this.getFlagArray(rowSize, colSize);
        for (let row = 0; row < rowSize; row++) {
            for (let col = 0; col < colSize; col++) {
                if (!lstFlag[row][col]) {
                    lstFlag[row][col] = true;

                    let lstCoords = new Array<Coords>();
                    lstCoords.push(Coords.of(lstHeader, row, col));
                    if (lstExcludeRow == null || lstExcludeRow.length == 0 || !lstExcludeRow.includes(row)) {
                        this.checkMergeRange(lstHeader, lstFlag, lstCoords, row, col, lstHeader[col][row]);
                    }

                    this.merge(lstCoords, widthCol);
                }
            }
        }
        //单元格冻结：从上往下，冻结 dataRow 行；从左往右，冻结 dataCol 列
        this.freezeInfo = {
            xSplit: dataCol || 0 + "",
            ySplit: this.dataRow + "",
            activePane: "bottomRight",
            state: "frozen"
        };
    }

    //单元格合并范围递归检查
    private static checkMergeRange(lstHeader: Array<Array<string>>, lstFlag: Array<Array<boolean>>, lstCoords: Array<Coords>, x: number, y: number, value: string): void {
        let colSize = lstHeader.length;
        let rowSize = lstHeader[0].length;
        for (let move of this.MOVE) {
            let moveX = x + move[0];
            let moveY = y + move[1];
            if (0 <= moveX && moveX < rowSize && 0 <= moveY && moveY < colSize && !lstFlag[moveX][moveY]) {
                if (lstHeader[moveY][moveX] === value) {
                    lstFlag[moveX][moveY] = true;
                    lstCoords.push(Coords.of(lstHeader, moveX, moveY));
                    this.checkMergeRange(lstHeader, lstFlag, lstCoords, moveX, moveY, value);
                }
            }
        }
    }

    //单元格合并
    private static merge(lstCoords: Array<Coords>, widthCol?: number): void {
        //单元格坐标排序
        lstCoords.sort((c1, c2) => {
            if (c1.x > c2.x || c1.y > c2.y) {
                return 1;
            } else if (c1.x < c2.x || c1.y < c2.y) {
                return -1;
            } else {
                return 0;
            }
        });
        for (let coords of lstCoords) {
            //设置列宽
            this.lstColInfo[coords.y] = {wch: widthCol || this.getWidthColByAuto(coords.y, coords.value)};
            //设置行高
            this.lstRowInfo[coords.x] = {hpt: this.height};
            //写入单元格数据并设置单元格样式
            let cellStyle = this.getCellStyle(this.dataRow, coords.x);
            this.saveHeaderCellValue(coords.x, coords.y, cellStyle, coords.value);
        }
        //合并单元格
        if (lstCoords.length > 1) {
            let minCoords = lstCoords[0];
            let maxCoords = lstCoords[lstCoords.length - 1];
            this.lstRange.push({s: {r: minCoords.x, c: minCoords.y}, e: {r: maxCoords.x, c: maxCoords.y}})
        }
    }

    //自动设置列宽
    private static getWidthColByAuto(col: number, value: string): number {
        let widthCol = this.lstColInfo[col].wch || 0;
        let tempWidthCol = this.getWidthCol(value);
        if (widthCol < tempWidthCol) {
            widthCol = tempWidthCol;
        }
        return widthCol;
    }

    //根据字符串获取列宽
    private static getWidthCol(value: string): number {
        let chineseSum = 0;
        let englishSum = 0;
        let charSum = 0;
        for (let i = 0; i < value.length; i++) {
            if (this.isChineseChar(value.charCodeAt(i))) {
                chineseSum += 2;
                charSum += 2;
            } else {
                englishSum += 1;
                charSum += 1;
            }
        }
        charSum = charSum > 1 ? 13 + charSum - 1 : 13;
        if (chineseSum == 0 && englishSum > 0) {
            charSum += 4;
        } else if (chineseSum > 0 && englishSum > 0) {
            let percent = englishSum / chineseSum;
            if (percent < 0.2) {
                charSum -= 2;
            } else if (percent > 0.8) {
                charSum += 2;
            }
        }
        return charSum;
    }

    //判断是否为中文字符
    private static isChineseChar(charCode: number): boolean {
        return !(0 <= charCode && charCode <= 128);
    }

    //单元格数据写入
    private static setCellValue(sheet: WorkSheet, rowIndex: number, colIndex: number, cellStyle: CellStyle, value: string): void {
        XLSX.utils.sheet_add_aoa(sheet, [[{v: value, t: "s", s: cellStyle}]], {origin: {r: rowIndex, c: colIndex}});
    }

    //表头单元格数据写入
    private static saveHeaderCellValue(rowIndex: number, colIndex: number, cellStyle: CellStyle, value: string): void {
        this.lstValue[rowIndex][colIndex] = {v: value, t: "s", s: cellStyle};
    }

    //表格单元格数据写入
    private static saveCellValue(rowIndex: number, colIndex: number, cellStyle: CellStyle, value: string): void {
        if (rowIndex >= this.lstValue.length) {
            for (let i = this.lstValue.length; i <= rowIndex; i++) {
                this.lstValue.push([]);
            }
        }
        if (colIndex >= this.lstValue[rowIndex].length) {
            for (let i = this.lstValue[rowIndex].length; i <= colIndex; i++) {
                this.lstValue[rowIndex].push({v: "", t: "s", s: cellStyle});
            }
        }
        this.lstValue[rowIndex][colIndex].v = value;
    }

    public static getLastRowNum(): number {
        return this.lstValue.length - 1;
    }

    //表头标记矩阵初始化
    private static getFlagArray(rowSize: number, colSize: number): Array<Array<boolean>> {
        let lstFlag = new Array<Array<boolean>>();
        for (let i = 0; i < rowSize; i++) {
            let flags = new Array<boolean>();
            for (let j = 0; j < colSize; j++) {
                flags.push(false);
            }
            lstFlag.push(flags);
        }
        return lstFlag;
    }

    //获取单元格样式
    private static getCellStyle(dataRow: number, rowIndex: number): CellStyle {
        //单元格样式：带斑马纹表格
        let cellStyle;
        if (dataRow === -1 || rowIndex < dataRow) {
            //表头样式
            cellStyle = this.lstCellStyle[0];
        } else {
            //数据样式
            if (dataRow % 2 == 0) {
                if (rowIndex % 2 == 0) {
                    cellStyle = this.lstCellStyle[2];
                } else {
                    cellStyle = this.lstCellStyle[1];
                }
            } else {
                if (rowIndex % 2 != 0) {
                    cellStyle = this.lstCellStyle[2];
                } else {
                    cellStyle = this.lstCellStyle[1];
                }
            }
        }
        return cellStyle;
    }

    //数据写入到表中
    public static packSheet(name?: string): void {
        if (this.workbook == null) {
            this.workbook = XLSX.utils.book_new();
        }
        let sheet = XLSX.utils.aoa_to_sheet(this.lstValue);
        sheet["!rows"] = this.lstRowInfo;
        sheet["!cols"] = this.lstColInfo;
        sheet["!merges"] = this.lstRange;
        sheet["!freeze"] = this.freezeInfo;
        sheet["!images"] = this.lstPicture;
        XLSX.utils.book_append_sheet(this.workbook, sheet, name);
    }

    //导出excel文件
    public static write(fileName: string): void {
        if (this.workbook == null) {
            this.packSheet();
        }
        let XLSX_STYLE = require(path.join(
            __dirname,
            "../../../src/application/module/xlsx-style/xlsx.js"
        ));
        XLSX_STYLE.writeFile(this.workbook, fileName, {compression: 'DEFLATE'});
        this.workbook = null;

        // let JS_XLSX = require(path.join(
        //     __dirname,
        //     "../../../src/application/module/js-xlsx/xlsx.js"
        // ));
        // JS_XLSX.writeFile(this.workbook, fileName, {compression: 'DEFLATE'});
        // this.workbook = null;
    }

}