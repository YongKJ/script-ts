import {GenUtil} from "../../util/GenUtil";
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import {ExcelUtil} from "../../util/ExcelUtil";

export class ExceljsTest {

    private readonly excelPath: string;

    private constructor() {
        let value = GenUtil.getValue("exceljs-test.yaml", "excel-path");
        this.excelPath = GenUtil.anyToStr(value);
    }

    private async write(): Promise<void> {
        let lstHeader = [
            ["序号", "序号"],
            ["书名", "书名"],
            ["作者", "作者"],
            ["年代", "年代"],
            ["字数", "字数"],
        ];
        let lstData = [
            ["《水浒传》", "施耐庵", "宋朝", "96 万字"],
            ["《三国演义》", "罗贯中", "元朝", "73.4 万字"],
            ["《西游记》", "吴承恩", "明代", "82 万字"],
            ["《红楼梦》", "曹雪芹", "清代", "107.5 万字"],
            ["《聊斋志异》", "蒲松龄", "清代", "70.8 万字"],
        ];

        for (let num = 1; num <= 5; num++) {
            ExcelUtil.writeHeader(lstHeader, undefined, 1);
            for (let i = 0, rowIndex = 2; i < lstData.length; i++, rowIndex++) {
                let colIndex = 0;
                ExcelUtil.writeCellData(rowIndex, colIndex++, (i + 1) + "");
                for (let j = 0; j < lstData[i].length; j++) {
                    ExcelUtil.writeCellData(rowIndex, colIndex++, lstData[i][j]);
                }
            }
            // ExcelUtil.writePicture(2, 3, 2, 2,
            //     "C:\\Users\\admin\\Pictures\\Saved Pictures\\核心硬件评测.png");
            ExcelUtil.initSheet();
        }

        await ExcelUtil.write("C:\\Users\\admin\\Desktop\\demo-width-auto-" + Date.now() + ".xlsx");
    }

    private async read(): Promise<void> {
        let lstData = await ExcelUtil.toMap(this.excelPath, 0);
        let keys = lstData[0].keys();
        LogUtil.loggerLine(Log.of("ExceljsTest", "read", "lstData", lstData));
        LogUtil.loggerLine(Log.of("ExceljsTest", "read", "keys", keys));

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

    public static run(): void {
        // new ExceljsTest().test();
        // new ExceljsTest().read().then();
        new ExceljsTest().write().then();
    }

}