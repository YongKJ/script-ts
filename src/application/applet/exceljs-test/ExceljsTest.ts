import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {ExcelUtil} from "../../util/ExcelUtil";
import {FileUtil} from "../../util/FileUtil";
import {SheetUtil} from "../../util/SheetUtil";

export class ExceljsTest {

    private readonly excelPath: string;

    private constructor() {
        let value = GenUtil.getValue("excel-path");
        this.excelPath = GenUtil.anyToStr(value);
    }

    private async dataConversion(): Promise<void> {
        let fileNames = Array.of(
            "C:\\Users\\admin\\Desktop\\pi-mysql.txt",
            "C:\\Users\\admin\\Desktop\\windows7-mysql.txt"
        );
        let lstData = new Array<Array<string>>();
        let lstHeader = new Array<Array<string>>();
        lstHeader.push(Array.of("ID"));
        for (let fileName of fileNames) {
            let lstLine = FileUtil.readByLine(fileName);
            for (let i = 0; i < lstLine.length; i++) {
                let tempLstData = i < lstData.length ? lstData[i] : new Array<string>();
                let lineData = lstLine[i].replace(/'/g, "\"").trim();
                let recData = GenUtil.strToRecord(lineData);
                for (let key in recData) {
                    if (!recData.hasOwnProperty(key)) continue;
                    tempLstData.push(recData[key]);
                }
                if (i >= lstData.length) lstData.push(tempLstData);
            }

            let index = fileName.lastIndexOf(".");
            let tempIndex = fileName.lastIndexOf("\\");
            let prefix = fileName.substring(tempIndex + 1, index) + "-";
            prefix = prefix.replace("windows7", "win7");
            let lineData = lstLine[0].replace(/'/g, "\"").trim();
            let recData = GenUtil.strToRecord(lineData);
            for (let key in recData) {
                lstHeader.push(Array.of(prefix + key));
            }
        }
        ExcelUtil.writeHeader(lstHeader);
        for (let i = 0, rowIndex = lstHeader[0].length; i < lstData.length; i++, rowIndex++) {
            let colIndex = 0;
            ExcelUtil.writeCellData(rowIndex, colIndex++, (i + 1) + "");
            for (let j = 0; j < lstData[i].length; j++) {
                ExcelUtil.writeCellData(rowIndex, colIndex++, lstData[i][j]);
            }
        }
        await ExcelUtil.write("C:\\Users\\admin\\Desktop\\windows7-pi-mysql-data-" + Date.now() + ".xlsx");
    }

    private async write(): Promise<void> {
        let lstHeader = [
            ["序号"],
            ["书名"],
            ["作者"],
            ["年代"],
            ["字数"],
        ];
        let lstData = [
            ["《水浒传》", "施耐庵", "宋朝", "96 万字"],
            ["《三国演义》", "罗贯中", "元朝", "73.4 万字"],
            ["《西游记》", "吴承恩", "明代", "82 万字"],
            ["《红楼梦》", "曹雪芹", "清代", "107.5 万字"],
            ["《聊斋志异》", "蒲松龄", "清代", "70.8 万字"],
        ];

        let dataRow = lstHeader[0].length;
        for (let num = 1; num <= 5; num++) {
            SheetUtil.writeHeader(lstHeader, undefined, 1);
            for (let i = 0, rowIndex = dataRow; i < lstData.length; i++, rowIndex++) {
                let colIndex = 0;
                SheetUtil.writeCellData(rowIndex, colIndex++, (i + 1) + "");
                for (let j = 0; j < lstData[i].length; j++) {
                    SheetUtil.writeCellData(rowIndex, colIndex++, lstData[i][j]);
                }
            }
            // ExcelUtil.writePicture(2, 3, 2, 2,
            //     "C:\\Users\\admin\\Pictures\\Saved Pictures\\核心硬件评测.png");
            SheetUtil.packSheet();
        }

        SheetUtil.write("C:\\Users\\Admin\\Desktop\\demo-width-auto-" + Date.now() + ".xlsx");
    }

    private async writeTest(): Promise<void> {
        let lstData = await ExcelUtil.toMap(this.excelPath, 0);
        let lstKey = GenUtil.getKeys(lstData[0]);
        let lstHeader = new Array<Array<string>>();
        for (let key of lstKey) {
            lstHeader.push(Array.of(key));
        }
        let rowIndex = lstHeader[0].length;
        ExcelUtil.writeHeader(lstHeader, undefined, 1);
        for (let i = 0; i < lstData.length; i++, rowIndex++) {
            for (let j = 0, colIndex = 0; j < lstKey.length; j++, colIndex++) {
                ExcelUtil.writeCellData(rowIndex, colIndex, <string>lstData[i].get(lstKey[j]));
            }
        }
        await ExcelUtil.write("C:\\Users\\Admin\\Desktop\\demo-width-auto-" + Date.now() + ".xlsx");
    }

    private async read(): Promise<void> {
        let lstData = await ExcelUtil.toMap(this.excelPath, 0);
        let recData = GenUtil.arrayToRecList(lstData);
        let mapData = GenUtil.arrayToMapList(recData);
        let keys = lstData[0].keys();
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "lstData", lstData));
        // let jsonObj = GenUtil.isJson(recData[0]);
        // let instanceObj = GenUtil.isJson(new ExceljsTest());
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "recData[0]", (recData[0]).constructor));
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "jsonObj", jsonObj));
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "new ExceljsTest()", (new ExceljsTest().constructor)));
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "instanceObj", instanceObj));
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "recData", recData));
        LogUtil.loggerLine(Log.of("ExceljsTest", "read", "mapData", mapData));
        LogUtil.loggerLine(Log.of("ExceljsTest", "read", "keys", keys));
        LogUtil.loggerLine(Log.of("ExceljsTest", "read", "lstData[0] instanceof Map", (lstData[0] instanceof Map)));
        // FileUtil.write(
        //     "C:\\Users\\admin\\Desktop\\excel-to-json-test.json",
        //     GenUtil.recToStr(recData, true)
        // );

        // const workbook = new Workbook();
        // let book = await workbook.xlsx.readFile(this.excelPath);
        // let sheet = book.getWorksheet(1);

        // let ranges = this.getMerges(sheet);
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "ranges", ranges));

        // let values = sheet.getSheetValues();
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "sheet.getSheetValues()", values));

        // for (let rowIndex = 1; rowIndex <= sheet.rowCount; rowIndex++) {
        //     LogUtil.loggerLine(Log.of("ExceljsTest", "read", "rowIndex", rowIndex));
        //     let row = sheet.getRow(rowIndex);
        //     for (let colIndex = 1; colIndex <= row.cellCount; colIndex++) {
        //         let cell = row.getCell(colIndex);
        //         GenUtil.print(cell.value + " ");
        //     }
        //     GenUtil.println();
        // }

        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "sheet.rowCount", sheet.rowCount));
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "cellCount", sheet.getRow(1).cellCount));
        // sheet.eachRow((row, num) => {
        //     LogUtil.loggerLine(Log.of("ExceljsTest", "read", "num", num));
        //     LogUtil.loggerLine(Log.of("ExceljsTest", "eachRow", "row.values", row.values));
        // });

        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "sheet.columnCount", sheet.columnCount));
        // LogUtil.loggerLine(Log.of("ExceljsTest", "read", "cellCount", sheet.getColumn(1).headerCount));
        // for (let colIndex = 1; colIndex <= sheet.columnCount; colIndex++) {
        //     LogUtil.loggerLine(Log.of("ExceljsTest", "read", "colIndex", colIndex));
        //     let col = sheet.getColumn(colIndex);
        //     col.eachCell((cell, num) => {
        //         cell.style
        //         switch (cell.type) {
        //             case ValueType.Number:
        //                 GenUtil.print( "Number ");
        //                 GenUtil.print(cell.value + " ");
        //                 break;
        //             case ValueType.String:
        //                 GenUtil.print("String ");
        //                 GenUtil.print(cell.text.trim() + " ");
        //                 break;
        //         }
        //     });
        //     GenUtil.println();
            // LogUtil.loggerLine(Log.of("ExceljsTest", "eachRow", "col.values", col.values));
        // }
    }

    private test(): void {
        LogUtil.loggerLine(Log.of("ExceljsTest", "test", "excelPath", this.excelPath));
    }

    private test1(): void {
        const arr = new Array(3).fill(false).map(() => new Array(4).fill(false));
        LogUtil.loggerLine(Log.of("ExceljsTest", "test1", "arr", arr));
    }

    public static run(): void {
        // new ExceljsTest().test1();
        // new ExceljsTest().test();
        // new ExceljsTest().read().then();
        // new ExceljsTest().write().then();
        new ExceljsTest().writeTest().then();
        // new ExceljsTest().dataConversion().then();
    }

}